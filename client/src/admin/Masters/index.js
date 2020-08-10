import React, { useState, useContext} from 'react';
import {useData} from "../../hooks/useData";
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
import {MastersContext} from '../../providers/MastersProvider';
import Loader from "../../components/Loader";
import RatingStars from "../../components/Rating";
import {
  Form,
  Input,
  Space,
  Modal,
  Button,
  Select,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Masters() {

  const { setIsLoading, isLoading, masters, addToContext, updateToContext, deleteFromContext } = useContext(MastersContext);
  const [opened, openModal] = useState(false);
  const cities = useData("cities");
  const [editableItem, setItem] = useState(null);

  const deleteElement = el => {
    setIsLoading(true);
    updateElement(el, 'DELETE', "masters", el.id)
      .then(() => deleteFromContext(el.id))
  }

  const editElement = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "masters", editableItem.id)
      .then(() => updateToContext(editableItem.id, values.master_name, values.city, values.rating))
      .then(handleCancel())
  }

  const addElement = values => {
    setIsLoading(true);
    postElement(values, "masters")
      .then(res => addToContext(res))
      .then(handleCancel())
  }

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const submitFunction = values => {
    editableItem ? editElement(values) : addElement(values);
  }

  const formik = useFormik({
    initialValues: {
      master_name: editableItem ? editableItem.master_name : '',
      city: editableItem ? editableItem.city : (cities.data[0] ? cities.data[0].city : ""),
      rating: editableItem ? editableItem.rating : '5',
     },
    validationSchema: Yup.object({
      master_name: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Name is required'),
      
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
        <Button className="add_master" type="primary" onClick={() => openModal(true)}>Add Master</Button>
        <div className="wrapper_masters">
          {
            masters.map(el =>
              <div className="card_master" key={el.id}>
                <div className="master_name">{`${el.master_name} (${el.city})`}</div>
                <RatingStars 
                  value={el.rating}
                  readOnly={true}
                />
                <Space size="middle" className="wrapper_buttons">
                  <Button type="dashed" onClick={() => handleOpen(el)}>Edit</Button>
                  <Button type="danger" onClick={() => deleteElement(el)}>Delete</Button>
                </Space>
              </div>
              )
          }
        </div>
        <Modal
            title={editableItem ? "Edit master" : "Add master"}
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
            <Form.Item label="Name">
              <Input 
                name="master_name" 
                placeholder="Enter name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.master_name}/>
              {formik.touched.master_name && formik.errors.master_name ? (
                <div className="error">{formik.errors.master_name}</div>
              ) : null}
            </Form.Item>
            <Form.Item label="City">
              <Select 
                name="City"
                onChange={value => formik.setFieldValue('city', value)}
                value={formik.values.city}
                >
                {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Rating">
              <Select
                name="Rating"
                onChange={value => formik.setFieldValue('rating', value)}
                value={formik.values.rating}>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3</Select.Option>
                <Select.Option value="4">4</Select.Option>
                <Select.Option value="5">5</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Button">
              <Button type="primary" onClick={formSubmit}>{editableItem ? "Save" : "Add"}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

