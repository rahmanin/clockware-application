import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { routes } from "../../constants/routes";
import Button from "../../components/Button";
import dateTimeCurrent from "../../constants/dateTime";
import timeArray from "../../constants/timeArray";
import Loader from "../../components/Loader";
import * as Yup from "yup";
import { Upload, Button as Btn } from 'antd';
import "./index.scss";
import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {addToOrderForm} from "../../store/ordersClient/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities} from "../../store/cities/actions";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import {getPrices} from "../../store/prices/actions";
import {userParams} from "../../store/users/selectors";

export default function MakingOrder() {
  const dispatch = useDispatch();
  const cities = useSelector(citiesList);
  const size = useSelector(pricesList);
  const userData = useSelector(userParams);
  const citiesIsLoading = useSelector(citiesLoading);
  const sizesIsLoading = useSelector(pricesLoading);
  const [openFileDialog, setOpenFileDialog] = useState(true);
  const isClient = userData && userData.role === "client"

  useEffect(() => {
    dispatch(getCities())
    dispatch(getPrices())
    dispatch(addToOrderForm({}));
  }, [])

  const submitFunction = (values) => {
    const splitSizePrice = values.sizePrice.split(", ");
    values.size = splitSizePrice[0];
    values.order_price = splitSizePrice[1];

    if (values.size === "Small") {
      values.order_time_end =
        Number(values.order_time_start.split(":")[0]) + 1 + ":00";
    } else if (values.size === "Medium") {
      values.order_time_end =
        Number(values.order_time_start.split(":")[0]) + 2 + ":00";
    } else if (values.size === "Large") {
      values.order_time_end =
        Number(values.order_time_start.split(":")[0]) + 3 + ":00";
    }

    const orderForm = values;
    dispatch(addToOrderForm(orderForm));
    return history.push(routes.chooseMaster);
  };

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: isClient ? userData.username : "",
      email: isClient ? userData.email : "",
      sizePrice: size.length
        ? size[0].size + ", " + size[0].price
        : "",
      city: cities.length ? cities[0].city : "",
      order_date:
        dateTimeCurrent.cTime > 17
          ? dateTimeCurrent.tomorrowDate
          : dateTimeCurrent.cDate,
      order_time_start:
        dateTimeCurrent.cTime > 17 || dateTimeCurrent.cTime < 8
          ? "8:00"
          : `${dateTimeCurrent.cTime}:00`,
      image: null
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Too Short!")
        .max(15, "Too Long!")
        .required("Name is required"),
      email: Yup.string()
        .max(35, "Too Long!")
        .email("Invalid email address")
        .required("Email is required"),
      order_date: Yup.string().required("Date is required"),
      order_time_start: Yup.string()
        .test("test-name", "Set the right time, please", function (value) {
          return !(
            value.split(":")[0] < dateTimeCurrent.cTime &&
            formik.values.order_date === dateTimeCurrent.cDate
          );
        })
        .required("Time is required"),
      image: Yup.mixed()
        .test("file-size", "File is too large", value => {
          return value ? value.size <= 1048576 : true
        })
    }),
    onSubmit: (values) => submitFunction(values),
    enableReinitialize: true,
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleChooseImage = img => {
    setOpenFileDialog(!openFileDialog);
    img.fileList.length ? formik.setFieldValue('image', img.file) : formik.setFieldValue('image', null)
  }

  if (citiesIsLoading || sizesIsLoading) return <Loader />;

  return (
    <div className="order_wrapper">
      <h1>To make an order, fill the form:</h1>
      <form className="orderForm">
        <label htmlFor="username">Name</label>
        <input
          className="field"
          required
          id="username"
          name="username"
          type="text"
          disabled={isClient}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className="error">{formik.errors.username}</div>
        ) : null}
        <label htmlFor="email">Email Address</label>
        <input
          required
          className="field"
          id="email"
          disabled={isClient}
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
          {cities.map((el) => (
            <option key={el.city}>{el.city}</option>
          ))}
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
          {size.map((el) => (
            <option key={el.size}>{el.size + ", " + el.price}</option>
          ))}
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
          min={
            dateTimeCurrent.cTime > 17
              ? dateTimeCurrent.tomorrowDate
              : dateTimeCurrent.cDate
          }
          value={formik.values.order_date}
        />
        {formik.touched.order_date && formik.errors.order_date ? (
          <div className="error">{formik.errors.order_date}</div>
        ) : null}
        <label htmlFor="order_time_start">Time</label>
        <select
          required
          className="field"
          id="order_time_start"
          name="order_time_start"
          type="time"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.order_time_start}
        >
          {timeArray.map((el) => (
            <option
              key={el}
              hidden={
                el < dateTimeCurrent.cTime &&
                formik.values.order_date === dateTimeCurrent.cDate
              }
              disabled={
                el < dateTimeCurrent.cTime &&
                formik.values.order_date === dateTimeCurrent.cDate
              }
            >
              {el}:00
            </option>
          ))}
        </select>
        {formik.touched.order_time_start && formik.errors.order_time_start ? (
          <div className="error">{formik.errors.order_time_start}</div>
        ) : null}
        <label>Add image (1mb, jpg or png)</label>
        <Upload
          className="choose_img_btn"
          beforeUpload={() => false}
          accept=".jpg, .png"
          onChange={img => handleChooseImage(img)}
          openFileDialogOnClick={openFileDialog}
        >
          <Btn>{"Choose image"}</Btn>
        </Upload>
        {formik.errors.image ? (
          <div className="error">{formik.errors.image}</div>
        ) : null}
        <Button
          type="button"
          color="black"
          title="Find your master"
          onClick={formSubmit}
          disabled={!isClient && !(formik.isValid && formik.dirty)}
        />
      </form>
    </div>
  );
}
