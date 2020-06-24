import React, { useState } from 'react';
import {useData} from "../../hooks/useData";
import {
  Form,
  Input,
  Table,
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
  ];

  // const handleSubmit = e => {
  //   console.log(e);
  // };
  const submitFunction = values => {
    console.log(values)
  }

  const formik = useFormik({
    initialValues: {
      master_name: '',
      city: '',
      rating: ''
    },
    validationSchema: Yup.object({
      master_name: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Name is required'),
      city: Yup.string()
        .required('CIty is required'),
      rating: Yup.string()
        .required('CIty is required'),
    }),
    onSubmit: values => submitFunction(values)
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleCancel = e => {
    openModal(false)
  };

  return (
      <div>
        <Button type="primary" onClick={() => openModal(true)}>Add Master</Button>
        <Table dataSource={dataSource} columns={columns} />
        <Modal
            title="Add master"
            visible={opened}
            //onOk={handleOk}
            onCancel={handleCancel}
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
            </Form.Item>
            <Form.Item label="City">
              <Select 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}>
                {cities.data.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Rating">
              <Select
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rating}>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3</Select.Option>
                <Select.Option value="4">4</Select.Option>
                <Select.Option value="5">5</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Button">
              <Button type="primary" onClick={formSubmit}>Button</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

