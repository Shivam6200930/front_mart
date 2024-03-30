import React, { useState } from 'react';
import './Homepage_admin.css';

const Slider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === children.length - 1 ? 0 : prevIndex + 1));
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? children.length - 1 : prevIndex - 1));
    };

  return (
    <div className="slider">
      <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {children.map((child, index) => (
          <div key={index} className="slide">
            {child}
          </div>
        ))}
      </div>
      <button onClick={handlePrev} className="arrow1 prev">&lt;</button>
      <button onClick={handleNext} className="arrow1 next">&gt;</button>
    </div>
  );
};

export default Slider;
