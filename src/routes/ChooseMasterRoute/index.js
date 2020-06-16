import React  from "react";
import { useFormik } from 'formik';
import Button from "../../components/Button";
import Loader from "../../components/Loader"
import { useData } from "../../hooks/useData";
import './index.scss';

export default function ChooseMaster () {
  const masters = useData("masters");
  
  const formik = useFormik({
    initialValues: {
      master: masters.data[0] ? masters.data[0].master_name : "",
    },
    onSubmit: values => console.log(JSON.stringify(values, null, 2)),
    enableReinitialize: true
  });

  if (masters.data.lenght === 0) return <Loader />;

  return (
    <div className="chooseMaster_wrapper">
      <h1>Choose any free master:</h1>
      <form className="chooseMasterForm" onSubmit={formik.handleSubmit}>
        <label htmlFor="master">Master</label>
        <select
          required
          className="field"
          id="master"
          name="master"
          type="master"
          onChange={formik.handleChange}
          value={formik.values.master}
        >
          {masters.data.map(el => <option key={el.id}>{el.master_name + ' ' + String.fromCharCode(9734).repeat(el.rating)}</option>)}
        </select>     
        <Button 
          type="submit"
          color="black"
          title="Make an order"
        />      
      </form>
    </div>  
  );
};
