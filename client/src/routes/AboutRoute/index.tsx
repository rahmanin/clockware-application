import React, { FunctionComponent, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { postData } from "../../api/postData";
import { routes } from "../../constants/routes";
import { UserData } from "../../store/users/actions";
import {userParams} from "../../store/users/selectors";
import './index.scss';

declare global {
  interface Window { user: any; }
}

interface FeedbacksPagination {
  currentPage: number;
  totalfeedbacks: number;
  feedbacks: any[];
  totalPages: number;
}

export const LandingPage: FunctionComponent = () => {
  const [pageFeedbacks, setPageFeedbacks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbacksPagination, setFeedbacksPagination] = useState<any>({} as any);
  const userData: UserData = useSelector(userParams);
  const isMaster: boolean = userData && userData.role === "master";
  const isAdmin: boolean = userData && userData.role === "admin";
  const isClient: boolean = userData && userData.role === "client";

  const getFeedbacksPagination = (page: number) => {
    setIsLoading(true)
    postData({page: page}, "feedbacks_pagination")
      .then((res: FeedbacksPagination) => {
        setFeedbacksPagination(res)
        setPageFeedbacks(res?.currentPage)
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    getFeedbacksPagination(0)
  }, [])

  useEffect((): any => {
    window.user = userData;
    const script: any = document.createElement("script");
    script.src = "/chat.js";
    script.async = true;
    if (!isAdmin && !isMaster) {
      document.body.appendChild(script)
    }
    let widget: any = document.getElementById('__replain_widget');
    if (widget) {
      (isClient || userData?.role === undefined) ? widget.style.display = 'block' : widget.style.display = 'none'
      console.log("widget.style.display")
    }
    return () => {
      let widget: any = document.getElementById('__replain_widget');
      if (widget) {
        widget.style.display = 'none'
      }
      window.user = null
  }
  }, [])
  
  const showNextFeedbacks = () => {
    getFeedbacksPagination(pageFeedbacks+1)
  }

  const showPrevFeedbacks = () => {
    getFeedbacksPagination(pageFeedbacks-1)
  }

  return ( 
    <div className="main_wrapper">
      <div className="get_started_wrapper">
        <div className="get_started_text">
          <h1>Start with Clockware.</h1>
          <p>Provide a network for all your needs with ease and fun using LaslesVPN discover interesting features from us.</p>
          <Link to={routes.order}>
            <a className="red_rect_btn">Get Started</a>
          </Link>
        </div>
        <img className="get_started_img" src="./img/get_started_img.png"/>
      </div>
      <div className="info_wrapper">
        <div className="info_block">
          <div className="info_icon users"></div>
          <div className="info_text">
            <h1>90+</h1>
            <p>Users</p>
          </div>
        </div>
        <div className="line"></div>
        <div className="info_block">
          <div className="info_icon locations"></div>
          <div className="info_text">
            <h1>30+</h1>
            <p>Locations</p>
          </div>
        </div>
        <div className="line"></div>
        <div className="info_block">
          <div className="info_icon servers"></div>
          <div className="info_text">
            <h1>50+</h1>
            <p>Servers</p>
          </div>
        </div>
      </div>
      <div className="features_wrapper">
        <img className="features_img" src="./img/features_img.png"/>
        <div className="features_text">
          <h1>We Provide Many Features You Can Use</h1>
          <p>You can explore the features that we provide with fun and have their own functions each feature.</p>
          <ul>
            <li><span className="check_circle"></span>Powerfull online protection.</li>
            <li><span className="check_circle"></span>Internet without borders.</li>
            <li><span className="check_circle"></span>Supercharged VPN</li>
            <li><span className="check_circle"></span>No specific time limits.</li>
          </ul>
        </div>
      </div>
      <div className="choose_plan_wrapper">
        <div className="choose_plan_header">
          <h1>Choose Your Plan</h1>
          <p>Let's choose the package that is best for you and explore it happily and cheerfully.</p>
        </div>
        <form className="choose_plan_cards_wrapper">
          <label className="radio_label">
            <input 
              name="1"
              type="radio" 
              className="card-radio"
            />
              <div className="choose_plan_card">
                <div className="card_top_section">
                  <div className="free_img"></div>
                  <h2>Free Plan</h2>
                  <ul>
                    <li><span className="check"></span>Unlimited Bandwitch</li>
                    <li><span className="check"></span>Encrypted Connection</li>
                    <li><span className="check"></span>No Traffic Logs</li>
                    <li><span className="check"></span>Works on All Devices</li>
                  </ul>
                </div>
                <div className="card_bottom_section">
                  <h2>Free</h2>
                  <a className="card_btn">Select</a>
                </div>
              </div>
          </label>
          <label className="radio_label">
            <input 
              name="1"
              type="radio" 
              className="card-radio"
            />
            <div className="choose_plan_card">
              <div className="card_top_section">
                <div className="standard_img"></div>
                <h2>Standard Plan</h2>
                <ul>
                  <li><span className="check"></span>Unlimited Bandwitch</li>
                  <li><span className="check"></span>Encrypted Connection</li>
                  <li><span className="check"></span>Yes Traffic Logs</li>
                  <li><span className="check"></span>Works on All Devices</li>
                  <li><span className="check"></span>Connect Anyware</li>
                </ul>
              </div>
              <div className="card_bottom_section">
                <h2>$9 <span>/ mo</span></h2>
                <a className="card_btn">Select</a>
              </div>
            </div>
          </label>
          <label className="radio_label">
            <input 
              name="1"
              type="radio" 
              className="card-radio"
            />
            <div className="choose_plan_card">
              <div className="card_top_section">
                <div className="premium_img"></div>
                <h2>Premium Plan</h2>
                <ul>
                  <li><span className="check"></span>Unlimited Bandwitch</li>
                  <li><span className="check"></span>Encrypted Connection</li>
                  <li><span className="check"></span>Yes Traffic Logs</li>
                  <li><span className="check"></span>Works on All Devices</li>
                  <li><span className="check"></span>Connect Anyware</li>
                  <li><span className="check"></span>Get New Features</li>
                </ul>
              </div>
              <div className="card_bottom_section">
                <h2>$12 <span>/ mo</span></h2>
                <a className="card_btn">Select</a>
              </div>
            </div>
          </label>
        </form>
      </div>
      <div className="global_network_wrapper">
        <h1>Huge Global Network of Fast VPN</h1>
        <p>See <b>Clockware</b> everywhere to make it easier for you when you move locations.</p>
        <img className="map" src="img/Map.png" />
        <div className="corporations">
          <div className="netflix"></div>
          <div className="reddit"></div>
          <div className="amazon"></div>
          <div className="discord"></div>
          <div className="spotify"></div>
        </div>
      </div>
      <div className="feedbacks_wrapper">
        <h1 className="title">Trusted by Thousands of Happy Customer</h1>
        <p className="description">These are the stories of our customers who have joined us with great pleasure when using this crazy feature.</p>
        <div className="feedback_cards_container">
          {
            isLoading ? (<div className="loader">Loading...</div>)
              :
            feedbacksPagination?.feedbacks?.map((feedback: any, index: number) => {
              return (
                <div className={`feedback_card index_${index}`}>
                  <div className="feedback_header">
                    <div className="client_wrapper">
                      <div className="avatar"></div>
                      <div className="client_info">
                        <h3 className="name">Smones name</h3>
                        <p className="address">City, Ololo</p>
                      </div>
                    </div>
                    <div className="rating_wrapper">
                      <span className="rating">{feedback.evaluation}</span>
                      <div className="star"></div>
                    </div>
                  </div>
                  <p className="feedback_text">{feedback.feedback}</p>
                </div>
              )
            })
          }
        </div>
        <div className="feedback_footer">
          <div className="section left_section">
            <div className="thick_line"></div>
            <div className="point"></div>
            <div className="point"></div>
            <div className="point"></div>
          </div>
          <div className="section right_section">
            <div 
              className="btn_left" 
              onClick={showPrevFeedbacks}
              hidden={pageFeedbacks === 0}
            >
              <div className="arrow left"></div>
            </div>
            <div 
              className="btn_right"
              onClick={showNextFeedbacks}
              hidden={feedbacksPagination?.totalPages === feedbacksPagination?.currentPage}
            >
              <div className="arrow right"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_wrapper">
        <div className="subscribe_pannel">
          <div className="subscribe_text">
            <h1>Super olololo latest news</h1>
            <p>Let's subscribe with us and find the fun.</p>
          </div>
          <Link to={routes.blog}>
            <a className="red_rect_btn">Latest news</a>
          </Link>
        </div>
        <div className="footer_content">
          <div className="footer_left">
            <a className="header_logo">
              <div className="logo_png"></div>
              <p>Clockware</p>
            </a>
            <p className="footer_text"><b>Clockware</b> is a private virtual network that has unique features and has high security.</p>
            <div className="socials_wrapper">
              <div className="social_network facebook"></div>
              <div className="social_network twitter"></div>
              <div className="social_network instagram"></div>
            </div>
            <span>©2020LaslesVPN</span>
          </div>
          <div className="footer_right">
            <div className="product">
              <h2>Product</h2>
              <ul>
                <li>Download</li>
                <li>Pricing</li>
                <li>Locations</li>
                <li>Server</li>
                <li>Countries</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="engage">
              <h2>Engage</h2>
              <ul>
                <li>LaslesVPN ? </li>
                <li>FAQ</li>
                <li>Tutorials</li>
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="earn_money">
              <h2>Earn Money</h2>
              <ul>
                <li>Affiliate</li>
                <li>Become Partner</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}