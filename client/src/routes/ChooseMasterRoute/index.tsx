import React, { useState, useEffect } from "react";
import { headers } from "../../api/headers";
import { useFormik } from "formik";
import {Button} from "../../components/Button";
import {Loader} from "../../components/Loader";
import {postData} from "../../api/postData";
import {postImage} from "../../api/postImage";
import { ToastContainer, toast } from "react-toastify";
import {RadioCard} from "../../components/RadioCard";
import { useHistory } from "react-router-dom";
import dateTimeCurrent from "../../constants/dateTime";
import { routes } from "../../constants/routes";
import "./index.scss";
import { useSelector } from "react-redux";
import {orderForm} from "../../store/ordersClient/selectors";
import {useDispatch} from "react-redux";
import {mastersList, mastersLoading} from "../../store/masters/selectors";
import {getMasters, Master} from "../../store/masters/actions";
import {
  Form,
  Input,
  Modal,
  Button as AntdButton,
} from 'antd';
import {userParams} from "../../store/users/selectors";
import {logIn, UserData} from "../../store/users/actions";
import { ClientOrderForm } from "../../store/ordersClient/actions";
import { FeedbacksInfo } from "../../admin/Orders";
import { Order } from "../../store/orders/actions";


interface FreeTimePoint {
  free_time: number;
  free_masters: Master[];
}

interface OrderComplete {
  username: string, 
  email: string, 
  size?: string,
  city?: string,
  order_date: string,
  order_time_start?: string,
  order_time_end?: string,
  order_master?: string,
  order_price?: string,
  master_id?: number,
  image?: any,
  id?: number
}

export default function ChooseMaster() {
  const userData: UserData = useSelector(userParams);
  const order: ClientOrderForm = useSelector(orderForm)
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<FeedbacksInfo>({} as FeedbacksInfo)
  const [visible, setVisible] = useState<boolean>(true);
  const [ordersByCityByDate, setOrdersByCityByDate] = useState<Order[]>([]);
  const dispatch = useDispatch()
  const masters: Master[] = useSelector(mastersList)
  const mastersIsLoading: boolean = useSelector(mastersLoading)
  const [opened, openModal] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [unregisteredUserId, setUserId] = useState<null | number>(null);
  const isClient: boolean = userData && userData.role === "client";

  const clientInfo: {username: string, email: string} = {
    username: order.username,
    email: order.email
  }

  const history = useHistory();
  if (!order.email) history.push(routes.order);

  const handleCancel = () => {
    openModal(false);
    history.push(routes.order);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  useEffect(() => {
    if (!isClient) {
      postData(clientInfo, "check_user")
        .then(res => {
          if (res.id) {
            setUserId(res.id)
            setIsLoading(false)
          } else {
            setUserEmail(res.email)
            openModal(true)
            
          }
        })
        .catch(err => console.log("ERRRR", err))
    }
  }, [])

  useEffect(() => {
    dispatch(getMasters())

    const options: {method: string, headers: {}, body: string} = {
      method: "POST",
      headers,
      body: JSON.stringify(order),
    };
    fetch(`/api/orders_by_city`, options)
      .then((res) => res.json())
      .then((json) => setOrdersByCityByDate(json))
      .catch(err => console.log("ERROR:", err))
  }, []);

  const set: Set<string | undefined> = new Set(
    ordersByCityByDate
      .filter((el) => {
        return !(
          Number(el.order_time_start?.split(":")[0]) >
            Number(order.order_time_end?.split(":")[0]) ||
          Number(el.order_time_end?.split(":")[0]) <
            Number(order.order_time_start?.split(":")[0])
        );
      })
      .map((el) => el.order_master)
  );

  const busyMasters: Array<string | undefined> = Array.from(set);

  const mastersByCity: Master[] = masters.filter((el) => el.city === order.city);

  const freeMasters: Master[] = mastersByCity.filter(
    (el) => !busyMasters.includes(el.master_name)
  );

  const orderPost = (orderComplete: OrderComplete) => {
    const id: number = unregisteredUserId || (userData && userData.userId)
    postData({...orderComplete, id}, isClient ? "orders_logged_client" : "orders_unregistered_client")
      .then(res => toast.success(res.msg + ". Click here to return to orders page"))
      .then(() => setIsLoading(false))
      .catch(err => console.log("error", err))
  }

  const submitFunction = (values: {order_master?: string}) => {
    setIsLoading(true)
    const masterForm = values;
    const findFreeMaster = freeMasters.find(
      (el) => el.master_name === masterForm.order_master
    );
    const master_id = findFreeMaster?.id
    const orderComplete = { ...order, ...masterForm, master_id };
    setFinished(true);
    setIsDisabled(true);
    if (orderComplete.image) {
      const data = new FormData();
      data.append('file', orderComplete.image);
      postImage(data, "send_image")
        .then(res => orderComplete.image = res)
        .then(() => orderPost(orderComplete))
        .catch(err => console.log("error", err))
    } else {
      orderPost(orderComplete)
    }
  };

  const onFinish = (values: {password: string, email: string}) => {
    dispatch(logIn(values));
    openModal(false);
  };

  const onFinishFailed = (errorInfo: Object) => {
    console.log('Failed:', errorInfo);
  };

  let master = masters[0] ? freeMasters[0] : null;

  const formik = useFormik<{order_master?: string}>({
    initialValues: {
      order_master: master ? master.master_name : "",
    },
    onSubmit: (values) => submitFunction(values),
    enableReinitialize: true,
  });

  if (mastersIsLoading || isLoading) return <Loader />;

  const freeTimePoint: FreeTimePoint[]  = [];

  let hours = 8;

  if (order.order_date === dateTimeCurrent.cDate)
    hours = dateTimeCurrent.cTime;

  let setByEachHour: Set<string | undefined>, 
    busyMastersByEachHour: (string | undefined)[], 
    freeMastersByEachHour: Master[], 
    counter: number;

  if (order.size === "Small") {
    counter = 1;
  } else if (order.size === "Medium") {
    counter = 2;
  } else if (order.size === "Large") {
    counter = 3;
  }

  for (hours; hours < 18; hours++) {
    setByEachHour = new Set(
      ordersByCityByDate
        .filter((el) => {
          return !(
            Number(el.order_time_start?.split(":")[0]) > hours + counter ||
            Number(el.order_time_end?.split(":")[0]) < hours
          );
        })
        .map((el) => el.order_master)
    );

    busyMastersByEachHour = Array.from(setByEachHour);
    freeMastersByEachHour = mastersByCity.filter(
      (el) => !busyMastersByEachHour.includes(el.master_name)
    );
    if (freeMastersByEachHour.length)
      freeTimePoint.push({
        free_time: hours,
        free_masters: freeMastersByEachHour,
      });
  }

  const changeTime = (time: number) => {
    order.order_time_start = time + ":00";
    order.order_time_end = time + counter + ":00";
    setVisible(false);
  };

  if (!freeMasters.length && !freeTimePoint.length) {
    return (
      <div className="chooseMaster_wrapper">
        <h2 className="err_message">There are no free masters for your date</h2>
        <p className="err_message">Try to choose another date</p>
        <Loader />
      </div>
    );
  } else if (!freeMasters.length && !!freeTimePoint.length) {
    return (
      <div className="chooseMaster_wrapper">
        <h2 className="err_message">
          There are no free masters for your time. You can choose any another
          common time, or try another date
        </h2>
        <div className="new_time_wrapper">
          {freeTimePoint.map((el: FreeTimePoint) => {
            return (
              <button
                className="new_time_button"
                onClick={() => changeTime(el.free_time)}
                hidden={!visible}
              >
                {el.free_time}:00
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const onClickFeedbacks = (master_id: number|undefined) => {
    postData({master_id: master_id}, "feedbacks_by_master_id")
      .then(res => setFeedbacks(res))
  }

  const onClickShowAll = (master_id: number|undefined) => {
    postData({master_id: master_id, limit: feedbacks.totalFeedbacks}, "feedbacks_by_master_id")
      .then(res => setFeedbacks(res))
  }

  const onVisibleChangeFeedbacks = () => {
    return setFeedbacks({} as FeedbacksInfo)
  }

  return (
    <div className="chooseMaster_wrapper">
      <h1>Choose any free master:</h1>
      <form className="chooseMasterForm" onSubmit={formik.handleSubmit}>
        <div className="radio_wrapper">
          {freeMasters.map((el) => {
            return (
              <RadioCard
                onClick={() => setIsDisabled(false)}
                key={el.id}
                name="order_master"
                master_name={`${el.master_name}, ${order.order_time_start}`}
                rating={el.rating}
                onChange={formik.handleChange}
                value={el.master_name}
                disabled={finished}
                precision={0.25}
                feedbacks={feedbacks && feedbacks.feedbacks}
                onClickFeedbacks={() => onClickFeedbacks(el.id)}
                onClickShowAll={() => onClickShowAll(el.id)}
                hideShowAllButton={!!Object.keys(feedbacks).length && (feedbacks.feedbacks.length === feedbacks.totalFeedbacks)}
                onVisibleChange={() => onVisibleChangeFeedbacks()}
              />
            );
          })}
        </div>
        <Button
          id="button_master_submit"
          type="submit"
          color="black"
          title="Make an order"
          disabled={isDisabled}
        />
      </form>
      <Modal
        title="Client exists and is not logged in. Please, log in to continue"
        closable={true}
        onCancel={handleCancel}
        visible={opened}
        footer={false}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{
            email: userEmail,
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <AntdButton type="primary" htmlType="submit">
              Submit
            </AntdButton>
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        onClick={() => history.push(routes.order)}
      />
    </div>
  );
}
