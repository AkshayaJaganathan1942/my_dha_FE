import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AOS from "aos";
import "aos/dist/aos.css";
import carImg2 from "../../assets/car_sample.png";
import carImg1 from "../../assets/INNOVA.png";
import ttImg1 from "../../assets/TRAVELLER.png";
import busImg1 from "../../assets/EICHER.png";

import "./Booking.css";

const carList = [
  {
    name: "Car",
    image: carImg1,
    aosDelay: "0",
  },
  {
    name: "Tempo Traveller",
    image: ttImg1,
    aosDelay: "500",
  },
  {
    name: "Bus",
    image: busImg1,
    aosDelay: "1000",
  },
];

const Booking = ({ setLoading }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  const handleBookNow = (vehicle) => {
    setLoading(true); // Show loading spinner
    setTimeout(() => {
      setLoading(false); // Hide spinner after navigation
      navigate("/page-booking", { state: { vehicle } }); // Navigate and pass vehicle data
    }, 1500); // Simulated delay for loading
  };


  return (
    <div className="booking-container">
      <h1 data-aos="fade-up" className="booking-heading">
        Book Your Ride Today
      </h1>
      <p
        data-aos="fade-up"
        data-aos-delay="400"
        className="booking-description"
      >
        Choose the perfect ride for your next adventure
      </p>
      <div className="car-list">
        {carList.map((data, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={data.aosDelay}
            className="car-item"
          >
            <div className="car-image-container">
              <img src={data.image} alt={data.name} className="car-image" />
            </div>
            <div className="car-details">
              <h1 className="car-name">{data.name}</h1>
              <button
                className="book-now-button"
                onClick={() => handleBookNow(data.name)} // Pass vehicle name
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;