import React from 'react';


import {images} from '../../constants';
import './AboutUs.css';

const AboutUs = () => (
  <div className='app__aboutus' id='about'>
    <div className="app__aboutus-overlay flex__center">
      <img src={images.H} alt="g letter" />
    </div>

    <div className="app__aboutus-content flex__center">
      <div className="app__aboutus-content_about">
        <h1 className='headtext__cormorant'>About US</h1>
        <img src={images.spoon} alt="about_spoon" className='spoon__img'/>
        <p className='p__opensans'>We’re an absolute good in the Indo-Nepal cuisine-themed restaurants. Find us located at Kanakubo Ibaraki ken. We serve you from 9 AM to 7 PM. We’re open Sunday, Monday, Tuesday, Thursday and Friday.</p>
        <button type='button' className='custom__button'>Know More</button>
      </div>

      <div className="app__aboutus-content_knife flex__center">
        <img src={ images.knife} alt="about_knife" />
      </div>

      <div className="app__aboutus-content_history">
        <h1 className='headtext__cormorant'>Our History</h1>
        <img src={images.spoon} alt="about_spoon" className='spoon__img'/>
        <p className='p__opensans'>Find us located at Kanakubo Ibaraki ken. We serve you from 9 AM to 7 PM. We’re open Sunday, Monday, Tuesday, Thursday and Friday.</p>
        <button type='button' className='custom__button'>Know More</button>
      </div>

    </div>

  </div>
);

export default AboutUs;
