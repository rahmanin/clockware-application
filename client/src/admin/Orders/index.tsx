import React, {useState, useEffect, FunctionComponent, useMemo, useRef} from "react";
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
import {mastersLoading} from "../../store/masters/selectors";
import {getMasters} from "../../store/masters/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities} from "../../store/cities/actions";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import {getPrices} from "../../store/prices/actions";
import {deleteOrders, finishOrder, getOrders, updateOrder} from "../../store/orders/actions";
import {ordersList, ordersLoading} from "../../store/orders/selectors";
import { SelectValue } from "antd/lib/select";
import {UserData} from "../../store/users/actions";
import {OrderEditForm, OrdersFilterForm, OrdersPagination} from "../../store/orders/actions";
import queryString from 'query-string';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router';
import timeArray from "../../constants/timeArray";
import { useTranslation } from 'react-i18next';
import { CSVLink } from "react-csv";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image as ImagePDF } from '@react-pdf/renderer';

const { Option } = AutoComplete;
const { RangePicker } = DatePicker;

interface Size {
  id: number,
  size: string,
  price: number
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
  const [exportData, setExportData] = useState<object[]>([] as any)
  const { t } = useTranslation('common')
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
  const csvLink: any | null = useRef(null);
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },

    section: {
      margin: 30,
      flexGrow: 1
    },
    image: {
      width: 35,
      height: 36.2
    },
    logo: {
      flexDirection: 'row',
      alignItems: "center", 
      margin: "auto",
      marginBottom: 100
    },
    text: {
      textDecoration: "underline"
    }
  });
  
  const Check = (order: any) => (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={[styles.logo]}>
          <ImagePDF src="./img/Vector.png" style={styles.image}/> 
          <Text>
            Clockware
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Order ID</Text>
            <Text>Master</Text>
            <Text>Price</Text>
          </View>
          <View style={styles.section}>
            <Text>{order.order.order.order_id}</Text>
            <Text>{order.order.order.order_master}</Text>
            <Text>{order.order.order.order_price + order.order.order.additional_price}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={[styles.text]}>Date</Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text]}>{order.order.order.order_date}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

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
      .then(() => dispatch(finishOrder(editableItem.order_id, values)))
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
        .max(100, t("Order.errors.100 symbols max")),
      additional_price: Yup.number()
        .typeError(t("Order.errors.Price is incorrect"))
        .integer(t("Order.errors.Must be integer"))
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

  const xlsxDownload = () => {
    postData({...formikFilter.values, size: 999}, "orders_filter_sort")
      .then(res => setExportData(res.orders))
      .then(() => csvLink.current.link.click())
  }

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
      title: t("Order.Order ID"),
      dataIndex: "order_id",
      key: "1"
    },
    {
      title: t("Order.Image"),
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
      title: t("Order.Client ID"),
      dataIndex: "client_id",
      key: "2",
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({size: sortingOrder})}>
          <span>{t("Order.Size")}</span>
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
          <span>{t("Order.City")}</span>
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
          <span>{t("Order.Order date")}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.order_date}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.order_date}>&#9660;</span>
        </div>
      ),
      dataIndex: "order_date",
      key: "5",
    },
    {
      title: t("Order.Order time"),
      dataIndex: "order_time_start",
      key: "6"
    },
    {
      title: (
        <div className={"header_sort_wrapper"} onClick={() => sortBy({order_master: sortingOrder})}>
          <span>{t("Order.Order master")}</span>
          <span className="sort_arrow" hidden={!formikFilter.values.sortBy.order_master}>&#9650;</span>
          <span className="sort_arrow" hidden={!!formikFilter.values.sortBy.order_master}>&#9660;</span>
        </div>
      ),
      dataIndex: "order_master",
      key: "7",
    },
    {
      title: t("Order.Master ID"),
      dataIndex: "master_id",
      key: "8"
    },
    {
      title: t("Order.Order price"),
      key: "9",
      render: (record: Order) => {
        const totalPrice = Number(record.order_price) + record.additional_price;
        return totalPrice
      }
    },
    {
      title: t("Order.Client's Feedback"),
      key: "10",
      render: (record: Order) => {
        return (
          record.feedbacks_client && record.feedbacks_client.feedback
          ? <span className="feedback" onClick={() => handleOpenFeedback(record.feedbacks_client.feedback)}>{t("Order.buttons.Click to show")}</span> 
          : 
          "N/A"
        )
      }
    },
    {
      title: t("Order.Master's Feedback"),
      key: "11",
      render: (record: Order) => {
        return (
          record.feedback_master 
          ? <span className="feedback" onClick={() => handleOpenFeedback(record.feedback_master)}>{t("Order.buttons.Click to show")}</span> 
          : 
          "N/A"
        )
      }
    },
    {
      title: t("Order.Evaluation"),
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
      title: t("Order.Action"),
      key: "operation",
      render: (record: Order) => {
        if (isAdmin) {
          return (
            <Space>
              <Popconfirm
                title={t("Order.buttons.Are you sure?")}
                onConfirm={() => deleteOrder(record)}
                okText={t("Order.buttons.Yes")}
                cancelText={t("Order.buttons.No")}
              >
                <Button danger>{t("Order.buttons.Delete")}</Button>
              </Popconfirm>
                <Button 
                  type="dashed" 
                  onClick={() => handleOpenEdit(record)}
                >{t("Order.buttons.Edit")}</Button>
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

            >{`${t("Order.buttons.Pay")} ${totalPrice}$`}</Button>
          )
        } else if (userData?.userId === record.master_id && !record.is_done) {
          return (
            <Button 
              type="primary" 
              onClick={() => handleOpenFinish(record)} 
              hidden={record.is_done || isAdmin || !(record.master_id === userData.userId)}
            >{t("Order.buttons.Finish")}</Button>
          )
        } else if (userData?.userId === record.master_id && record.is_done) {
          return (
            <RerenderablePDF order={record}/>
          )
        } else {
          return "N/A"
        }
      }
    },
  ]

  const RerenderablePDF = (order: any) => {
    return useMemo(
      () => (
        <PDFDownloadLink document={<Check order={order}/>} fileName={`check${order.order.order_id}.pdf`}>
          {
            ({ blob, url, loading, error }) => (loading ? 'Loading...' : `check${order.order.order_id}.pdf`)
          }
        </PDFDownloadLink>
      ),
      [],
    )
  }

  const data = orders.orders && orders.orders.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  const exportHeaders = [
    {label: 'ID', key: 'order_id'},
    {label: 'Size', key: 'size'},
    {label: 'City', key: 'city'},
    {label: 'Order date', key: 'order_date'},
    {label: 'Order master', key: 'order_master'},
    {label: 'Order price', key: 'order_price'},
    {label: 'Additional price', key: 'additional_price'},
    {label: 'Is done', key: 'is_done'},
    {label: 'Order time', key: 'order_time_start'},
  ]

  if (sizesIsLoading || mastersIsLoading || citiesIsLoading || ordersIsLoading || isLoading) return <Loader />
  
  return <div>
    <div className="wrapper">
      <Form className="filter_form">
        <div className="combine_filter_items">
          <div className="form_item">
            <p>{t('Order.Sort.Filter by date')}</p>
            <RangePicker
              style={{width: 200}}
              onChange={value => handleChangeRangePicker(value)}
              value={dateRange}
              placeholder={[t("Order.placeholders.Start date"), t("Order.placeholders.End date")]}
            />
          </div>
          <div className="form_item">
            <p>{t('Order.Sort.Search by master')}</p>
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
          </div>
          <div className="form_item">
            <p>{t('Order.Sort.Search by city')}</p>
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
          </div>
        </div>
        <div className="combine_filter_items">
          <div className="form_item">
            <p>{t("Order.Sort.Show per page")}</p>
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
          </div>
          <div className="form_item show_all">
            <p>{t("Order.Sort.Show all")}</p>
            <Checkbox
              onChange={() => {
                formikFilter.setFieldValue('show_all', !formikFilter.values.show_all)
                formikFilter.setFieldValue("page", 0)
                setCurrentPage(1)
              }}
              checked={formikFilter.values.show_all}
            />
          </div>
          <div className="form_item">
            <div className="buttons">
              <Button 
                danger
                onClick={() => {
                  handleClearButton()
                  setCurrentPage(1)
                }}
              >
                {t("Order.buttons.Reset")}
              </Button>
              <CSVLink 
                data={exportData.length ? exportData : "str"} 
                headers={exportHeaders}
                filename="Exported-filtered-orders.xlsx"
                hidden={true}
                ref={csvLink}
              />
                <Button type="primary" onClick={xlsxDownload}>Export</Button>
            </div>
          </div>
        </div>
      </Form>
      <div className="wrapper_orders_table">
        <Table
          bordered={true}
          className='orders_table'
          pagination={false}
          columns={columns} 
          dataSource={data} 
          rowClassName={record => record.is_done ? "is_done" : ""}
        />
      </div>
      <div className="wrapper_pagination">
        <Pagination
          count={orders.totalPages}
          onChange={(obj, page) => submitPagination(page)}
          page={currentPage}
        />
      </div>
    </div>
    <Modal
      title={t("Order.Leave feedback and an additional price (not required)")}
      closable={true}
      onCancel={handleCancel}
      visible={openedFinish}
      footer={false}
      maskClosable={false}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item>
          <Input.TextArea
            name="feedback_master" 
            placeholder={t("Order.placeholders.100 symbols max")}
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.feedback_master}/>
          {formik.touched.feedback_master && formik.errors.feedback_master ? (
            <div className="error">{formik.errors.feedback_master}</div>
          ) : null}
        </Form.Item>
        <Form.Item>
          <Input 
            name="additional_price" 
            placeholder={t("Order.placeholders.Enter additional price")}
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
      title={t("Order.Feedback")}
      closable={true}
      onCancel={handleCancel}
      visible={openedFeedback}
      footer={false}
    >
      <div>{orderFeedback}</div>
    </Modal>
    <Modal
      title={t("Order.Edit")}
      closable={true}
      onCancel={handleCancel}
      visible={openedEdit}
      footer={false}
      maskClosable={false}
    >
      <Form>
        <p>{t("Order.Master")} {formikEdit.values.order_master} | {t("Order.City")} {formikEdit.values.city}</p>
        <Form.Item label={t("Order.Size")}>
          <Select
            value={formikEdit.values.size}
            onChange={value => handleEditSize(value)}
          >
            {size.map(el => <Select.Option key={el.id} value={`${el.size}|${el.price}`}>{el.size}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label={t("Order.Date")}>
          <DatePicker
            allowClear={false}
            onChange={(value: any) => handleEditDate(value)}
            disabledDate={disabledDate}
            value={formikEdit.values.order_date ? moment(formikEdit.values.order_date) : null}
            placeholder={t("Order.placeholders.Select date")}
          />
        </Form.Item>
        <Form.Item label={t("Order.Time")}>
          <Select 
            onChange={value => handleEditTime(value)}
            placeholder={t("Order.placeholders.Select time")}
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
          title={t("Order.buttons.Are you sure?")}
          onConfirm={() => formikEdit.handleSubmit()}
          okText={t("Order.buttons.Yes")}
          cancelText={t("Order.buttons.No")}
        >
          <Button 
            type="primary" 
            disabled={!formikEdit.values.order_time_start}
          >
          {t("Order.buttons.Update")}
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