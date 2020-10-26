import React, { useContext, useState, useEffect } from "react";
import { headers } from "../../api/headers";
import { useFormik } from "formik";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useData } from "../../hooks/useData";
import { OrderContext } from "../../providers/OrderProvider";
import postData from "../../api/postData";
import { ToastContainer, toast } from "react-toastify";
import RadioCard from "../../components/RadioCard";
import { useHistory } from "react-router-dom";
import dateTimeCurrent from "../../constants/dateTime";
import { routes } from "../../constants/routes";
import "./index.scss";

export default function ChooseMaster() {
  const { order } = useContext(OrderContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [finished, setFinished] = useState(false);
  const [feedbacks, setFeedbacks] = useState(null)
  const [visible, setVisible] = useState(true);
  const [ordersByCityByDate, setOrdersByCityByDate] = useState([]);
  const masters = useData("masters");

  useEffect(() => {
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(order[0]),
    };
    fetch(`/api/orders_by_city`, options)
      .then((res) => res.json())
      .then((json) => {
        setOrdersByCityByDate(json);
      });
  }, []);

  const set = new Set(
    ordersByCityByDate
      .filter((el) => {
        return !(
          Number(el.order_time_start.split(":")[0]) >
            Number(order[0].order_time_end.split(":")[0]) ||
          Number(el.order_time_end.split(":")[0]) <
            Number(order[0].order_time_start.split(":")[0])
        );
      })
      .map((el) => el.order_master)
  );

  const busyMasters = Array.from(set);

  const mastersByCity = masters.data.filter((el) => el.city === order[0].city);

  const freeMasters = mastersByCity.filter(
    (el) => !busyMasters.includes(el.master_name)
  );

  const history = useHistory();
  if (!order.length) history.push(routes.order);

  const submitFunction = (values) => {
    const masterForm = values;
    const master_id = freeMasters.find(
      (el) => el.master_name === masterForm.order_master
    ).id;
    const orderComplete = { ...order[0], ...masterForm, master_id };
    setFinished(true);
    setIsDisabled(true);
    return postData(orderComplete, "orders").then((res) =>
      toast.success(res.msg + ". Click here to return to orders page")
    );
  };

  if (!order.length) history.push(routes.order);

  let master = masters.data[0] ? freeMasters[0] : null;

  const formik = useFormik({
    initialValues: {
      order_master: master ? master.master_name : "",
    },
    onSubmit: (values) => submitFunction(values),
    enableReinitialize: true,
  });

  if (masters.isLoading) return <Loader />;

  const freeTimePoint = [];

  let hours = 8;

  if (!!order[0] && order[0].order_date === dateTimeCurrent.cDate)
    hours = dateTimeCurrent.cTime;

  let setByEachHour, busyMastersByEachHour, freeMastersByEachHour, counter;

  if (!!order[0] && order[0].size === "Small") {
    counter = 1;
  } else if (!!order[0] && order[0].size === "Medium") {
    counter = 2;
  } else if (!!order[0] && order[0].size === "Large") {
    counter = 3;
  }

  for (hours; hours < 18; hours++) {
    setByEachHour = new Set(
      ordersByCityByDate
        .filter((el) => {
          return !(
            Number(el.order_time_start.split(":")[0]) > hours + counter ||
            Number(el.order_time_end.split(":")[0]) < hours
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

  const changeTime = (a) => {
    order[0].order_time_start = a + ":00";
    order[0].order_time_end = a + counter + ":00";
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
          {freeTimePoint.map((el) => {
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

  const onClickFeedbacks = master_id => {
    postData({master_id: master_id}, "feedbacks_by_master_id")
      .then(res => setFeedbacks(res))
  }

  const onClickShowAll = master_id => {
    postData({master_id: master_id, limit: feedbacks.totalFeedbacks}, "feedbacks_by_master_id")
      .then(res => setFeedbacks(res))
  }

  const onVisibleChangeFeedbacks = target => {
    if (!target) return setFeedbacks(null)
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
                master_name={`${el.master_name}, ${order[0].order_time_start}`}
                rating={el.rating}
                onChange={formik.handleChange}
                value={el.master_name}
                disabled={finished}
                precision={0.25}
                feedbacks={feedbacks && feedbacks.feedbacks}
                onClickFeedbacks={() => onClickFeedbacks(el.id)}
                onClickShowAll={() => onClickShowAll(el.id)}
                hideShowAllButton={feedbacks && (feedbacks.feedbacks.length === feedbacks.totalFeedbacks)}
                onVisibleChange={target => onVisibleChangeFeedbacks(target)}
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
