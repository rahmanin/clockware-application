import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card} from 'antd';
import { useLocation } from 'react-router';
import { headers } from "../../api/headers";
import {postData} from "../../api/postData";
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import {RatingStars} from "../../components/Rating";
import { useFormik } from 'formik';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

interface ClientFeedback {
  evaluation: number,
  feedback_client: string,
  votes?: number,
  rating?: number
}

interface RatingInfo {
  votes: number,
  rating: number
}

export default function Feedback() {

  const { t } = useTranslation('common')
  const [disabled, setDisabled] = useState<boolean>(false)
  const [ratingInfo, setRatingInfo] = useState<RatingInfo>({} as RatingInfo)
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  const order_params = JSON.parse(`${paramsURL.order}`);
  if (paramsURL.token) localStorage.setItem("token", `${paramsURL.token}`);
  
  useEffect(() => {
    if (localStorage.token) headers.authorization = localStorage.token;

    const options: {method: string, headers: {}} = {
      method: "GET",
      headers
    };
    fetch(
      `/api/select_master_votes`, options
    )
      .then(res => res.json())
      .then(json => {
        setRatingInfo(json);
      });
  }, []);

  const submitFunction = (values: ClientFeedback) => {
    values.votes = ratingInfo.votes + 1;
    const ifFirstTimeVote = values.evaluation;
    const newRating = (ratingInfo.votes*ratingInfo.rating + Number(values.evaluation))/values.votes;
    values.rating = !ratingInfo.votes ? ifFirstTimeVote : Number(newRating.toFixed(1));
    setDisabled(true)
    postData(values, 'feedback')
      .then(res => !res.msg ? toast.error(res.err_msg) : toast.info(res.msg))
  }

  const formik = useFormik<ClientFeedback>({
    initialValues: {
      feedback_client: '',
      evaluation: 1
    },
    validationSchema: Yup.object({
      feedback_client: Yup.string()
        .max(100, t('Feedback.errors.100 symbols max')),
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  if (!paramsURL.token || !paramsURL.order) return <h1>404 PAGE NOT FOUND</h1>

  return (
    <div className="wrapper_feedback">
      <Card 
        className="order"
        title={`Order`} 
        style={{ width: 300 }}
      >
        <p className="order_content"><span className="order_header">{t("Feedback.city")}</span>{order_params.city}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.size")}</span>{order_params.size}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.date")}</span>{order_params.order_date}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.time")}</span>{order_params.order_time_start}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.master")}</span>{order_params.order_master}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.master's feedback")}</span>{order_params.feedback_master ? order_params.feedback_master : "No feedback"}</p>
        <p className="order_content"><span className="order_header">{t("Feedback.additional price")}</span>{order_params.additional_price} hrn</p>
        <p className="order_content"><span className="order_header">{t("Feedback.total price")}</span>{Number(order_params.order_price) + Number(order_params.additional_price)} hrn</p>
      </Card>
      <Form
        className="feedback_form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Input.TextArea
          className="form_item"
          name="feedback_client" 
          placeholder={t("Feedback.placeholders.100 symbols max")}
          disabled={disabled}
          rows={4}
          onChange={formik.handleChange}
          value={formik.values.feedback_client}
        />
        {formik.errors.feedback_client ? (
            <div className="error">{formik.errors.feedback_client}</div>
          ) : null}
        <RatingStars 
          defaultValue={1}
          className="rating_stars"
          value={formik.values.evaluation}
          readOnly={disabled}
          precision={1}
          onChange={formik.handleChange}
        />
          <Button 
            type="primary" 
            onClick={formSubmit}
            disabled={disabled || !formik.isValid}
          >
            {"Ok"}
          </Button>
      </Form>
      <ToastContainer
        className="toast"
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
};
