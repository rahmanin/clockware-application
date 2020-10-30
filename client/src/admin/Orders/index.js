import React, {useState, useContext, useEffect} from "react";
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
import RatingStars from "../../components/Rating";
import * as Yup from 'yup';
import moment from 'moment';
import updateElement from '../../api/updateElement';
import postData from '../../api/postData';
import { useFormik } from 'formik';
import {FinishedOrdersContext} from '../../providers/FinishedOrdersProvider';
import {useData} from "../../hooks/useData";
import {MastersContext} from '../../providers/MastersProvider';
import {UsersContext} from "../../providers/UsersProvider";
import Pagination from '@material-ui/lab/Pagination';
import { SMALLINT } from "sequelize";
const { Option } = AutoComplete;
const { RangePicker } = DatePicker;

export default function Orders() {
  const { userData } = useContext(UsersContext)
  const { masters, useMasters } = useContext(MastersContext);
  const { setIsLoading, isLoading, orders, updateToContext, updateFilteredOrders, deleteFromContext } = useContext(FinishedOrdersContext);
  useMasters()
  const [openedFinish, openModalFinish] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openedFeedback, openModalFeedback] = useState(false);
  const [openedEdit, openModalEdit] = useState(false);
  const [sortingOrder, setSortingOrder] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [editableItem, setItem] = useState(null);
  const cities = useData("cities");
  const size = useData("size");
  const mastersArray = masters.map(master => `${master.master_name}, id:${master.id}`)
  
  const deleteElement = el => {
    setIsLoading(true);
    updateElement(el, 'DELETE', "orders", el.order_id)
      .then(() => deleteFromContext(el.order_id))
  }

  const doOrder = values => {
    setIsLoading(true)
    values.client_email = editableItem.client.client_email
    updateElement(values, 'PUT', "orders", editableItem.order_id)
      .then(() => updateToContext(editableItem.order_id, values.feedback_master, values.additional_price, values.is_done))
      .then(handleCancel())
  }

  const handleOpenFinish = order => {
    setItem(order);
    openModalFinish(true);
  }

  const handleOpenFeedback = order => {
    setItem(order);
    openModalFeedback(true);
  }

  const handleOpenEdit = order => {
    console.log(order)
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

  const handleCancel = () => {
    openModalFinish(false);
    openModalFeedback(false);
    openModalEdit(false)
    setItem(null);
  };

  const submitFilter = values => {
    setIsLoading(true)
    values.page = 0
    postData(values, "orders_filter_sort")
      .then(res => updateFilteredOrders(res))
      .then(() => setCurrentPage(1))
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
    console.log("submitEdit", values)
  }

  const formikEdit = useFormik({
    initialValues: {
      order_date: editableItem ? editableItem.order_date : null,
      size: editableItem ? editableItem.size : null,
      city: editableItem ? editableItem.city : null
    },
    onSubmit: values => submitEdit(values),
    enableReinitialize: true
  });

  const submitPagination = page => {
    setIsLoading(true)
    setCurrentPage(page)
    formikFilter.values.page = page - 1
    postData(formikFilter.values, "orders_filter_sort")
      .then(res => updateFilteredOrders(res))
  }

  const sortBy = column => {
    setSortingOrder(!sortingOrder)
    formikFilter.setFieldValue("sortBy", column)
  }

  const handleSearch = value => {
    let res = [];

    if (!value) {
      res = [];
    } else {
      res = mastersArray.map(master => master.toLowerCase().includes(value.toLowerCase()) ? master : null);
    }
    setSearchResult(res.filter(el => el != null));
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
  }

  const handleClearButton = () => {
    formikFilter.handleReset()
    setDateRange(null)
  }

  useEffect(() => {
    formFilterSubmit()
  }, [formikFilter.values])

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
                onConfirm={() => deleteElement(record)}
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

  if (isLoading) return <Loader />

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
            onSelect={value => formikFilter.setFieldValue("master_params", value)}
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
            onChange={value => formikFilter.setFieldValue('city', value)}
            value={formikFilter.values.city}
          >
            {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item className="form_item" label="Show all">
          <Checkbox
            onChange={() => formikFilter.setFieldValue('show_all', !formikFilter.values.show_all)}
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
            onChange={value => formikFilter.setFieldValue('size', value.target.value)}
            value={formikFilter.values.size}
          />
        </Form.Item>
        <Form.Item className="form_item">
          <Button 
            type="danger" 
            onClick={() => handleClearButton()}
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
      <div>{editableItem}</div>
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
          <Select>
            {size.data.map(el => <Select.Option key={el.id} value={el.size}>{el.size}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="City">
          <Select>
            {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
          >
            {"Find masters"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
}