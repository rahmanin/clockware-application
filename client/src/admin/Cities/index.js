import React, { useState, useContext } from 'react';
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
import {CitiesContext} from '../../providers/CitiesProvider';
import Loader from "../../components/Loader";
import {
  Form,
  Input,
  Table,
  Space,
  Modal,
  Button
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Cities() {

  const { isLoading, cities, addToContext, updateToContext, deleteFromContext } = useContext(CitiesContext);
  const [opened, openModal] = useState(false);
  const [editableItem, setItem] = useState(null);
  const dataSource = cities;

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const deleteElement = el => {
    updateElement(el, 'DELETE', "cities", el.id)
      .then(() => deleteFromContext(el.id))
  }

  const editElement = values => {
    updateElement(values, 'PUT', "cities", editableItem.id)
      .then(() => updateToContext(editableItem.id, values.city))
  }

  const addElement = values => {
    postElement(values, "cities")
      .then(() => addToContext(JSON.parse(localStorage.lastAdded)))
  }

  const columns = [
    {
      title: 'Cities',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => handleOpen(record)}>Edit</Button>
          <Button type="danger" onClick={() => deleteElement(record)}>Delete</Button>
        </Space>
      ),
    }
  ];

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
        <Button type="primary" onClick={() => openModal(true)}>Add city</Button>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
        <Modal
            title={editableItem ? "Edit city" : "Add city"}
            closable={false}
            visible={opened}
            footer={[
              <Button type="primary" onClick={handleCancel}>
                Ok
              </Button>,]}
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

