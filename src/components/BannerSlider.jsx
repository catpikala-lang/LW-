import React, { useEffect, useState, useRef } from "react";
import "./BannerSlider.css";

// ডেমো ছবি, পরে API থেকে আসবে
const demoImages = [
  "https://i.ibb.co/0j1Yw1g/banner1.jpg",
  "https://i.ibb.co/6b7Q7Qw/banner2.jpg",
  "https://i.ibb.co/3k1Q7Qw/banner3.jpg",
  "https://i.ibb.co/4j1Yw1g/banner4.jpg",
  "https://i.ibb.co/5b7Q7Qw/banner5.jpg"
];

// প্রতি ইমেজ 3.5s দেখাবে
const BannerSlider = ({ images = demoImages, interval = 3500 }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, images, interval]);

  return (
    <div className="banner-slider">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt="Banner"
          className={`banner-slide${idx === current ? " active" : ""}`}
        />
      ))}
      <div className="banner-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? "active" : ""}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
