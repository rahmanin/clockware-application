import React from 'react';
import './index.scss';
import RatingStars from "../Rating";
import { Popover, Button } from 'antd';


export default function RadioCard({
  master_name,
  rating, 
  onChange, 
  onClick, 
  value, 
  checked, 
  disabled, 
  name, 
  precision, 
  feedbacks,
  onClickFeedbacks,
  hideFeedbacks,
  onClickShowAll,
  hideShowAllButton,
  onVisibleChange }) {

  const content = (
    <>
      {feedbacks && feedbacks.length ? feedbacks.map(el => {
        return <div className="feedbacks">
          <RatingStars 
            value={el.evaluation}
            readOnly={true}
            precision={0.25}
          />
          <p><span className="feedback_date">{el.createdAt.split("T")[0]}</span>{el.feedback}</p>
          <hr></hr>
        </div>
      }) : (feedbacks === null && "...loading") || "No feedbacks"}
      <div onClick={onClickShowAll} className="show_all_button" hidden={hideShowAllButton}>Show all</div>
    </>
  )

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
              precision={precision}
            />
          </div>
          <Popover 
            placement="bottom" 
            content={content} 
            title="Feedbacks" 
            trigger="click" 
            onClick={onClickFeedbacks}
            onVisibleChange={onVisibleChange}
            hidden={hideFeedbacks}
          >
            <Button className="feedback_button">Show feedbacks</Button>
          </Popover>
        </div>
    </label>
  );
}