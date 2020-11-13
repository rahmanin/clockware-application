import React, { useState, useEffect} from 'react';
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
import Loader from "../../components/Loader";
import RatingStars from "../../components/Rating";
import {
  Form,
  Input,
  Space,
  Modal,
  Button,
  Select,
  Popconfirm,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {mastersList, mastersLoading} from "../../store/masters/selectors";
import {getMasters, addMaster, deleteMaster, updateMasters} from "../../store/masters/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities} from "../../store/cities/actions";

export default function Masters() {

  const [isLoading, setIsLoading] = useState(false);
  const [opened, openModal] = useState(false);
  const [openedModalPass, setModalPass] = useState(false);
  const [editableItem, setItem] = useState(null);
  const masters = useSelector(mastersList);
  const mastersIsLoading = useSelector(mastersLoading);
  const cities = useSelector(citiesList);
  const citiesIsLoading = useSelector(citiesLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMasters())
    dispatch(getCities())
  }, [])

  const deleteElement = el => {
    setIsLoading(true);
    updateElement(el, 'DELETE', "masters", el.id)
      .then(() => dispatch(deleteMaster(el.id)))
      .then(() => setIsLoading(false))
  }

  const editElement = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "masters", editableItem.id)
      .then(() => dispatch(updateMasters(editableItem.id, values)))
      .then(handleCancel())
      .then(() => setIsLoading(false))
  }

  const addElement = values => {
    setIsLoading(true);
    postElement(values, "masters")
      .then(res => dispatch(addMaster(res)))
      .then(handleCancel())
      .then(() => setIsLoading(false))
  }

  const setPass = values => {
    setIsLoading(true);
    updateElement(values, 'PUT', "masterPass", editableItem.id)
      .then(handleCancel())
      .then(() => setIsLoading(false))
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
      city: editableItem ? editableItem.city : (cities[0] ? cities[0].city : ""),
      email: editableItem ? editableItem.email : ''
     },
    validationSchema: Yup.object({
      master_name: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Name is required'),
      email: Yup.string()
        .max(35, "Too Long!")
        .email("Invalid email address")
        .required("Email is required"),
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
    formikMaster.resetForm();
    formikPass.resetForm()
  };

  if (isLoading || citiesIsLoading || mastersIsLoading) return <Loader />

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
                  precision={0.25}
                />
                <Space size="middle" className="wrapper_buttons">
                  <Button type="dashed" onClick={() => handleOpen(el)}>Edit</Button>
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => deleteElement(el)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="danger">Delete</Button>
                  </Popconfirm>
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
            <Form.Item label="Email">
              <Input 
                name="email" 
                placeholder="Enter email"
                onChange={formikMaster.handleChange}
                onBlur={formikMaster.handleBlur}
                value={formikMaster.values.email}/>
              {formikMaster.touched.email && formikMaster.errors.email ? (
                <div className="error">{formikMaster.errors.email}</div>
              ) : null}
            </Form.Item>
            <Form.Item label="City">
              <Select 
                name="City"
                onChange={value => formikMaster.setFieldValue('city', value)}
                value={formikMaster.values.city}
              >
                {cities.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
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

