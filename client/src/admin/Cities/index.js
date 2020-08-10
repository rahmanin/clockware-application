import React, { useState, useContext } from 'react';
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
import {CitiesContext} from '../../providers/CitiesProvider';
import Loader from "../../components/Loader";
import {
  Form,
  Input,
  Space,
  Modal,
  Button
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Cities() {

  const { setIsLoading, isLoading, cities, addToContext, updateToContext, deleteFromContext } = useContext(CitiesContext);
  const [opened, openModal] = useState(false);
  const [editableItem, setItem] = useState(null);

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const deleteElement = el => {
    setIsLoading(true)
    updateElement(el, 'DELETE', "cities", el.id)
      .then(() => deleteFromContext(el.id))
  }

  const editElement = values => {
    setIsLoading(true)
    updateElement(values, 'PUT', "cities", editableItem.id)
      .then(() => updateToContext(editableItem.id, values.city))
      .then(handleCancel())
  }

  const addElement = values => {
    setIsLoading(true)
    postElement(values, "cities")
      .then(res => addToContext(res))
      .then(handleCancel())
  }

  const submitFunction = values => {
    editableItem ?  editElement(values) : addElement(values);
  }

  const formik = useFormik({
    initialValues: {
      city: editableItem ? editableItem.city : '',
    },
    validationSchema: Yup.object({
      city: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('City is required'),
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true,
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
        <Button className="add_city" type="primary" onClick={() => openModal(true)}>Add city</Button>
        <div className="wrapper_cities">
          {
            cities.map(el =>
              <div className="card_city" key={el.id}>
                <div className="city_name">{el.city}</div>
                <Space size="middle" className="wrapper_buttons">
                  <Button type="dashed" onClick={() => handleOpen(el)}>Edit</Button>
                  <Button type="danger" onClick={() => deleteElement(el)}>Delete</Button>
                </Space>
              </div>
              )
          }
        </div>
        <Modal
            title={editableItem ? "Edit city" : "Add city"}
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
            <Form.Item label="City">
              <Input 
                name="city" 
                placeholder="Enter city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}/>
              {formik.touched.city && formik.errors.city ? (
                <div className="error">{formik.errors.city}</div>
              ) : null}
            </Form.Item>
            <Form.Item label="Submit">
              <Button type="primary" onClick={formSubmit}>{editableItem ? "Save" : "Add"}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

