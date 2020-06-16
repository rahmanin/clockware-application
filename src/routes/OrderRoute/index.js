import React  from "react";
import { useFormik } from 'formik';
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import Button from "../../components/Button";
import { useData } from "../../hooks/useData";
import dateTime from "../../constants/dateTime";
import * as Yup from 'yup';
import './index.scss';

export default function MakingOrder () {
  const cities = useData("cities");
  const size = useData("size");
 
  const submitFunction = values => {
    console.log(JSON.stringify(values, null, 2));
  }

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      size: size.data[0] ? size.data[0].size : "",
      city: cities.data[0] ? cities.data[0].city : "",
      date: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      date: Yup.string()
        .required("Date is required")
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true,
  });

  const formSubmit = () => {
    formik.handleSubmit();
    history.push(routes.chooseMaster);
  };
  return (
    <div className="order_wrapper">
      <h1>To make an order, fill the form:</h1>
      <form className="orderForm">
        <label htmlFor="name">Name</label>
        <input
          className="field"
          required
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="error">{formik.errors.name}</div>
        ) : null}
        <label htmlFor="email">Email Address</label>
        <input
          required
          className="field"
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error">{formik.errors.email}</div>
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
        <label htmlFor="size">Size</label>
        <select
          required
          className="field"
          id="size"
          name="size"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.size}
        >
          {size.data.map(el => <option key={el.size}>{el.size}</option>)}
        </select>
        <label htmlFor="date">Date</label>
        <input
          required
          className="field"
          id="date"
          name="date"
          type="datetime-local"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          min={dateTime}
          value={formik.values.date}
          step="3600"
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="error">{formik.errors.date}</div>
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
