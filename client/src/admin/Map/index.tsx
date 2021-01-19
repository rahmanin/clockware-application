import React, { useState, useRef, useCallback, useEffect } from "react";
import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";
import {Loader} from "../../components/Loader";
import {
  Button,
  Space } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { updateElement } from "../../api/updateElement";
import {useDispatch, useSelector} from "react-redux";
import {citiesList, citiesLoading} from "../../store/cities/selectors";
import {City, getCities} from "../../store/cities/actions";

const GoogleMapTS = GoogleMap as any
const PolygonTS = Polygon as any

export const MapEditor = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  })
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const cities = useSelector(citiesList);
  const citiesIsLoading = useSelector(citiesLoading);
  const { t } = useTranslation('common')
  const [path, setPath] = useState<Array<Object>>([]);

  useEffect(() => {
    dispatch(getCities())
  }, [])

  useEffect(() => {
    const mainCity = cities?.find((el: City) => el.city === "Dnipro")
    mainCity && setPath(JSON.parse(mainCity.delivery_area))
  }, [cities])

  const polygonRef = useRef({} as any);
  const listenersRef = useRef<string[]>([]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: any) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  const onLoad = useCallback(
    polygon => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis: any) => lis.remove());
    polygonRef.current = null;
  }, []);

  const handleSave = () => {
    setIsLoading(true)
    updateElement({updatedArea: path}, "PUT", "delivery_area", 1)
      .then(() => setIsLoading(false))
      .catch(err => console.log(err))
  }
  
  const handleReset = () => {
    setPath([
      { lat: 48.468401, lng: 35.037788 },
      { lat: 48.464442, lng: 35.033042 },
      { lat: 48.462938, lng: 35.041843 }
    ])
  }

  if (isLoading || citiesIsLoading) return <Loader />;

  return (
    <div className="map_wrapper">
      <Space 
        size="middle"
        className="map_buttons"
      >
        <Button 
          type="primary"
          onClick={handleSave}
        >
          {t("MapEditor.Save")}
        </Button>
        <Button 
          danger
          onClick={handleReset}
        >
          {t("MapEditor.Reset")}
        </Button>
      </Space>
      {
        isLoaded ? 
          <GoogleMapTS
            mapContainerClassName="map"
            center={path[path.length - 1]}
            zoom={13}
          >
            <PolygonTS
              editable
              draggable
              path={path}
              onMouseUp={onEdit}
              onDragEnd={onEdit}
              onLoad={onLoad}
              onUnmount={onUnmount}
            />
          </GoogleMapTS>
        : null
      }
    </div>
  );
}