import React, { useState } from 'react';
import {useData} from "../../hooks/useData";
import {
  Form,
  Input,
  Table,
  Modal,
  Button
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './index.scss';

export default function Cities() {
  const [opened, openModal] = useState(false);
  const cities = useData("cities");

  const dataSource = cities.data;

  const columns = [
    {
      title: 'Cities',
      dataIndex: 'city',
      key: 'city',
    }
  ];

  // const handleSubmit = e => {
  //   console.log(e);
  // };
  const submitFunction = values => {
    console.log(values)
  }

  const formik = useFormik({
    initialValues: {
      city: ''
    },
    validationSchema: Yup.object({
      city: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('City is required'),
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
        <Button type="primary" onClick={() => openModal(true)}>Add city</Button>
        <Table dataSource={dataSource} columns={columns} />
        <Modal
            title="Add city"
            visible={opened}
            //onOk={handleOk}
            onCancel={handleCancel}
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
            </Form.Item>
            <Form.Item label="Submit">
              <Button type="primary" onClick={formSubmit}>Add</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

