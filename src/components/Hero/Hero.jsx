import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import carPng from "../../assets/carhero2.png"; // Default image
import AOS from "aos";
import "aos/dist/aos.css";
import "./Hero.css"; // Import the custom CSS file

const Hero = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
    AOS.init({
      offset: 0,
      duration: 1000,
      easing: "ease-out",
      once: true,
    });
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking"); // Get the booking section
    if (bookingSection) {
      const navbar = document.querySelector(".navbar"); // Select the navbar element
      const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get navbar height (default to 0 if not found)
      const additionalOffset = 100; // Extra space below the navbar
  
      // Calculate position with offset
      const elementPosition = bookingSection.getBoundingClientRect().top + window.scrollY; // Element's position
      const offsetPosition = elementPosition - navbarHeight - additionalOffset; // Adjust by navbar and extra offset
  
      window.scrollTo({
        top: offsetPosition, // Final scroll position
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  return (
    <div className="hero-container" id="home">
      <div className="hero-wrapper">
        <div className="hero-grid">
          {/* Image Section */}
          <div
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-once="false"
            className="hero-image-wrapper"
          >
            <img
              src={carPng} // Use a fixed image
              alt="Car"
              className="hero-image"
            />
          </div>
          {/* Text Section */}
          <div className="hero-text">
            <p data-aos="fade-up" className="hero-tagline">
              Seamless Journeys Start Here
            </p>
            <h3 data-aos="fade-up" data-aos-delay="600" className="hero-title">
              Make Every Journey Memorable
            </h3>
            <p
              data-aos="fade-up"
              data-aos-delay="1000"
              className="hero-description"
            >
              Gone are the days of complicated bookings and hidden fees. With
              DHA Tours & Travels, you have access to a transparent,
              user-friendly platform that simplifies the process from start to
              finish.
            </p>
            <button
              data-aos="fade-up"
              data-aos-delay="1500"
              onClick={() => {
                AOS.refreshHard(); // Refresh AOS animations
                scrollToBooking(); // Call the scrollToBooking function
              }}
              className="hero-button"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
