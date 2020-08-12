import React, { useState, useContext} from 'react';
import {useData} from "../../hooks/useData";
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
import {PricesContext} from '../../providers/PricesProvider';
import Loader from "../../components/Loader";
import {
  Form,
  Input,
  Space,
  Modal,
  Button,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Prices() {

  const { setIsLoading, isLoading, prices, updateToContext } = useContext(PricesContext);
  const [opened, openModal] = useState(false);
  const [editableItem, setItem] = useState(null);

  const editElement = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "prices", editableItem.id)
      .then(() => updateToContext(editableItem.id, values.price))
      .then(handleCancel())
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
      price: editableItem ? editableItem.price : ""
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

  
  if (isLoading) return <Loader />

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

