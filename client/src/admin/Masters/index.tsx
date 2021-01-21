import React, { useState, useEffect, FunctionComponent} from 'react';
import {postElement} from "../../api/postElement";
import {updateElement} from '../../api/updateElement';
import {Loader} from "../../components/Loader";
import {RatingStars} from "../../components/Rating";
import { ToastContainer, toast } from 'react-toastify';
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
import { useTranslation } from 'react-i18next';

interface Master {
  id?: number,
  master_name?: string,
  city?: string,
  email?: string,
  rating?: number,
}

interface City {
  id: number,
  city: string
}

interface UserPassword {
  username: string,
  password: string
}

export const Masters: FunctionComponent = () => {

  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, openModal] = useState<boolean>(false);
  const [openedModalPass, setModalPass] = useState<boolean>(false);
  const [editableItem, setItem] = useState<Master>({} as Master);
  const masters: Array<Master> = useSelector(mastersList);
  const mastersIsLoading = useSelector<boolean>(mastersLoading);
  const cities: Array<City> = useSelector(citiesList);
  const citiesIsLoading = useSelector<boolean>(citiesLoading);
  const dispatch: Function = useDispatch();

  useEffect((): void => {
    dispatch(getMasters())
    dispatch(getCities())
  }, [])

  const deleteElement = (el: Master): Promise<void> => {
    setIsLoading(true);
    return updateElement(el, 'DELETE', "masters", el.id)
      .then(() => dispatch(deleteMaster(el.id)))
      .then(() => setIsLoading(false))
  }

  const editElement = (values: Master): Promise<void> => {
    setIsLoading(true);
    return updateElement(values, 'PUT', "masters", editableItem.id)
      .then(res => {
        if (res. msg) {
          setIsLoading(false)
          toast.error(res.msg)
        } else {
          dispatch(updateMasters(editableItem.id, values))
          handleCancel()
          setIsLoading(false)
        }
      })
  }

  const addElement = (values: Master): Promise<void> => {
    setIsLoading(true);
    return postElement(values, "masters")
      .then(res => {
        if (res. msg) {
          setIsLoading(false)
          toast.error(res.msg)
        } else {
          dispatch(addMaster(res))
          handleCancel()
          setIsLoading(false)
        }
      })
  }

  const setPass = (values: UserPassword): Promise<void> => {
    setIsLoading(true);
    return updateElement(values, 'PUT', "masterPass", editableItem.id)
      .then(() => handleCancel())
      .then(() => setIsLoading(false))
  }

  const handleOpen = (el: Master): void => {
    setItem(el);
    openModal(true);
  }

  const handleOpenModalPass = (el: Master): void => {
    setItem(el);
    setModalPass(true);
  }

  const submitMasterFunction = (values: Master): Promise<void> => {
    return Object.keys(editableItem).length ? editElement(values) : addElement(values);
  }

  const submitPassFunction = (values: UserPassword): Promise<void> => {
    return setPass(values)
  }

  const formikMaster = useFormik<Master>({
    initialValues: {
      master_name: editableItem ? editableItem.master_name : '',
      city: editableItem ? editableItem.city : (cities[0] ? cities[0].city : ""),
      email: editableItem ? editableItem.email : ''
     },
    validationSchema: Yup.object({
      master_name: Yup.string()
        .min(2, t('Masters.errors.2 symbols min'))
        .max(20, t('Masters.errors.20 symbols max'))
        .required(t('Masters.errors.Name is required')),
      email: Yup.string()
        .max(35, t("Masters.errors.35 symbols max"))
        .email(t("Masters.errors.Invalid email address"))
        .required(t("Masters.errors.Email is required")),
      city: Yup.string()
        .required(t("Masters.errors.City is required")),
    }),
    onSubmit: values => submitMasterFunction(values),
    enableReinitialize: true
  });

  const formikPass = useFormik<UserPassword>({
    initialValues: {
      username: '',
      password: "",
     },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(3, t('Masters.errors.3 symbols min'))
        .max(30, t('Masters.errors.30 symbols max'))
        .required(t('Masters.errors.Password is required')),
      
    }),
    onSubmit: values => submitPassFunction(values),
    enableReinitialize: true
  });

  const formMasterSubmit = (): void => {
    formikMaster.handleSubmit();
  };

  const formPassSubmit = (): void => {
    formikPass.handleSubmit();
  };

  const handleCancel = (): void => {
    openModal(false);
    setModalPass(false);
    setItem({});
    formikMaster.resetForm();
    formikPass.resetForm()
  };

  if (isLoading || citiesIsLoading || mastersIsLoading) return <Loader />

  return (
      <div>
        <Button className="add_master" type="primary" onClick={() => openModal(true)}>{t("Masters.buttons.Add master")}</Button>
        <div className="wrapper_masters">
          {
            masters.map((el: Master) =>
              <div className="card_master" key={el.id}>
                <div>ID: {el.id}</div>
                <div className="master_name">{`${el.master_name} (${el.city})`}</div>
                <RatingStars 
                  value={el.rating}
                  readOnly={true}
                  precision={0.25}
                />
                <Space size="middle" className="wrapper_buttons">
                  <Button type="dashed" onClick={() => handleOpen(el)}>{t("Masters.buttons.Edit")}</Button>
                  <Popconfirm
                    title={t("Masters.buttons.Are you sure?")}
                    onConfirm={() => deleteElement(el)}
                    okText={t("Masters.buttons.Yes")}
                    cancelText={t("Masters.buttons.No")}
                  >
                    <Button danger>{t("Masters.buttons.Delete")}</Button>
                  </Popconfirm>
                </Space>
                <div className="password" onClick={() => handleOpenModalPass(el)}>{t("Masters.buttons.Set password")}</div>
              </div>
            )
          }
        </div>
        <Modal
          title={t("Masters.Master")}
          closable={true}
          onCancel={handleCancel}
          visible={opened}
          footer={false}
          maskClosable={false}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label={t("Masters.Name")}>
              <Input 
                name="master_name" 
                placeholder={t("Masters.placeholders.Enter name")}
                onChange={formikMaster.handleChange}
                onBlur={formikMaster.handleBlur}
                value={formikMaster.values.master_name}/>
              {formikMaster.touched.master_name && formikMaster.errors.master_name ? (
                <div className="error">{formikMaster.errors.master_name}</div>
              ) : null}
            </Form.Item>
            <Form.Item label={t("Masters.Email")}>
              <Input 
                name="email" 
                placeholder={t("Masters.placeholders.Enter email")}
                onChange={formikMaster.handleChange}
                onBlur={formikMaster.handleBlur}
                value={formikMaster.values.email}/>
              {formikMaster.touched.email && formikMaster.errors.email ? (
                <div className="error">{formikMaster.errors.email}</div>
              ) : null}
            </Form.Item>
            <Form.Item label={t("Masters.City")}>
              <Select 
                placeholder={t("Masters.placeholders.Select city")}
                onChange={value => formikMaster.setFieldValue('city', value)}
                value={formikMaster.values.city}
              >
                {cities.map(el => <Select.Option key={el.id} value={el.city}>{el.city}</Select.Option>)}
              </Select>
              {formikMaster.touched.city && formikMaster.errors.city ? (
                <div className="error">{formikMaster.errors.city}</div>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={formMasterSubmit}>{t("Masters.buttons.Save")}</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={t("Masters.Set password")}
          closable={true}
          onCancel={handleCancel}
          visible={openedModalPass}
          footer={false}
          maskClosable={false}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label={t("Masters.Password")}>
              <Input 
                name="password" 
                placeholder={t("Masters.placeholders.Enter password")}
                onChange={formikPass.handleChange}
                onBlur={formikPass.handleBlur}
                value={formikPass.values.password}/>
              {formikPass.touched.password && formikPass.errors.password ? (
                <div className="error">{formikPass.errors.password}</div>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={formPassSubmit}>{t("Masters.buttons.Save")}</Button>
            </Form.Item>
          </Form>
        </Modal>
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
  );
}

