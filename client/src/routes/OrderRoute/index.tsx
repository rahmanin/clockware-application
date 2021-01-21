import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { routes } from "../../constants/routes";
import {Button} from "../../components/Button";
import dateTimeCurrent from "../../constants/dateTime";
import timeArray from "../../constants/timeArray";
import {Loader} from "../../components/Loader";
import * as Yup from "yup";
import { Upload, Button as Btn } from 'antd';
import "./index.scss";
import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {addToOrderForm, ClientOrderForm} from "../../store/ordersClient/actions";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {City, getCities} from "../../store/cities/actions";
import {pricesList, pricesLoading} from "../../store/prices/selectors";
import {getPrices, PriceAndSize} from "../../store/prices/actions";
import {userParams} from "../../store/users/selectors";
import { UserData } from "../../store/users/actions";
import { postData } from "../../api/postData";
import { orderForm } from "../../store/ordersClient/selectors";
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const GoogleMapTS = GoogleMap as any

const insidePolygon = (point: any, vs: any) => {
  var x = point[0], y = point[1];
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
};

export default function MakingOrder() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(false);
  const order: ClientOrderForm = useSelector(orderForm)
  const dispatch = useDispatch();
  const cities: City[] = useSelector(citiesList);
  const size: PriceAndSize[] = useSelector(pricesList);
  const userData: UserData = useSelector(userParams);
  const citiesIsLoading: boolean = useSelector(citiesLoading);
  const sizesIsLoading: boolean = useSelector(pricesLoading);
  const [openFileDialog, setOpenFileDialog] = useState<boolean>(true);
  const [choosenDate, setChoosenDate] = useState<string>("");
  const isClient: boolean = userData && userData.role === "client"
  const { t } = useTranslation('common')
  const mapRef: any | null = useRef(null);
  const [marker, setMarker] = useState({ lat: 48.462948, lng: 35.041853 });

  useEffect(() => {
    dispatch(getCities())
    dispatch(getPrices())
  }, [])

  const submitFunction = (values: ClientOrderForm) => {
    const splitSizePrice = values.sizePrice.split(", ");
    values.size = splitSizePrice[0];
    values.order_price = splitSizePrice[1];

    if (values.size === "Small") {
      values.order_time_end =
        Number(values.order_time_start?.split(":")[0]) + 1 + ":00";
    } else if (values.size === "Medium") {
      values.order_time_end =
        Number(values.order_time_start?.split(":")[0]) + 2 + ":00";
    } else if (values.size === "Large") {
      values.order_time_end =
        Number(values.order_time_start?.split(":")[0]) + 3 + ":00";
    }
    
    if (showMap && deliveryAvailable) {
      values.address = JSON.stringify(marker)
    }
    const orderForm = values;
    return checkUser(orderForm);
  };

  const history = useHistory();

  const formik = useFormik<ClientOrderForm>({
    initialValues: {
      username: isClient ? userData.username : "",
      email: isClient ? userData.email : "",
      sizePrice: (order.size && `${order?.size}, ${order?.order_price}`) || (size.length
        ? size[0].size + ", " + size[0].price
        : ""),
      city: order.city || (cities.length ? cities[0].city : ""),
      order_date:
        order.order_date || (dateTimeCurrent.cTime > 17
          ? dateTimeCurrent.tomorrowDate
          : dateTimeCurrent.cDate),
      order_time_start:
        order.order_time_start || ((dateTimeCurrent.cTime > 17 || dateTimeCurrent.cTime < 8)
          ? "8:00"
          : `${dateTimeCurrent.cTime}:00`),
      image: order.image || null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, t("Create order.errors.2 symbols min"))
        .max(35, t("Create order.errors.35 symbols max"))
        .required(t("Create order.errors.Name is required")),
      email: Yup.string()
        .max(35, t("Create order.errors.35 symbols max"))
        .email(t("Create order.errors.Invalid email address"))
        .required(t("Create order.errors.Email is required")),
      order_date: Yup.string().required(t("Create order.errors.Date is required")),
      order_time_start: Yup.string()
        .test("test-name", t("Create order.errors.Set the right time, please"), (value: any) => {
          return !(
            value.split(":")[0] < dateTimeCurrent.cTime &&
            choosenDate === dateTimeCurrent.cDate
          );
        })
        .required(t("Create order.errors.Time is required")),
      image: Yup.mixed()
        .test("file-size", t("Create order.errors.File is too large"), value => {
          return value ? value.size <= 1048576 : true
        })
    }),
    onSubmit: (values) => submitFunction(values),
    enableReinitialize: true,
  });

  const clientInfo: {username: string, email: string} = {
    username: formik.values.username,
    email: formik.values.email
  }

  const checkUser = (orderForm: ClientOrderForm) => {
    setIsLoading(true)
    if (!isClient) {
      postData(clientInfo, "check_user")
        .then(res => {
          if (res.id) {
            dispatch(addToOrderForm({...orderForm, id: res.id}))
            history.push(routes.chooseMaster)
          } else {
            dispatch(addToOrderForm(orderForm));
            history.push(routes.login)
          }
        })
        .catch(err => console.log("ERRRR", err))
    } else {
      dispatch(addToOrderForm(orderForm))
      history.push(routes.chooseMaster)
    }
  }

  useEffect(() => {
    setChoosenDate(formik.values.order_date)
  }, [formik.values.order_date])

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleChooseImage = (img: any)=> {
    setOpenFileDialog(!openFileDialog);
    img.fileList.length ? formik.setFieldValue('image', img.file) : formik.setFieldValue('image', null)
  }

  const handleLoadMap = (map: any) => {
    mapRef.current = map;
  }

  const checkDelivery = (address: any) => {
    setMarker(address)
    const area: any = cities.find(city => city.city === "Dnipro")?.delivery_area;
    const polygon: Array<Array<number>> = JSON.parse(area).map((point: any) => [point.lat, point.lng])
    const location: Array<number> = [address.lat, address.lng]
    setDeliveryAvailable(insidePolygon(location, polygon))
  }

  const handleOnClickMap = (e: any) => {
    const address: any = e.latLng.toJSON()
    checkDelivery(address)
  }

  const handleChangeAutocomplete = async(place: any) => {
    postData({place_id: place.value.place_id}, "get_place_by_id")
      .then(res => {
        const address: any = res.result.geometry.location
        checkDelivery(address)
      })
      .catch(err => console.log(err))
  }
  if (citiesIsLoading || sizesIsLoading || isLoading) return <Loader />;

  return (
    <div className="order_wrapper">
      <h1>{t("Create order.title")}</h1>
      <form className="orderForm">
        <label htmlFor="username">{t("Create order.name")}</label>
        <input
          className="field"
          required
          id="username"
          name="username"
          type="text"
          disabled={isClient}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className="error">{formik.errors.username}</div>
        ) : null}
        <label htmlFor="email">{t("Create order.email")}</label>
        <input
          required
          className="field"
          id="email"
          disabled={isClient}
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error">{formik.errors.email}</div>
        ) : null}
        <label htmlFor="city">{t("Create order.city")}</label>
        <select
          required
          className="field"
          id="city"
          name="city"
          onChange={(value) => {
            formik.handleChange(value)
            setShowMap(false)
          }}
          value={formik.values.city}
        >
          {cities.map((el) => (
            <option key={el.city}>{el.city}</option>
          ))}
        </select>
        <label htmlFor="sizePrice">{t("Create order.size")}</label>
        <select
          required
          className="field"
          id="sizePrice"
          name="sizePrice"
          onChange={formik.handleChange}
          value={formik.values.sizePrice}
        >
          {size.map((el) => (
            <option key={el.size}>{el.size + ", " + el.price}</option>
          ))}
        </select>
        <label htmlFor="order_date">{t("Create order.date")}</label>
        <input
          required
          className="field"
          id="order_date"
          name="order_date"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          min={
            dateTimeCurrent.cTime > 17
              ? dateTimeCurrent.tomorrowDate
              : dateTimeCurrent.cDate
          }
          value={formik.values.order_date}
        />
        {formik.touched.order_date && formik.errors.order_date ? (
          <div className="error">{formik.errors.order_date}</div>
        ) : null}
        <label htmlFor="order_time_start">{t("Create order.time")}</label>
        <select
          required
          className="field"
          id="order_time_start"
          name="order_time_start"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.order_time_start}
        >
          {timeArray.map((el) => (
            <option
              key={el}
              hidden={
                el < dateTimeCurrent.cTime &&
                formik.values.order_date === dateTimeCurrent.cDate
              }
              disabled={
                el < dateTimeCurrent.cTime &&
                formik.values.order_date === dateTimeCurrent.cDate
              }
            >
              {el}:00
            </option>
          ))}
        </select>
        {formik.touched.order_time_start && formik.errors.order_time_start ? (
          <div className="error">{formik.errors.order_time_start}</div>
        ) : null}
        <label>{t("Create order.image title")}</label>
        <Upload
          className="choose_img_btn"
          beforeUpload={() => false}
          accept=".jpg, .png"
          onChange={img => handleChooseImage(img)}
          openFileDialogOnClick={openFileDialog}
        >
          <Btn>{t("Create order.image button")}</Btn>
        </Upload>
        {formik.errors.image ? (
          <div className="error">{formik.errors.image}</div>
        ) : null}
        <div className="delivery_header">
          <input 
            disabled={formik.values.city != "Dnipro"}
            className="show_map"
            id="map"
            name="map"
            type="checkbox"
            checked={showMap}
            onChange={() => setShowMap(!showMap)}
          />
          <label htmlFor="map">{t("Create order.Home call (Dnipro only)")}</label>
        </div>
        <span
          hidden={!showMap}
          className={deliveryAvailable ? "success" : "error"}
        >{deliveryAvailable ? t("Create order.errors.Available") : t("Create order.errors.Is not available")}</span>
        <div
          className="delivery_wrapper"
          hidden={!showMap}
        >
          { 
            isLoaded ?
              <div>
                <GooglePlacesAutocomplete
                  apiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  autocompletionRequest={{
                    componentRestrictions: {
                      country: ['ua'],
                    }
                  }}
                  selectProps={{
                    placeholder: t("Create order.Input address"),
                    onChange: (place: any) => {handleChangeAutocomplete(place)}
                  }}
                />
                <GoogleMapTS
                  mapContainerClassName="map"
                  center={marker}
                  zoom={13}
                  onLoad={handleLoadMap}
                  onClick={handleOnClickMap}
                >
                  <Marker
                    position={marker}
                  >
                  </Marker>
                </GoogleMapTS>
              </div>
            : null
          }
        </div>
        <Button
          type="button"
          color="black"
          title={t("Create order.find master")}
          onClick={formSubmit}
          disabled={!isClient && !(formik.isValid && formik.dirty)}
        />
      </form>
    </div>
  );
}
