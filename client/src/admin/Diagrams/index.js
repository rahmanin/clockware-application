import React, { useState, useEffect } from "react";
import "./index.scss";
import {
  Form, 
  Table, 
  DatePicker, 
  Select} from 'antd';
import {useData} from "../../hooks/useData";
import { useFormik } from 'formik';
import moment from 'moment';
import postData from '../../api/postData';
import { 
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Cell,
  Pie } from 'recharts';

const { RangePicker } = DatePicker;

export default function Diagrams() {
  const [dateRange, setDateRange] = useState(null);
  const [diagramData, setDiagramData] = useState(null);
  const cities = useData("cities");
  const masters = useData("masters");

  const submitDiagram = values => {
    postData(values, "orders_diagram")
      .then(res => setDiagramData(res))
  }

  const formikDiagram = useFormik({
    initialValues: {
      order_date_start: null,
      order_date_end: null,
      master_params: [],
      city: [],
    },
    onSubmit: values => submitDiagram(values),
    enableReinitialize: true
  });

  const formDiagramSubmit = () => {
    formikDiagram.handleSubmit();
  };

  const handleChangeRangePicker = value => {
    setDateRange(value)
    if (value) {
      formikDiagram.setFieldValue("order_date_start", moment(value[0]).format('YYYY-MM-DD'));
      formikDiagram.setFieldValue("order_date_end", moment(value[1]).format('YYYY-MM-DD'));
    } else {
      formikDiagram.setFieldValue("order_date_start", null);
      formikDiagram.setFieldValue("order_date_end", null);
    }
  }

  useEffect(() => {
    formDiagramSubmit()
  }, [formikDiagram.values])

  const colors = [
    '#1485ff',
    '#1d52de',
    '#09267d',
    '#04133d',
  ]

  const countsByDate = {};
  const countsByCity = {};
  const countsByMaster = {};

  diagramData && diagramData.map(order => order.order_date).forEach(i => countsByDate[i] = (countsByDate[i] || 0)+1);
  diagramData && diagramData.map(order => order.city).forEach(i => countsByCity[i] = (countsByCity[i] || 0)+1);
  diagramData && diagramData.map(order => order.order_master).forEach(i => countsByMaster[i] = (countsByMaster[i] || 0)+1);

  const dataByDateDiagram = Object.entries(countsByDate).map(el => {return {'Date': el[0], "Orders": el[1]}})
  const dataByCity = Object.entries(countsByCity).map(el => {return {'City': el[0], "Orders": el[1]}})
  const dataByMaster = Object.entries(countsByMaster).map(el => {return {'Master': el[0], "Orders": el[1]}})

  dataByMaster.sort((a,b)=>b["Orders"]-a["Orders"])
  const dataByMasterDiagram = dataByMaster.splice(0,3)
  const otherMasters = {"Master": "Others", "Orders": dataByMaster.reduce((acc, el) => acc + el["Orders"], 0)}
  dataByMasterDiagram.push(otherMasters)

  dataByCity.sort((a,b)=>b["Orders"]-a["Orders"])
  const dataByCityDiagram = dataByCity.splice(0,3)
  const otherCities = {"City": "Others", "Orders": dataByCity.reduce((acc, el) => acc + el["Orders"], 0)}
  dataByCityDiagram.push(otherCities)

  const setOfMasters = diagramData && Array.from(new Set(diagramData.map(el => el.order_master)))

  const ordersSummaryByMaster = setOfMasters && setOfMasters.map(master => {
    return {
      name: master,
      total: diagramData.filter(el => el.order_master === master).length,
      small: diagramData.filter(el => el.order_master === master && el.size === "Small").length,
      medium: diagramData.filter(el => el.order_master === master && el.size === "Medium").length,
      large: diagramData.filter(el => el.order_master === master && el.size === "Large").length,
      completed: diagramData.filter(el => el.order_master === master && el.is_done === true).length,
      incompleted: diagramData.filter(el => el.order_master === master && el.is_done === false).length,
      cash_amount: diagramData.filter(el => el.order_master === master).reduce((total, el) => el.order_price + el.additional_price + total, 0)
    }
  })

  const ordersAmount = diagramData && {
    name: "All",
    total: diagramData.length,
    small: diagramData.filter(el => el.size === "Small").length,
    medium: diagramData.filter(el => el.size === "Medium").length,
    large: diagramData.filter(el => el.size === "Large").length,
    completed: diagramData.filter(el => el.is_done === true).length,
    incompleted: diagramData.filter(el => el.is_done === false).length,
    cash_amount: diagramData.reduce((total, el) => el.order_price + el.additional_price + total, 0)
  }

  ordersSummaryByMaster && ordersSummaryByMaster.push(ordersAmount)

  const columns = [
    {
      title: "",
      dataIndex: "name",
      key: "1"
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "2"
    },
    {
      title: "Small",
      dataIndex: "small",
      key: "3"
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: "4"
    },
    {
      title: "Large",
      dataIndex: "large",
      key: "5"
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "6"
    },
    {
      title: "Incompleted",
      dataIndex: "incompleted",
      key: "7"
    },
    {
      title: "Cash amount",
      dataIndex: "cash_amount",
      key: "6"
    },
  ]

  const dataTable = ordersSummaryByMaster && ordersSummaryByMaster.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  return (
    <div className="wrapper_charts">
      <Form className="diagram_form">
        <Form.Item className="diagram_form_item">
          <RangePicker 
            style={{width: 250}}
            onChange={value => handleChangeRangePicker(value)}
            value={dateRange}
          />
        </Form.Item>
        <Form.Item className="diagram_form_item">
          <Select
            style={{width: 250}}
            mode="multiple"
            onChange={value => formikDiagram.setFieldValue('city', value)}
            value={formikDiagram.values.city}
            placeholder="Cities"
          >
            {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item className="diagram_form_item">
          <Select
            style={{width: 250}}
            mode="multiple"
            onChange={value => formikDiagram.setFieldValue('master_params', value)}
            value={formikDiagram.values.master_params}
            placeholder="Masters"
          >
            {masters.data.map(el => <Select.Option key={el.id} value={el.id}>{el.master_name}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
      <LineChart 
        width={1000} 
        height={450} 
        data={dataByDateDiagram}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis label={{ value: 'Q u a n t i t y', angle: -90, position: 'insideLeft' }}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Orders" stroke="#376af0" />
      </LineChart>
      <div className="wrapper_pie_chart">
        <PieChart width={550} height={420}>
          <Pie data={dataByCityDiagram} dataKey={"Orders"} cx="50%" cy="50%" outerRadius={175} label>
            {
              dataByCityDiagram.map((el, index) => (
                <Cell name={el["City"]} key={`cell-${el["City"]}`} fill={colors[index]}/>
              ))
            }
          </Pie>
          <Legend 
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
        <PieChart width={550} height={420}>
          <Pie data={dataByMasterDiagram} dataKey={"Orders"} cx="50%" cy="50%" outerRadius={175} label>
            {
              dataByMasterDiagram.map((el, index) => (
                <Cell name={el["Master"]} key={`cell-${el["Master"]}`} fill={colors[index]}/>
              ))
            }
          </Pie>
          <Legend 
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </div>
      <Table
        bordered={true}
        className='summary_table'
        pagination={false}
        columns={columns} 
        dataSource={dataTable} 
      />
    </div>
  );
}
