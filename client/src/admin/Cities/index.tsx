import React, { useState, useEffect, FunctionComponent } from "react";
import {postElement} from "../../api/postElement";
import {updateElement} from "../../api/updateElement";
import {Loader} from "../../components/Loader";
import { 
  Form, 
  Input, 
  Space, 
  Modal, 
  Button, 
  Popconfirm 
} from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import "./index.scss";
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {getCities, updateCities, addCity, deleteCity} from "../../store/cities/actions";
import {City} from "../../store/cities/actions"

export const Cities: FunctionComponent = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, openModal] = useState<boolean>(false);
  const [editableItem, setItem] = useState<City>({} as City);
  const dispatch: Function = useDispatch();
  const cities: Array<Object> = useSelector(citiesList);
  const citiesIsLoading = useSelector<boolean>(citiesLoading);

  useEffect(() => {
    dispatch(getCities())
  }, [])

  const handleOpen = (el: City) => {
    setItem(el);
    openModal(true);
  };

  const deleteElement = (el: City): Promise<any> => {
    setIsLoading(true);
    return updateElement(el, "DELETE", "cities", el.id)
      .then(() => dispatch(deleteCity(el.id)))
      .then(() => setIsLoading(false))
  };

  const editElement = (values: City): Promise<any> => {
    setIsLoading(true);
    return updateElement(values, "PUT", "cities", editableItem.id)
      .then(() => dispatch(updateCities(editableItem.id, values.city)))
      .then(handleCancel)
      .then(() => setIsLoading(false))
  };

  const addElement = (values: City): Promise<any> => {
    setIsLoading(true);
    return postElement(values, "cities")
      .then(res => dispatch(addCity(res)))
      .then(handleCancel)
      .then(() => setIsLoading(false))
  };

  const submitFunction = (values: City): Promise<any> => {
    return editableItem ? editElement(values) : addElement(values);
  };

  const formik = useFormik<City>({
    initialValues: {
      city: editableItem ? editableItem.city : undefined,
    },
    validationSchema: Yup.object({
      city: Yup.string()
        .min(2, "Too Short!")
        .max(20, "Too Long!")
        .required("City is required"),
    }),
    onSubmit: (values: City) => submitFunction(values),
    enableReinitialize: true,
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    openModal(false);
    setItem({id: undefined, city: undefined});
    formik.resetForm()
  };

  if (isLoading || citiesIsLoading) return <Loader />;
  return (
    <div>
      <Button
        className="add_city"
        type="primary"
        onClick={() => openModal(true)}
      >
        Add city
      </Button>
      <div className="wrapper_cities">
        {cities.map((el: City) => (
          <div className="card_city" key={el.id}>
            <div className="city_name">{el.city}</div>
            <Space size="middle" className="wrapper_buttons">
              <Button type="dashed" onClick={() => handleOpen(el)}>
                Edit
              </Button>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => deleteElement(el)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </div>
        ))}
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
              value={formik.values.city}
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="error">{formik.errors.city}</div>
            ) : null}
          </Form.Item>
          <Form.Item label="Submit">
            <Button type="primary" onClick={formSubmit}>
              {editableItem ? "Save" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
