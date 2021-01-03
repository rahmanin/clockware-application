import React, {useState, useEffect, FunctionComponent} from "react";
import './index.scss';
import {
  Button,
  Modal, 
  Form, 
  Input, 
  Table, 
  DatePicker, 
  Select, 
  Image,
  Checkbox,
  AutoComplete,
  Popconfirm,
  Space,
  Radio} from 'antd';
import {Loader} from "../../components/Loader";
import dateTimeCurrent from "../../constants/dateTime";
import {RatingStars} from "../../components/Rating";
import * as Yup from 'yup';
import moment, { Moment } from 'moment';
import {updateElement} from '../../api/updateElement';
import {postData} from '../../api/postData';
import { useFormik } from 'formik';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector } from "react-redux";
import {userParams} from "../../store/users/selectors";
import {useDispatch} from "react-redux";
import {mastersList, mastersLoading} from "../../store/masters/selectors";
import {getMasters} from "../../store/masters/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities} from "../../store/cities/actions";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import {getPrices} from "../../store/prices/actions";
import {deleteOrders, getOrders, updateOrder} from "../../store/orders/actions";
import {ordersList, ordersLoading} from "../../store/orders/selectors";
import { SelectValue } from "antd/lib/select";
import {UserData} from "../../store/users/actions";
import {OrderEditForm, OrdersFilterForm, OrdersPagination} from "../../store/orders/actions";
import queryString from 'query-string';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router';
import timeArray from "../../constants/timeArray";

const { Option } = AutoComplete;
const { RangePicker } = DatePicker;

interface Size {
  id: number,
  size: string,
  price: number
}

interface Master{
  id: number,
  city: string,
  master_name: string,
  rating: number
}

interface City {
  id: number,
  city: string
}

interface Order {
  order_id: number,
  size: string,
  city: string,
  order_date: string,
  order_master: string,
  feedback_master: string,
  order_price: number,
  additional_price: number,
  is_done: boolean,
  master_id: number,
  order_time_start: string,
  order_time_end: string,
  client_id: number,
  image: string,
  user: {
    email: string
  },
  feedbacks_client: {
    feedback: string, 
    evaluation: number
  },
  isPaid: boolean
}

interface DoOrderForm {
  email: string,
  feedback_master: string,
  additional_price: number,
  is_done: boolean,
}

interface Feedback {
  evaluation: number,
  createdAt: string,
  feedback?: string
}

export interface FeedbacksInfo { 
  totalFeedbacks: number, 
  feedbacks: Feedback[]
}

export const Orders: FunctionComponent = () => {
  const userData: UserData = useSelector(userParams);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openedFinish, openModalFinish] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openedFeedback, openModalFeedback] = useState<boolean>(false);
  const [openedEdit, openModalEdit] = useState<boolean>(false);
  const [sortingOrder, setSortingOrder] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchResult, setSearchResult] = useState([]);
  const [editableItem, setItem] = useState<Order>({} as Order);
  const [orderFeedback, setOrderFeedback] = useState<string>("");
  const [ordersByDate, setOrdersByDate] = useState<any>(null);
  const [freeTimePoint, setFreeTimePoint] = useState<Array<any>>([])
  const size: Size[] = useSelector(pricesList);
  const cities: City[] = useSelector(citiesList);
  const orders: OrdersPagination = useSelector(ordersList);
  const mastersIsLoading = useSelector<boolean>(mastersLoading);
  const citiesIsLoading = useSelector<boolean>(citiesLoading);
  const sizesIsLoading = useSelector<boolean>(pricesLoading);
  const ordersIsLoading = useSelector<boolean>(ordersLoading);
  const isAdmin: boolean = userData && userData.role === "admin";
  const isClient: boolean = userData && userData.role === "client";
  const dispatch: Function = useDispatch();
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  let counter: number;

  useEffect(() => {
    toast.success(paramsURL.msg)
    dispatch(getMasters())
    dispatch(getCities())
    dispatch(getPrices())
  }, [])

  const deleteOrder = (el: Order) => {
    setIsLoading(true);
    updateElement(el, 'DELETE', "orders", el.order_id)
      .then(() => dispatch(deleteOrders(el.order_id)))
      .then(() => setIsLoading(false))
  }

  const doOrder = (values: DoOrderForm) => {
    setIsLoading(true)
    values.email = editableItem.user.email
    updateElement(values, 'PUT', "orders", editableItem.order_id)
      .then(() => dispatch(deleteOrders(editableItem.order_id)))
      .then(() => handleCancel())
      .then(() => setIsLoading(false))
  }

  const handleOpenFinish = (order: Order) => {
    setItem(order);
    openModalFinish(true);
  }

  const handleOpenFeedback = (feedback: string) => {
    setOrderFeedback(feedback);
    openModalFeedback(true);
  }

  const handleOpenEdit = (order: Order) => {
    setItem(order);
    openModalEdit(true);
    postData({master_id: order.master_id, city: order.city}, 'orders_by_city')
      .then(response => {
        const setOfDates: Set<string> = new Set(response.map((el: Order) => el.order_date));
        const arrayOfDates: Array<string> = Array.from(setOfDates);
        let busyByDate: Array<any> = arrayOfDates.map(el => {return {order_date: el, orders: response.filter((order: Order) => order.order_date === el)}})
        setOrdersByDate(busyByDate)
        getFreeTimeByDate(busyByDate, order.size)
      })
  }

  const getFreeTimeByDate = (busyByDate: Array<any>, size?: string) => {
    if (size === "Small") {
      counter = 1;
    } else if (size === "Medium") {
      counter = 2;
    } else if (size === "Large") {
      counter = 3;
    }
    const freeTimePointArray: any = [];
    busyByDate?.map((el: any) => {
      let freeTimeArray = timeArray
      el.orders.map((order: Order) => {
        freeTimeArray = freeTimeArray.filter(hour => {
          return (Number(order.order_time_start.split(":")[0]) > hour + counter ||
          Number(order.order_time_end.split(":")[0]) < hour)
        })
      })
      freeTimePointArray.push({order_date: el.order_date, free_time: freeTimeArray})
    })
    return setFreeTimePoint(freeTimePointArray)
  }

  const disabledDate = (current: moment.Moment) => {
    const busyDatesArray = freeTimePoint.filter(date => date.free_time.length === 0).map(el => el.order_date)
    let index = busyDatesArray.findIndex(date => date === moment(current).format('YYYY-MM-DD'))
    const checkToday = dateTimeCurrent.cTime > 17 ? dateTimeCurrent.tomorrowDate : dateTimeCurrent.cDate
    return current < moment(checkToday) || !(index === -1 && true)
  }

  const submitFunction = (values: DoOrderForm) => {
    doOrder(values);
  }

  const formik = useFormik<DoOrderForm>({
    initialValues: {
      email: "",
      feedback_master: '',
      additional_price: 0,
      is_done: true,
     },
    validationSchema: Yup.object({
      feedback_master: Yup.string()
        .max(100, 'Too Long!'),
      additional_price: Yup.number()
        .typeError("Price is incorrect")
        .integer("Must be integer")
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const submitFilter = (values: OrdersFilterForm) => {
    dispatch(getOrders(values))
  }

  const formikFilter = useFormik<OrdersFilterForm>({
    initialValues: {
      order_date_start: "",
      order_date_end: "",
      master_params: "",
      city: "",
      sortByDate: true,
      sortBy: {order_date: true},
      show_all: false,
      page: 0,
      size: 5,
    },
    onSubmit: values => submitFilter(values),
    enableReinitialize: true
  });

  const formFilterSubmit = () => {
    formikFilter.handleSubmit();
  };

  const submitEdit = (values: OrderEditForm) => {
    setIsLoading(true)
    if (values.size === "Small") {
      counter = 1;
    } else if (values.size === "Medium") {
      counter = 2;
    } else if (values.size === "Large") {
      counter = 3;
    }
    values.order_time_end = Number(values.order_time_start.split(":")[0]) + counter + ":00";
    console.log(values)
    updateElement(values, 'PUT', "update_order", values.order_id)
      .then(() => dispatch(updateOrder(values.order_id, values)))
      .then(() => handleCancel())
      .then(() => setIsLoading(false))
  }

  const formikEdit = useFormik<OrderEditForm>({
    initialValues: {
      order_id: editableItem?.order_id,
      order_date: "",
      size: editableItem?.size,
      city: editableItem?.city,
      order_price: editableItem?.order_price,
      order_time_start: "",
      email: editableItem?.user?.email,
      order_master: editableItem?.order_master,
      master_id: `${editableItem?.master_id}`
    },
    onSubmit: values => submitEdit(values),
    enableReinitialize: true
  });

  const setFormikEditValuesNull = () => {
    setFreeTimePoint([])
    formikEdit.setFieldValue("order_time_start", null)
  }

  const submitPagination = (page: number) => {
    setCurrentPage(page)
    formikFilter.setFieldValue('page', page-1)
  }

  const sortBy = (column: {[key: string]: boolean}) => {
    setSortingOrder(!sortingOrder)
    formikFilter.setFieldValue("sortBy", column)
    formikFilter.setFieldValue("page", 0)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    if (value && value.length >= 2) {
      postData({searchParam: value}, "find_master")
        .then(response => setSearchResult(response))
    }
  };

  const handleChangeRangePicker = (value: any) => {
    setDateRange(value)
    if (value) {
      formikFilter.setFieldValue("order_date_start", moment(value[0]).format('YYYY-MM-DD'));
      formikFilter.setFieldValue("order_date_end", moment(value[1]).format('YYYY-MM-DD'));
    } else {
      formikFilter.setFieldValue("order_date_start", null);
      formikFilter.setFieldValue("order_date_end", null);
    }
    formikFilter.setFieldValue("page", 0)
    setCurrentPage(1)
  }

  const handleClearButton = () => {
    formikFilter.resetForm()
    setDateRange(null)
  }

  useEffect(() => {
    formFilterSubmit()
  }, [formikFilter.values])

  const handleEditSize = (value: string) => {
    formikEdit.setFieldValue('size', value.split("|")[0])
    formikEdit.setFieldValue('order_price', value.split("|")[1])
    formikEdit.setFieldValue('order_date', "")
    setFormikEditValuesNull()
    getFreeTimeByDate(ordersByDate, value.split("|")[0])
  }

  const handleEditDate = (value: Moment) => {
    formikEdit.setFieldValue('order_date', moment(value).format('YYYY-MM-DD'))
    setFormikEditValuesNull()
    getFreeTimeByDate(ordersByDate, formikEdit.values.size)
  }

  const handleEditTime = (value: SelectValue) => {
    formikEdit.setFieldValue('order_time_start', `${value}:00`)
  }

  const handleCancel = () => {
    setFormikEditValuesNull()
    openModalFinish(false);
    openModalFeedback(false);
    openModalEdit(false)
    setItem({} as Order);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "1"
    },
    {
      title: "Image",
      key: "11122",
      render: (record: Order) => {
        return (
          record.image 
          ? <Image width={50} src={record.image}/> 
          : 
          "N/A"
        )
      }
    },
    {
      title: "Client ID",
      dataIndex: "client_id",
      key: "2",
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({size: sortingOrder})}>
          <span>{"Size"}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.size}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.size}>&#9660;</span>
        </div>
      ),
      dataIndex: "size",
      key: "3", 
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({city: sortingOrder})}>
          <span>{"City"}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.city}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.city}>&#9660;</span>
        </div>
      ),
      dataIndex: "city",
      key: "4"
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({order_date: sortingOrder})}>
          <span>{"Order date"}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.order_date}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.order_date}>&#9660;</span>
        </div>
      ),
      dataIndex: "order_date",
      key: "5",
    },
    {
      title: "Order time",
      dataIndex: "order_time_start",
      key: "6"
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({order_master: sortingOrder})}>
          <span>{"Order master"}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.order_master}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.order_master}>&#9660;</span>
        </div>
      ),
      dataIndex: "order_master",
      key: "7",
    },
    {
      title: "Master ID",
      dataIndex: "master_id",
      key: "8"
    },
    {
      title: "Order price",
      key: "9",
      render: (record: Order) => {
        const totalPrice = Number(record.order_price) + record.additional_price;
        return totalPrice
      }
    },
    {
      title: "Client's Feedback",
      key: "10",
      render: (record: Order) => {
        return (
          record.feedbacks_client && record.feedbacks_client.feedback
          ? <span className="feedback" onClick={() => handleOpenFeedback(record.feedbacks_client.feedback)}>Click to show</span> 
          : 
          "N/A"
        )
      }
    },
    {
      title: "Master's Feedback",
      key: "11",
      render: (record: Order) => {
        return (
          record.feedback_master 
          ? <span className="feedback" onClick={() => handleOpenFeedback(record.feedback_master)}>Click to show</span> 
          : 
          "N/A"
        )
      }
    },
    {
      title: "Evaluation",
      key: "12",
      render: (record: Order) => {
        return (
          record.feedbacks_client 
          ? <RatingStars value={record.feedbacks_client.evaluation} readOnly={true}/> 
          : 
          "N/A"
        )
      }
    },
    {
      title: "Action",
      key: "operation",
      render: (record: Order) => {
        if (isAdmin) {
          return (
            <Space>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => deleteOrder(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
                <Button 
                  type="dashed" 
                  onClick={() => handleOpenEdit(record)}
                >Edit</Button>
            </Space>
          )
        } else if (isClient && record.is_done && !record.isPaid) {
          const totalPrice = record.order_price + record.additional_price;
          return (
            <Button
              type="primary"
              onClick={() => {
                setIsLoading(true)
                fetch(`/api/pay/${record.order_id}`)
                  .then(res => res.json())
                  .then(res => {
                    window.location = res.payLink
                  })
                  .catch(e => console.log("ERROR", e))
                }
              }

            >{`Pay ${totalPrice}$`}</Button>
          )
        } else {
          return userData?.userId != record.master_id || record.is_done
          ? "N/A" 
          : 
          (<Button 
            type="primary" 
            onClick={() => handleOpenFinish(record)} 
            hidden={record.is_done || isAdmin || !(record.master_id === userData.userId)}
          >Finish</Button>)
        }
      }
    },
  ]

  const data = orders.orders && orders.orders.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  if (sizesIsLoading || mastersIsLoading || citiesIsLoading || ordersIsLoading || isLoading) return <Loader />
  
  return <div>
    <div className="wrapper">
      <Form className="filter_form">
        <Form.Item className="form_item">
          <p>{'Filter by date'}</p>
          <RangePicker
            style={{width: 200}}
            onChange={value => handleChangeRangePicker(value)}
            value={dateRange}
          />
        </Form.Item>
        <Form.Item className="form_item">
          <p>{'Search by master'}</p>
          <AutoComplete
            allowClear={formikFilter.values.master_params != null}
            style={{width: 200}}
            onSearch={handleSearch}
            onChange={value => !value ? formikFilter.setFieldValue("master_params", null) : null}
            defaultValue={formikFilter.values.master_params}
            onSelect={value => {
              formikFilter.setFieldValue("master_params", value)
              formikFilter.setFieldValue("page", 0)
              setCurrentPage(1)
            }}
          >
            {searchResult.map(master => (
              <Option key={master} value={master}>
                {master}
              </Option>
            ))}
          </AutoComplete>
        </Form.Item>
        <Form.Item className="form_item">
          <p>{'Search by city'}</p>
          <Select
            style={{width: 200}}
            allowClear={formikFilter.values.city != null}
            onChange={value => {
              formikFilter.setFieldValue('city', value)
              formikFilter.setFieldValue("page", 0)
              setCurrentPage(1)
            }}
            value={formikFilter.values.city}
          >
            {cities.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item className="form_item" label="Show all">
          <Checkbox
            onChange={() => {
              formikFilter.setFieldValue('show_all', !formikFilter.values.show_all)
              formikFilter.setFieldValue("page", 0)
              setCurrentPage(1)
            }}
            checked={formikFilter.values.show_all}
          />
        </Form.Item>
        <Form.Item className="form_item" label='Show per page'>
          <Radio.Group
            options={[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '25', value: 25 },
            ]}
            onChange={value => {
              formikFilter.setFieldValue('size', value.target.value)
              formikFilter.setFieldValue("page", 0)
              setCurrentPage(1)
            }}
            value={formikFilter.values.size}
          />
        </Form.Item>
        <Form.Item className="form_item">
          <Button 
            danger
            onClick={() => {
              handleClearButton()
              setCurrentPage(1)
            }}
          >
            {"Reset"}
          </Button>
        </Form.Item>
      </Form>
      <Table
        bordered={true}
        className='orders_table'
        pagination={false}
        columns={columns} 
        dataSource={data} 
        rowClassName={record => record.is_done ? "is_done" : ""}
      />
      <Pagination
        count={orders.totalPages}
        onChange={(obj, page) => submitPagination(page)}
        page={currentPage}
      />
    </div>
    <Modal
      title={"Leave feedback and an additional price (not required)"}
      closable={true}
      onCancel={handleCancel}
      visible={openedFinish}
      footer={false}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="Text">
          <Input.TextArea
            name="feedback_master" 
            placeholder="100 symbols max"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.feedback_master}/>
          {formik.touched.feedback_master && formik.errors.feedback_master ? (
            <div className="error">{formik.errors.feedback_master}</div>
          ) : null}
        </Form.Item>
        <Form.Item label="Price">
          <Input 
            name="additional_price" 
            placeholder="Enter additional price"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.additional_price}/>
          {formik.touched.additional_price && formik.errors.additional_price ? (
            <div className="error">{formik.errors.additional_price}</div>
          ) : null}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={formSubmit}>{"Ok"}</Button>
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      title={"Feedback"}
      closable={true}
      onCancel={handleCancel}
      visible={openedFeedback}
      footer={false}
    >
      <div>{orderFeedback}</div>
    </Modal>
    <Modal
      title={"Edit"}
      closable={true}
      onCancel={handleCancel}
      visible={openedEdit}
      footer={false}
    >
      <Form>
        <p>Master: {formikEdit.values.order_master} | City: {formikEdit.values.city}</p>
        <Form.Item label="Size">
          <Select
            value={formikEdit.values.size}
            onChange={value => handleEditSize(value)}
          >
            {size.map(el => <Select.Option key={el.id} value={`${el.size}|${el.price}`}>{el.size}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker
            allowClear={false}
            onChange={(value: any) => handleEditDate(value)}
            disabledDate={disabledDate}
            value={formikEdit.values.order_date ? moment(formikEdit.values.order_date) : null}
          />
        </Form.Item>
        <Form.Item label="Time">
          <Select 
            onChange={value => handleEditTime(value)}
            placeholder="Select time"
            value={formikEdit.values.order_time_start}
            disabled={!formikEdit.values.order_date}
          >
            {!ordersByDate?.find((el: any) => el.order_date === formikEdit.values.order_date) ?
              timeArray.map(el => 
                <Select.Option 
                  key={el} 
                  value={el}
                  hidden={dateTimeCurrent.cDate === formikEdit.values.order_date && dateTimeCurrent.cTime > el}
                >{el}:00
                </Select.Option>
              )
                :
              freeTimePoint?.find(el => el.order_date === formikEdit.values.order_date)?.free_time.map((el: any) =>
                <Select.Option 
                  key={el} 
                  value={el}
                  hidden={dateTimeCurrent.cDate === formikEdit.values.order_date && dateTimeCurrent.cTime > el}
                >{el}:00
                </Select.Option>
              )
            }
          </Select>
        </Form.Item>
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => formikEdit.handleSubmit()}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            disabled={!formikEdit.values.order_time_start}
          >
          {"Update"}
        </Button>
      </Popconfirm>
      </Form>
    </Modal>
    <ToastContainer
      className="toast"
      position="top-center"
      autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
}