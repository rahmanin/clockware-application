import React, { useContext } from "react";
import { useFormik } from 'formik';
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import Button from "../../components/Button";
import { useData } from "../../hooks/useData";
import dateTimeCurrent from "../../constants/dateTime";
import {OrderContext} from "../../providers/OrderProvider";
import Loader from "../../components/Loader";
import * as Yup from 'yup';
import './index.scss';

export default function MakingOrder () {
  const { addToOrder } = useContext(OrderContext);
  const cities = useData("cities");
  const size = useData("size");


  const submitFunction = values => {
    const splitSizePrice = values.sizePrice.split(", ");
    values.size = splitSizePrice[0];
    values.order_price = splitSizePrice[1];
    const orderForm = values;
    return addToOrder(orderForm)
  }

  const history = useHistory();
  
  const formik = useFormik({
    initialValues: {
      client_name: '',
      client_email: '',
      sizePrice: size.data[0] ? size.data[0].size + ", " + size.data[0].price : "",
      city: cities.data[0] ? cities.data[0].city : "",
      order_date: '',
      order_time: ''
    },
    validationSchema: Yup.object({
      client_name: Yup.string()
        .min(2, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Name is required'),
      client_email: Yup.string()
        .max(35, 'Too Long!') 
        .email('Invalid email address')
        .required('Email is required'),
      order_date: Yup.string()
        .required("Date is required"),
      order_time: Yup.string()
        .required("Time is required")
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true,
  });

  const formSubmit = () => {
    formik.handleSubmit();
    history.push(routes.chooseMaster);
  };

  if (cities.isLoading || size.isLoading) return <Loader />

  return (
    <div className="order_wrapper">
      <h1>To make an order, fill the form:</h1>
      <form className="orderForm">
        <label htmlFor="client_name">Name</label>
        <input
          className="field"
          required
          id="client_name"
          name="client_name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.client_name}
        />
        {formik.touched.client_name && formik.errors.client_name ? (
          <div className="error">{formik.errors.client_name}</div>
        ) : null}
        <label htmlFor="client_email">Email Address</label>
        <input
          required
          className="field"
          id="client_email"
          name="client_email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.client_email}
        />
        {formik.touched.client_email && formik.errors.client_email ? (
          <div className="error">{formik.errors.client_email}</div>
        ) : null}
        <label htmlFor="city">City</label>
        <select
          required
          className="field"
          id="city"
          name="city"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.city}
        >
          {cities.data.map(el => <option key={el.city}>{el.city}</option> )}
        </select>
        <label htmlFor="sizePrice">Size, price (hrn)</label>
        <select
          required
          className="field"
          id="sizePrice"
          name="sizePrice"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.sizePrice}
        >
          {size.data.map(el => <option key={el.size}>{el.size + ", " + el.price}</option>)}
        </select>
        <label htmlFor="order_date">Date</label>
        <input
          required
          className="field"
          id="order_date"
          name="order_date"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          min={dateTimeCurrent.cDate}
          value={formik.values.order_date}
        />
        {formik.touched.order_date && formik.errors.order_date ? (
          <div className="error">{formik.errors.order_date}</div>
        ) : null}
        <label htmlFor="order_time">Time</label>
        <input
          required
          className="field"
          id="order_time"
          name="order_time"
          type="time"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          min={dateTimeCurrent.cTime+1}
          value={formik.values.order_time}
          step="3600000"
        />
        {formik.touched.order_time && formik.errors.order_time ? (
          <div className="error">{formik.errors.order_time}</div>
        ) : null}
        <Button 
          type="button"
          color="black"
          title="Find your master"
          onClick={formSubmit}
          disabled={!(formik.isValid && formik.dirty)}/>      
      </form>
    </div>  
  );
};
