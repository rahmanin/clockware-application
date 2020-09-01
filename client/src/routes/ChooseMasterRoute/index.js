import React, { useContext, useState, useEffect } from "react";
import { headers } from "../../api/headers";
import { useFormik } from 'formik';
import Button from "../../components/Button";
import Loader from "../../components/Loader"
import { useData } from "../../hooks/useData";
import {OrderContext} from "../../providers/OrderProvider";
import postData from "../../api/postData";
import { ToastContainer, toast } from 'react-toastify';
import RadioCard from "../../components/RadioCard";
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import './index.scss';


export default function ChooseMaster () {
  const { order } = useContext(OrderContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [finished, setFinished] = useState(false);
  const [ordersByCityByDate, setOrdersByCityByDate] = useState([])
  const masters = useData("masters");

  useEffect(() => {
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify(order[0])
      };
      fetch(
        `/api/orders_by_city`, options
      )
        .then(res => res.json())
        .then(json => {
          setOrdersByCityByDate(json);
        });
  }, []);

  const set = new Set(
    ordersByCityByDate.filter(el => {
      return !(
        Number(el.order_time_start.split(":")[0]) > Number(order[0].order_time_end.split(":")[0])
        ||
        Number(el.order_time_end.split(":")[0]) < Number(order[0].order_time_start.split(":")[0])
      )
    }).map(el => el.order_master)
  );
  
  const busyMasters = Array.from(set);

  const mastersByCity = masters.data.filter(el => el.city === order[0].city)

  const freeMasters = mastersByCity.filter(el => !busyMasters.includes(el.master_name))

  const freeTimePoint = []

  const aa = mastersByCity.map(el => freeTimePoint.push(el.master_name))


  // console.log("freeTimePoint",freeTimePoint)
  // console.log("freeMasters", freeMasters)
  // console.log("mastersByCity", mastersByCity)
  // console.log("busyMasters", busyMasters)






  const history = useHistory();
  if (!order.length) history.push(routes.order);

  const submitFunction = values => {
    const masterForm = values;
    const master_id = freeMasters.find(el => el.master_name === masterForm.order_master).id
    const orderComplete = {...order[0], ...masterForm, master_id};
    setFinished(true);
    setIsDisabled(true);
    return postData(orderComplete, "orders")
      .then(res => toast.success(res.msg + ' Click here to return to orders page'));
  }

  if (!order.length) history.push(routes.order);

  let master = masters.data[0] ? freeMasters[0] : null

  const formik = useFormik({
    initialValues: {
      order_master: master ? master.master_name : "",
    },
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });
  
  if (masters.isLoading) return <Loader />

  if (!freeMasters.length) return (
    <div className="chooseMaster_wrapper">
      <h2 className="err_message">There are no free masters by your request...</h2>
      <Loader />
    </div>
  )

  return (
    <div className="chooseMaster_wrapper">
      <h1>Choose any free master:</h1>
      <form className="chooseMasterForm" onSubmit={formik.handleSubmit}>
        <div className="radio_wrapper">
          {
            freeMasters.map(el => {
              return <RadioCard 
                onClick={() => setIsDisabled(false)}
                key={el.id} 
                name="order_master"
                master_name={el.master_name} 
                rating={el.rating}
                onChange={formik.handleChange}
                value={el.master_name}
                disabled={finished}
                precision={0.25}
              />
            })
          }
        </div>  
        <Button 
          id="button_master_submit"
          type="submit"
          color="black"
          title="Make an order"
          disabled={isDisabled}
        />      
      </form>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        onClick={()=>history.push(routes.order)}
      />
    </div>  
  );
};
