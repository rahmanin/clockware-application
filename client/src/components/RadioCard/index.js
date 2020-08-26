import React from 'react';
import './index.scss';
import RatingStars from "../Rating";


export default function RadioCard({master_name, rating, onChange, onClick, value, checked, disabled, name}) {

  return (
    <label className="radio_label">
      <input 
        type="radio" 
        name={name} 
        class="card-input-element"
        onChange={onChange}
        onClick={onClick}
        value={value}
        disabled={disabled}
        checked={checked}
      />
        <div class="panel panel-default card-input">
          <div class="panel-heading">{master_name}</div>
          <div class="panel-body">
            <RatingStars 
              value={rating}
              readOnly={true}
              precision={0.5}
            />
          </div>
        </div>
    </label>
  );
}