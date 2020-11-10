import React, {useState, useEffect} from "react";
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
import Loader from "../../components/Loader";
import dateTimeCurrent from "../../constants/dateTime";
import RadioCard from "../../components/RadioCard";
import RatingStars from "../../components/Rating";
import * as Yup from 'yup';
import moment from 'moment';
import updateElement from '../../api/updateElement';
import postData from '../../api/postData';
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

const { Option } = AutoComplete;
const { RangePicker } = DatePicker;

export default function Orders() {
  const userData = useSelector(userParams);
  const [isLoading, setIsLoading] = useState(false);
  const [openedFinish, openModalFinish] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openedFeedback, openModalFeedback] = useState(false);
  const [openedEdit, openModalEdit] = useState(false);
  const [feedbacks, setFeedbacks] = useState(null)
  const [sortingOrder, setSortingOrder] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [editableItem, setItem] = useState(null);
  const [orderFeedback, setOrderFeedback] = useState(null);
  const [freeTimePoint, setFreeTimePoint] = useState(null)
  const size = useSelector(pricesList);
  const masters = useSelector(mastersList);
  const cities = useSelector(citiesList);
  const orders = useSelector(ordersList);
  const mastersIsLoading = useSelector(mastersLoading);
  const citiesIsLoading = useSelector(citiesLoading);
  const sizesIsLoading = useSelector(pricesLoading);
  const ordersIsLoading = useSelector(ordersLoading);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getMasters())
    dispatch(getCities())
    dispatch(getPrices())
  }, [])

  const deleteOrder = el => {
    setIsLoading(true);
    updateElement(el, 'DELETE', "orders", el.order_id)
      .then(() => dispatch(deleteOrders(el.order_id)))
      .then(() => setIsLoading(false))
  }

  const doOrder = values => {
    setIsLoading(true)
    values.client_email = editableItem.client.client_email
    updateElement(values, 'PUT', "orders", editableItem.order_id)
      .then(() => dispatch(deleteOrders(editableItem.order_id)))
      .then(handleCancel())
      .then(() => setIsLoading(false))
  }

  const handleOpenFinish = order => {
    setItem(order);
    openModalFinish(true);
  }

  const handleOpenFeedback = order => {
    setOrderFeedback(order);
    openModalFeedback(true);
  }

  const handleOpenEdit = order => {
    setItem(order);
    openModalEdit(true);
  }

  const submitFunction = values => {
    doOrder(values);
  }

  const formik = useFormik({
    initialValues: {
      feedback_master: '',
      additional_price: '0',
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

  const submitFilter = values => {
    dispatch(getOrders(values))
  }

  const formikFilter = useFormik({
    initialValues: {
      order_date_start: null,
      order_date_end: null,
      master_params: null,
      city: null,
      sortByDate: true,
      sortBy: {order_date: true},
      show_all: false,
      page: 0,
      size: 5
    },
    onSubmit: values => submitFilter(values),
    enableReinitialize: true
  });

  const formFilterSubmit = () => {
    formikFilter.handleSubmit();
  };

  const submitEdit = values => {
    setIsLoading(true)
    values.order_time_end = Number(values.order_time_start.split(":")[0]) + counter + ":00";
    values.master_id = values.new_master.split(',')[0];
    values.order_master = values.new_master.split(',')[1];
    delete values.new_master;
    updateElement(values, 'PUT', "update_order", values.order_id)
      .then(() => dispatch(updateOrder(values.order_id, values)))
      .then(handleCancel())
      .then(() => setIsLoading(false))
  }

  const formikEdit = useFormik({
    initialValues: {
      order_id: editableItem ? editableItem.order_id : null,
      order_date: editableItem ? editableItem.order_date : null,
      size: editableItem ? editableItem.size : null,
      city: editableItem ? editableItem.city : null,
      order_price: editableItem ? editableItem.order_price : null,
      order_time_start: null,
      new_master: null,
    },
    onSubmit: values => submitEdit(values),
    enableReinitialize: true
  });

  const setFormikEditValuesNull = () => {
    setFreeTimePoint(null)
    formikEdit.setFieldValue("new_master", null)
    formikEdit.setFieldValue("order_time_start", null)
  }

  const submitPagination = page => {
    setCurrentPage(page)
    formikFilter.setFieldValue('page', page-1)
  }

  const sortBy = column => {
    setSortingOrder(!sortingOrder)
    formikFilter.setFieldValue("sortBy", column)
    formikFilter.setFieldValue("page", 0)
    setCurrentPage(1)
  }

  const handleSearch = value => {
    if (value && value.length >= 2) {
      postData({searchParam: value}, "find_master")
        .then(response => setSearchResult(response))
    }
  };

  const handleChangeRangePicker = value => {
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
    formikFilter.handleReset()
    setDateRange(null)
  }

  useEffect(() => {
    formFilterSubmit()
  }, [formikFilter.values])

  let counter;
  if (formikEdit.values.size === "Small") {
    counter = 1;
  } else if (formikEdit.values.size === "Medium") {
    counter = 2;
  } else if (formikEdit.values.size === "Large") {
    counter = 3;
  }

  const handleFindOrders = () => {

    postData(formikEdit.values, 'orders_by_city')
      .then(response => {
        const mastersByCity = masters.filter(el => el.city === formikEdit.values.city);
        const freeTimePointArray = [];
        let hours;
        if (formikEdit.values.order_date === dateTimeCurrent.cDate) {
          hours = dateTimeCurrent.cTime
        } else {
          hours = 8
        }
        let setOfBusyMastersByEachHour, busyMastersByEachHour, freeMastersByEachHour;
        
        for (hours; hours < 18; hours++) {
          setOfBusyMastersByEachHour = new Set(
            response
              .filter((el) => {
                return !(
                  Number(el.order_time_start.split(":")[0]) > hours + counter ||
                  Number(el.order_time_end.split(":")[0]) < hours
                );
              })
              .map((el) => el.order_master)
          );
          busyMastersByEachHour = Array.from(setOfBusyMastersByEachHour);
          freeMastersByEachHour = mastersByCity.filter(
            (el) => !busyMastersByEachHour.includes(el.master_name)
          );
          if (freeMastersByEachHour.length) {
            freeTimePointArray.push({
              free_time: hours,
              free_masters: freeMastersByEachHour,
            });
          }
        }
        setFreeTimePoint(freeTimePointArray)
      }
    )
  }

  const handleEditSize = value => {
    formikEdit.setFieldValue('size', value[0])
    formikEdit.setFieldValue('order_price', value[1])
    setFormikEditValuesNull()
  }

  const handleEditCity = value => {
    formikEdit.setFieldValue('city', value)
    setFormikEditValuesNull()
  }

  const handleEditDate = value => {
    formikEdit.setFieldValue('order_date', moment(value).format('YYYY-MM-DD'))
    setFormikEditValuesNull()
  }

  const handleEditTime = value => {
    formikEdit.setFieldValue('order_time_start', `${value}:00`)
    formikEdit.setFieldValue("new_master", null)
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

  const handleCancel = () => {
    setFormikEditValuesNull()
    openModalFinish(false);
    openModalFeedback(false);
    openModalEdit(false)
    setItem(null);
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
      render: record => {
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
      dataIndex: "order_price",
      key: "9"
    },
    {
      title: "Client's Feedback",
      key: "10",
      render: record => {
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
      render: record => {
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
      render: record => {
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
      render: record => {
        if (userData.is_admin) {
          return (
            <Space>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => deleteOrder(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>
                <Button 
                  type="dashed" 
                  onClick={() => handleOpenEdit(record)}
                >Edit</Button>
            </Space>
          )
        } else {
          return userData.usedId != record.master_id || record.is_done
          ? "N/A" 
          : 
          (<Button 
            type="primary" 
            onClick={() => handleOpenFinish(record)} 
            hidden={record.is_done || userData.is_admin || !(record.master_id === userData.usedId)}
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
            type="danger" 
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
        rowClassName={record => record.is_done && "is_done"}
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
        <Form.Item label="Size">
          <Select
            value={formikEdit.values.size}
            onChange={value => handleEditSize(value)}
          >
            {size.map(el => <Select.Option key={el.id} value={[el.size, el.price]}>{el.size}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="City">
          <Select 
            name="City"
            onChange={value => handleEditCity(value)}
            value={formikEdit.values.city}
          >
            {cities.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker
            allowClear={false}
            value={moment(formikEdit.values.order_date, 'YYYY/MM/DD') || null}
            onChange={value => handleEditDate(value)}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            onClick={() => handleFindOrders()}
          >
            {"Find masters"}
          </Button>
        </Form.Item>
        {
          freeTimePoint && freeTimePoint.length ? 
            <Form.Item label="Time">
              <Select 
                name="Time"
                onChange={value => handleEditTime(value)}
              >
                {freeTimePoint.map(el => 
                  <Select.Option 
                    key={el.free_time} 
                    value={el.free_time}
                  >{el.free_time}:00
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
            : 
            freeTimePoint && <p>No free masters by your request</p>
        }
        <div className="wrapper_radio_cards">
          {
            formikEdit.values.order_time_start ? 
              freeTimePoint.filter(
                el => el.free_time + ":00" === formikEdit.values.order_time_start
              )[0].free_masters.map(el => {
                return (
                  <RadioCard
                    key={el.id}
                    name="new_master"
                    master_name={el.master_name}
                    rating={el.rating}
                    onChange={formikEdit.handleChange}
                    value={[el.id, el.master_name]}
                    precision={0.25}
                    feedbacks={feedbacks && feedbacks.feedbacks}
                    onClickFeedbacks={() => onClickFeedbacks(el.id)}
                    onClickShowAll={() => onClickShowAll(el.id)}
                    hideShowAllButton={feedbacks && (feedbacks.feedbacks.length === feedbacks.totalFeedbacks)}
                    onVisibleChange={target => onVisibleChangeFeedbacks(target)}
                  />
                );
              })
            :
            null
          }
        </div>  
        <Popconfirm
          title="Are you sure?"
          onConfirm={formikEdit.handleSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            hidden={!formikEdit.values.new_master}
          >
          {"Update"}
        </Button>
      </Popconfirm>
      </Form>
    </Modal>
  </div>
}