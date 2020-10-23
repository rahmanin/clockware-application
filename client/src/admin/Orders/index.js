import React, {useState, useContext} from "react";
import './index.scss';
import {
  Button,
  Modal, 
  Form, 
  Input, 
  Table, 
  DatePicker, 
  InputNumber, 
  Select, 
  Radio} from 'antd';
import Loader from "../../components/Loader";
import RatingStars from "../../components/Rating";
import * as Yup from 'yup';
import moment from 'moment';
import updateElement from '../../api/updateElement';
import postData from '../../api/postData';
import { useFormik } from 'formik';
import {FinishedOrdersContext} from '../../providers/FinishedOrdersProvider';
import {useData} from "../../hooks/useData";
import {UsersContext} from "../../providers/UsersProvider";
import Pagination from '@material-ui/lab/Pagination';

export default function Orders() {
  const { userData } = useContext(UsersContext)
  const { setIsLoading, isLoading, orders, updateToContext, useOrders, updateFilteredOrders } = useContext(FinishedOrdersContext);
  useOrders()
  const [openedFinish, openModalFinish] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openedFeedback, openModalFeedback] = useState(false);
  const [editableItem, setItem] = useState(null);
  const cities = useData("cities");

  const doOrder = values => {
    setIsLoading(true)
    values.client_email = editableItem.client.client_email
    updateElement(values, 'PUT', "orders", editableItem.order_id)
      .then(() => updateToContext(editableItem.order_id, values.feedback_master, values.additional_price, values.is_done))
      .then(handleCancel())
  }

  const handleOpenFinish = (order) => {
    setItem(order);
    openModalFinish(true);
  }

  const handleOpenFeedback = (order) => {
    setItem(order);
    openModalFeedback(true);
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

  const handleCancel = () => {
    openModalFinish(false);
    openModalFeedback(false);
    setItem(null);
  };

  const submitFilter = values => {
    setIsLoading(true)
    values.order_date = values.order_date_moment && moment(values.order_date_moment).format('YYYY-MM-DD');
    values.page = 0
    postData(values, "orders_filter_sort")
      .then(res => updateFilteredOrders(res))
      .then(() => setCurrentPage(1))
  }

  const formikFilter = useFormik({
    initialValues: {
      order_date_moment: null,
      master_id: null,
      city: null,
      isSortedByDESC: null,
      show_finished: null,
      page: 0,
      size: 5
    },
    onSubmit: values => submitFilter(values),
    enableReinitialize: true
  });

  const formFilterSubmit = () => {
    formikFilter.handleSubmit();
  };

  const submitPagination = page => {
    setIsLoading(true)
    setCurrentPage(page)
    formikFilter.values.order_date = formikFilter.values.order_date_moment && moment(formikFilter.values.order_date_moment).format('YYYY-MM-DD');
    formikFilter.values.page = page - 1
    postData(formikFilter.values, "orders_filter_sort")
      .then(res => updateFilteredOrders(res))
  }

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "1"
    },
    {
      title: "Client ID",
      dataIndex: "client_id",
      key: "2"
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "3"
    },
    {
      title: "City",
      dataIndex: "city",
      key: "4"
    },
    {
      title: "Order date",
      dataIndex: "order_date",
      key: "5"
    },
    {
      title: "Order time",
      dataIndex: "order_time_start",
      key: "6"
    },
    {
      title: "Order master",
      dataIndex: "order_master",
      key: "7"
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
          record.feedback_client 
          ? <span className="feedback" onClick={() => handleOpenFeedback(record.feedback_client)}>Click to show</span> 
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
      title: "Evatuation",
      key: "12",
      render: record => {
        return (
          record.evaluation 
          ? <RatingStars value={record.evaluation} readOnly={true}/> 
          : 
          "N/A"
        )
      }
    },
    {
      title: "Action",
      key: "operation",
      render: record => {
        return userData.is_admin || userData.usedId != record.master_id || record.is_done
        ? "N/A" 
        : 
        (<Button 
          type="primary" 
          onClick={() => handleOpenFinish(record)} 
          hidden={record.is_done || userData.is_admin || !(record.master_id === userData.usedId)}
        >Finish</Button>)
      }
    },
  ]
  
  const data = orders.orders && orders.orders.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  if (isLoading) return <Loader />

  return <div>
    <div className="wrapper">
      <Form>
        <Form.Item label="Filter by date">
          <DatePicker 
            name="order_date_moment"
            onChange={value => formikFilter.setFieldValue('order_date_moment', value)}
            value={formikFilter.values.order_date_moment}
          />
        </Form.Item>
        <Form.Item label="Filter by master ID">
          <InputNumber
            name="master_id"
            placeholder="Integer"
            min={1}
            onChange={value => formikFilter.setFieldValue('master_id', value)}
            value={formikFilter.values.master_id}
          />
        </Form.Item>
        <Form.Item label="Filter by city">
          <Select
            onChange={value => formikFilter.setFieldValue('city', value)}
            value={formikFilter.values.city}
          >
            {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Sort by date">
          <Select
            onChange={value => formikFilter.setFieldValue('isSortedByDESC', value)}
            value={formikFilter.values.isSortedByDESC}
          >
            <Select.Option value={true}>{"Descending"}</Select.Option>
            <Select.Option value={false}>{"Ascending"}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Radio.Group
            options={[
              { label: 'Show All', value: null },
              { label: 'Show finished', value: true },
              { label: 'Show unfinished', value: false },
            ]}
            onChange={value => formikFilter.setFieldValue('show_finished', value.target.value)}
            value={formikFilter.values.show_finished}
          />
        </Form.Item>
        <Form.Item label="Show per page">
          <Radio.Group
            options={[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '25', value: 25 },
            ]}
            onChange={value => formikFilter.setFieldValue('size', value.target.value)}
            value={formikFilter.values.size}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            onClick={formFilterSubmit}
          >
            {"Submit"}
          </Button>
          <Button 
            className={"clear_button"}
            type="danger" 
            onClick={formikFilter.handleReset}
          >
            {"Clear"}
          </Button>
        </Form.Item>
      </Form>
      <Table 
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
      <div>{editableItem}</div>
    </Modal>
  </div>
}