import React, { useState } from 'react';
import {useData} from "../../hooks/useData";
import postElement from "../../api/postElement";
import updateElement from '../../api/updateElement';
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
  const [opened, openModal] = useState(false);
  const cities = useData("cities");
  const [editableItem, setItem] = useState(null);
  const dataSource = cities.data;

  const handleOpen = (el) => {
    setItem(el);
    openModal(true);
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
          <Button type="danger" onClick={() => updateElement(record, 'DELETE', "cities", record.id)}>Delete</Button>
        </Space>
      ),
    }
  ];
  
  const submitFunction = values => {
    editableItem ? updateElement(values, 'PUT', "cities", editableItem.id) : postElement(values, "cities");
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

