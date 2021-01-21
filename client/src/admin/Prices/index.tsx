import React, { useState, useEffect, FunctionComponent} from 'react';
import {updateElement} from '../../api/updateElement';
import {Loader} from "../../components/Loader";
import {
  Form,
  Input,
  Modal,
  Button,
} from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import './index.scss';
import {getPrices, updatePrices} from "../../store/prices/actions";
import {PriceAndSize} from "../../store/prices/actions"
import { useTranslation } from 'react-i18next';

interface EditableItem {
  id?: number,
  price?: number,
  size?: string
}

export const Prices: FunctionComponent = () => {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, openModal] = useState<boolean>(false);
  const [editableItem, setItem] = useState<EditableItem>({} as EditableItem);
  const dispatch = useDispatch();
  const prices: Array<PriceAndSize> = useSelector(pricesList);
  const pricesIsLoading: boolean = useSelector(pricesLoading);

  useEffect(() => {
    dispatch(getPrices())
  }, [])

  const handleCancel = (): void => {
    openModal(false);
    setItem({} as EditableItem);
  };

  const editElement = (values: EditableItem): Promise<any> => {
    setIsLoading(true);
    return updateElement(values, 'PUT', "prices", editableItem.id)
      .then(() => dispatch(updatePrices(editableItem.id, values.price)))
      .then(handleCancel)
      .then(() => setIsLoading(false))
      .catch(() => console.log("err"))
  }

  const handleOpen = (el: EditableItem): void => {
    setItem(el);
    openModal(true);
  }

  const submitFunction = (values: EditableItem): Promise<any> => {
    return editElement(values);
  }

  const formik = useFormik<EditableItem>({
    initialValues: {
      price: editableItem ? editableItem.price : undefined
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .typeError(t("Edit.errors.Price is incorrect"))
        .positive()
        .integer(t("Edit.errors.Must be integer"))
        .min(1, t("Edit.errors.Not enough"))
        .required(t("Edit.errors.Price is required")),
      
    }),
    onSubmit: (values: EditableItem) => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  if (isLoading || pricesIsLoading) return <Loader />

  return (
      <div>
        <div className="wrapper_prices">
          {
            prices.map((el: PriceAndSize) =>
              <div className="card_price" key={el.id}>
                <div className="size">{el.size}</div>
                <div className="price_currency">
                  <div className="price">{el.price}</div>
                  <p className="currency">{t("Prices.Currency")}</p>
                </div>
                <Button type="primary" onClick={() => handleOpen(el)}>{t("Prices.buttons.Edit")}</Button>
              </div>
            )
          }
        </div>
        <Modal
          title={t("Prices.Edit price")}
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
            <Form.Item label="Price">
              <Input 
                name="price" 
                placeholder={t("Prices.Enter price")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}/>
              {formik.touched.price && formik.errors.price ? (
                <div className="error">{formik.errors.price}</div>
              ) : null}
            </Form.Item>
            <Form.Item >
              <Button type="primary" onClick={formSubmit}>{t("Prices.buttons.Save")}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}

