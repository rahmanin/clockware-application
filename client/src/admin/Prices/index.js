import React, { useState, useEffect} from 'react';
import updateElement from '../../api/updateElement';
import Loader from "../../components/Loader";
import {
  Form,
  Input,
  Modal,
  Button,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import './index.scss';
import {getPrices, updatePrices} from "../../store/prices/actions";

export default function Prices() {
  const [isLoading, setIsLoading] = useState(false);
  const [opened, openModal] = useState(false);
  const [editableItem, setItem] = useState(null);
  const dispatch = useDispatch();
  const prices = useSelector(pricesList);
  const pricesIsLoading = useSelector(pricesLoading);

  useEffect(() => {
    dispatch(getPrices())
  }, [])

  const editElement = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "prices", editableItem.id)
      .then(() => dispatch(updatePrices(editableItem.id, values.price)))
      .then(handleCancel())
      .then(() => setIsLoading(false))
  }

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const submitFunction = values => {
    editElement(values);
  }

  const formik = useFormik({
    initialValues: {
      price: editableItem ? editableItem.price : null
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .typeError("Price is incorrect")
        .positive()
        .integer("Must be integer")
        .min(1, 'Not enough')
        .required('Price is required'),
      
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleCancel = e => {
    openModal(false);
    setItem(null);
  };

  
  if (isLoading || pricesIsLoading) return <Loader />

  return (
      <div>
        <div className="wrapper_prices">
          {
            prices.map(el =>
              <div className="card_price" key={el.id}>
                <div className="size">{el.size}</div>
                <div className="price_currency">
                  <div className="price">{el.price}</div>
                  <p className="currency">hrn</p>
                </div>
                <Button type="primary" onClick={() => handleOpen(el)}>Edit</Button>
              </div>
              )
          }
        </div>
        <Modal
            title="Edit price"
            closable={true}
            onCancel={handleCancel}
            visible={opened}
            footer={false}
        >
          <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
          >
            <Form.Item label="Price">
              <Input 
                name="price" 
                placeholder="Enter name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}/>
              {formik.touched.price && formik.errors.price ? (
                <div className="error">{formik.errors.price}</div>
              ) : null}
            </Form.Item>
            <Form.Item >
              <Button type="primary" onClick={formSubmit}>{"Save"}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

