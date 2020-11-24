import React, { FunctionComponent } from 'react';
import './index.scss';
import {RatingStars} from "../Rating";
import { Popover, Button } from 'antd';

interface Feedback {
  evaluation: number,
  createdAt: string,
  feedback?: string
}

interface Props {
  master_name?: string,
  rating?: number,
  onChange: any,
  onClick?: () => void, 
  value?: string,
  checked?: boolean,
  disabled?: boolean,
  name: string,
  precision: number,
  feedbacks?: Array<Feedback>,
  onClickFeedbacks: () => void,
  hideFeedbacks?: boolean,
  onClickShowAll: () => void,
  hideShowAllButton?: boolean,
  onVisibleChange: () => void,
}

export const RadioCard: FunctionComponent<Props> = ({
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
  onVisibleChange }) => {

  const content: JSX.Element = (
    <>
      {feedbacks && feedbacks.length ? feedbacks.map((el: Feedback) => {
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
        className="card-input-element"
        onChange={onChange}
        onClick={onClick}
        value={value}
        disabled={disabled}
        checked={checked}
      />
        <div className="panel panel-default card-input">
          <div className="panel-heading">{master_name}</div>
          <div className="panel-body">
            <RatingStars 
              value={rating}
              readOnly={true}
              precision={precision}
            />
          </div>
          <div
            onClick={onClickFeedbacks}
            hidden={hideFeedbacks}
          >
            <Popover 
              placement="bottom" 
              content={content} 
              title="Feedbacks" 
              trigger="click" 
              onVisibleChange={onVisibleChange}
            >
              <Button className="feedback_button">Show feedbacks</Button>
            </Popover>
          </div>
        </div>
    </label>
  );
}