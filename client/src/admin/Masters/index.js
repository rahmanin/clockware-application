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
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

export default function Masters() {

  const { setIsLoading, isLoading, masters, addToContext, updateToContext, deleteFromContext } = useContext(MastersContext);
  const [opened, openModal] = useState(false);
  const [openedModalPass, setModalPass] = useState(false);
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

  const setPass = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "masterPass", editableItem.id)
      .then(handleCancel())
      .then(setIsLoading(false))
  }

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const handleOpenModalPass = (el) => {
    setItem(el);
    setModalPass(true);
  }

  const submitMasterFunction = values => {
    editableItem ? editElement(values) : addElement(values);
  }

  const submitPassFunction = values => {
    setPass(values)
  }

  const formikMaster = useFormik({
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
    onSubmit: values => submitMasterFunction(values),
    enableReinitialize: true
  });

  const formikPass = useFormik({
    initialValues: {
      username: '',
      password: "",
     },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(3, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Password is required'),
      
    }),
    onSubmit: values => submitPassFunction(values),
    enableReinitialize: true
  });

  const formMasterSubmit = () => {
    formikMaster.handleSubmit();
  };

  const formPassSubmit = () => {
    formikPass.handleSubmit();
  };

  const handleCancel = () => {
    openModal(false);
    setModalPass(false);
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
                <div>ID: {el.id}</div>
                <div className="master_name">{`${el.master_name} (${el.city})`}</div>
                <RatingStars 
                  value={el.rating}
                  readOnly={true}
                />
                <Space size="middle" className="wrapper_buttons">
                  <Button type="dashed" onClick={() => handleOpen(el)}>Edit</Button>
                  <Button type="danger" onClick={() => deleteElement(el)}>Delete</Button>
                </Space>
                <div className="password" onClick={() => handleOpenModalPass(el)}>Set password</div>
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
                onChange={formikMaster.handleChange}
                onBlur={formikMaster.handleBlur}
                value={formikMaster.values.master_name}/>
              {formikMaster.touched.master_name && formikMaster.errors.master_name ? (
                <div className="error">{formikMaster.errors.master_name}</div>
              ) : null}
            </Form.Item>
            <Form.Item label="City">
              <Select 
                name="City"
                onChange={value => formikMaster.setFieldValue('city', value)}
                value={formikMaster.values.city}
                >
                {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Rating">
              <Select
                name="Rating"
                onChange={value => formikMaster.setFieldValue('rating', value)}
                value={formikMaster.values.rating}>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3</Select.Option>
                <Select.Option value="4">4</Select.Option>
                <Select.Option value="5">5</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={formMasterSubmit}>{editableItem ? "Save" : "Add"}</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={"Set password"}
          closable={true}
          onCancel={handleCancel}
          visible={openedModalPass}
          footer={false}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="Password">
              <Input 
                name="password" 
                placeholder="Enter password"
                onChange={formikPass.handleChange}
                onBlur={formikPass.handleBlur}
                value={formikPass.values.password}/>
              {formikPass.touched.password && formikPass.errors.password ? (
                <div className="error">{formikPass.errors.password}</div>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={formPassSubmit}>Save</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

