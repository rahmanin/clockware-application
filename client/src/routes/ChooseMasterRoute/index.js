import React, { useContext} from "react";
import { useFormik } from 'formik';
import Button from "../../components/Button";
import Loader from "../../components/Loader"
import { useData } from "../../hooks/useData";
import {OrderContext} from "../../providers/OrderProvider";
import postData from "../../api/postData";
import './index.scss';

export default function ChooseMaster () {
  const { order } = useContext(OrderContext);
  const masters = useData("masters");

  const submitFunction = values => {
    const masterForm = values;
    const orderComplete = {...order[0], ...masterForm};
    return postData(orderComplete, "orders");
  }

  const formik = useFormik({
    initialValues: {
      order_master: masters.data.length ? masters.data.find(el => el.city === order[0].city).master_name + " " + String.fromCharCode(9734).repeat(masters.data.find(el => el.city === order[0].city).rating) : "",
    },
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });
  
  if (!masters.data.length) return (
    <div className="chooseMaster_wrapper">
      <h2 className="err_message">There are no free masters by your request...</h2>
      <Loader />
    </div>
  )

  return (
    <div className="chooseMaster_wrapper">
      <h1>Choose any free master:</h1>
      <form className="chooseMasterForm" onSubmit={formik.handleSubmit}>
        <label htmlFor="order_master">Master</label>
        <select
          required
          className="field"
          id="order_master"
          name="order_master"
          type="master"
          onChange={formik.handleChange}
          value={formik.values.order_master}
        >
          {masters.data.map(el => {
            if (el.city === order[0].city)
            return <option key={el.id}>{el.master_name + ' ' + String.fromCharCode(9734).repeat(el.rating)}</option>})}
        </select>     
        <Button 
          type="submit"
          color="black"
          title="Make an order"
        />      
      </form>
    </div>  
  );
};
