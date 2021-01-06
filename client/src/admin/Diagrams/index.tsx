import React, { useState, useEffect, FunctionComponent } from "react";
import "./index.scss";
import {
  Form, 
  Table, 
  DatePicker, 
  Select} from 'antd';
import {Loader} from "../../components/Loader";
import { useFormik } from 'formik';
import moment from 'moment';
import {postData} from '../../api/postData';
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
  Pie} from 'recharts';
import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {mastersList, mastersLoading} from "../../store/masters/selectors";
import {getMasters} from "../../store/masters/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities} from "../../store/cities/actions";
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

interface DiagramForm {
  order_date_start?: string,
  order_date_end?: string,
  master_params?: Array<number>,
  city?: Array<string>,
}

const CellWithNameProp = Cell as any // because original "Cell" does not have prop "name" 

interface OrderData {
  order_date: string,
  city: string,
  order_master: string,
  size: string,
  order_price: number,
  is_done: boolean,
  additional_price: number
}

interface Column {
  title: string,
  dataIndex: string,
  key: number
}

interface DataByDate {
  date: string, 
  orders: number
}

interface DataByCity {
  city: string, 
  orders: number
}

interface DataByMaster {
  master: string, 
  orders: number
}

interface OrdersSummary {
  name: string,
  total: number,
  small: number,
  medium: number,
  large: number,
  completed: number,
  incompleted: number,
  cash_amount: number,
  key?: number
}

export const Diagrams: FunctionComponent = () => {
  const { t } = useTranslation('common')
  const [dateRange, setDateRange] = useState<any>([]);
  const [fullListOfDates, setFullListOfDates] = useState<Array<DataByDate>>([]);
  const [diagramData, setDiagramData] = useState<OrderData[]>([]);
  const cities: Array<Object> = useSelector(citiesList);
  const citiesIsLoading: boolean = useSelector(citiesLoading);
  const masters: Array<Object> = useSelector(mastersList);
  const mastersIsLoading: boolean = useSelector(mastersLoading);
  const dispatch: Function = useDispatch();
  
  useEffect((): void => {
    dispatch(getMasters())
    dispatch(getCities())
  }, [])

  const getDatesArray = function(start: string, end: string) {
    const arr: Array<DataByDate> = [];
    let dt: Date;
    for(dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push({date: moment(dt).format('YYYY-MM-DD'), orders: 0});
    }
    setFullListOfDates(arr)
  };

  const submitDiagram = (values: DiagramForm): Promise<any> => {
    return postData(values, "orders_diagram")
      .then(res => {
        setDiagramData(res)
        values.order_date_start && values.order_date_end ?
          getDatesArray(values.order_date_start, values.order_date_end)
          :
          getDatesArray(res[0].order_date, res[res.length - 1].order_date)
      })
  }

  const formikDiagram = useFormik<DiagramForm>({
    initialValues: {
      order_date_start: undefined,
      order_date_end: undefined,
      master_params: [],
      city: [],
    },
    onSubmit: (values: DiagramForm) => submitDiagram(values),
    enableReinitialize: true
  });

  const formDiagramSubmit = (): void => {
    formikDiagram.handleSubmit();
  };

  const handleChangeRangePicker = (value: any): void => {
    setDateRange(value)
    if (value) {
      formikDiagram.setFieldValue("order_date_start", moment(value[0]).format('YYYY-MM-DD'));
      formikDiagram.setFieldValue("order_date_end", moment(value[1]).format('YYYY-MM-DD'));
    } else {
      formikDiagram.setFieldValue("order_date_start", null);
      formikDiagram.setFieldValue("order_date_end", null);
    }
  }
  
  useEffect((): void => {
    formDiagramSubmit()
  }, [formikDiagram.values])

  const colors: string[] = [
    '#1485ff',
    '#1d52de',
    '#09267d',
    '#04133d',
  ]

  const countsByDate: Record<string, number> = {};
  const countsByCity: Record<string, number> = {};
  const countsByMaster: Record<string, number> = {};

  diagramData?.map((order: OrderData): string => order.order_date).forEach((i: string): number => countsByDate[i] = (countsByDate[i] || 0)+1);
  diagramData?.map((order: OrderData): string => order.city).forEach((i: string): number => countsByCity[i] = (countsByCity[i] || 0)+1);
  diagramData?.map((order: OrderData): string => order.order_master).forEach((i: string): number => countsByMaster[i] = (countsByMaster[i] || 0)+1);


  const dataByDateDiagram: Array<DataByDate> = Object.entries(countsByDate).map((el: [string, number]) => {return {date: el[0], orders: el[1]}})
  const dataByCity: Array<DataByCity> = Object.entries(countsByCity).map((el: [string, number]) => {return {city: el[0], orders: el[1]}})
  const dataByMaster: Array<DataByMaster> = Object.entries(countsByMaster).map((el: [string, number]) => {return {master: el[0], orders: el[1]}})

  const linearDiagramData: Array<DataByDate> = fullListOfDates.map(el => dataByDateDiagram.find(el2 => el.date === el2.date) || el)

  dataByMaster.sort((a: DataByMaster, b: DataByMaster) => b.orders-a.orders)
  const dataByMasterDiagram: Array<DataByMaster> = dataByMaster.splice(0,3)
  const otherMasters: DataByMaster = {master: "Others", orders: dataByMaster.reduce((acc: number, el: DataByMaster) => acc + el.orders, 0)}
  dataByMasterDiagram.push(otherMasters)

  dataByCity.sort((a: DataByCity, b: DataByCity) => b.orders-a.orders)
  const dataByCityDiagram: Array<DataByCity> = dataByCity.splice(0,3)
  const otherCities: DataByCity = {city: "Others", orders: dataByCity.reduce((acc: number, el: DataByCity) => acc + el.orders, 0)}
  dataByCityDiagram.push(otherCities)

  const setOfMasters: Array<string> = diagramData && Array.from(new Set(diagramData.map((el: OrderData) => el.order_master)))

  const ordersSummaryByMaster: OrdersSummary[] = setOfMasters && setOfMasters.map(master => {
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

  const ordersAmount: OrdersSummary = diagramData && {
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

  const columns: Column[] = [
    {
      title: "",
      dataIndex: "name",
      key: 1
    },
    {
      title: t("Statistics.Total"),
      dataIndex: "total",
      key: 2
    },
    {
      title: "Small",
      dataIndex: "small",
      key: 3
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: 4
    },
    {
      title: "Large",
      dataIndex: "large",
      key: 5
    },
    {
      title: t("Statistics.Completed"),
      dataIndex: "completed",
      key: 6
    },
    {
      title: t("Statistics.Incompleted"),
      dataIndex: "incompleted",
      key: 7
    },
    {
      title: t("Statistics.Cash amount"),
      dataIndex: "cash_amount",
      key: 6
    },
  ]

  const dataTable: OrdersSummary[] = ordersSummaryByMaster && ordersSummaryByMaster.map((el, index) => {
    return {
      key: index,
      ...el
    }
  })

  if (citiesIsLoading || mastersIsLoading) return <Loader/>

  return (
    <div className="wrapper_charts">
      <Form className="diagram_form">
        <Form.Item className="diagram_form_item">
          <RangePicker 
            style={{width: 250}}
            onChange={value => handleChangeRangePicker(value)}
            value={dateRange}
            placeholder={[t("Statistics.placeholders.Start date"), t("Statistics.placeholders.End date")]}
          />
        </Form.Item>
        <Form.Item className="diagram_form_item">
          <Select
            style={{width: 250}}
            mode="multiple"
            onChange={value => formikDiagram.setFieldValue('city', value)}
            value={formikDiagram.values.city}
            placeholder={t("Statistics.placeholders.Cities")}
          >
            {cities.map((el: any) => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item className="diagram_form_item">
          <Select
            style={{width: 250}}
            mode="multiple"
            onChange={value => formikDiagram.setFieldValue('master_params', value)}
            value={formikDiagram.values.master_params}
            placeholder={t("Statistics.placeholders.Masters")}
          >
            {masters.map((el: any) => <Select.Option key={el.id} value={el.id}>{el.master_name}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
      <div className="linechart_wrapper">
        <LineChart 
          width={1000} 
          height={450} 
          data={linearDiagramData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: `${t('Statistics.Orders')}`, angle: -90, position: 'insideLeft' }}/>
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#376af0" />
        </LineChart>
      </div>
      <div className="wrapper_pie_charts">
        <div className="pie_chart">
          <h2>{t("Statistics.Cities")}</h2>
          <PieChart width={450} height={400}>
            <Pie data={dataByCityDiagram} dataKey={"orders"} cx="50%" cy="50%" outerRadius={150} label>
              {
                dataByCityDiagram.map((el, index) => (
                  <CellWithNameProp name={el.city} key={`cell-${el.city}`} fill={colors[index]}/>
                ))
              }
            </Pie>
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="top"
            />
          </PieChart>
        </div>
        <div className="pie_chart">
          <h2>{t("Statistics.Masters")}</h2>
          <PieChart width={450} height={400}>
            <Pie data={dataByMasterDiagram} dataKey={"orders"} cx="50%" cy="50%" outerRadius={150} label>
              {
                dataByMasterDiagram.map((el, index) => (
                  <CellWithNameProp name={el.master} key={`cell-${el.master}`} fill={colors[index]}/>
                ))
              }
            </Pie>
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="top"
            />
          </PieChart>
        </div>
      </div>
      <div className="wrapper_summary_table">
        <Table
          bordered={true}
          className='summary_table'
          pagination={false}
          columns={columns} 
          dataSource={dataTable} 
        />
      </div>
    </div>
  );
}
