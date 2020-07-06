import React, { useState } from 'react';
import {useData} from "../../hooks/useData";
import postData from "../../api/postData";
import updateElement from '../../api/updateElement';
import {
  Form,
  Input,
  Table,
  Space,
  Modal,
  Button,
  Select,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Masters() {
  const [opened, openModal] = useState(false);
  const masters = useData('masters');
  const cities = useData("cities");
  const [editableItem, setItem] = useState(null);

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
  }

  const dataSource = masters.data;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'master_name',
      key: 'master_name',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => handleOpen(record)}>Edit</Button>
          <Button type="danger" onClick={() => updateElement(record, 'DELETE', "masters", record.id)}>Delete</Button>
        </Space>
      ),
    }
  ];
  
  const submitFunction = values => {
    editableItem ? updateElement(values, 'PUT', "masters", editableItem.id) : postData(values, "masters");
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

  return (
      <div>
        <Button type="primary" onClick={() => openModal(true)}>Add Master</Button>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
        <Modal
            title={editableItem ? "Edit master" : "Add master"}
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
              <Button type="primary" onClick={formSubmit}>{editableItem ? "Edit" : "Add"}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

