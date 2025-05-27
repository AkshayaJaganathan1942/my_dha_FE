import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Booking from "./components/Booking/Booking";
import { Working } from "./components/Working/Working";
import Booking_Page from "./components/Booking_Page/Booking_Page";
import Login from "./components/LoginPage/Login";
import { CircularProgress } from "@mui/material";

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
       {/* Overlay and Spinner with Inline CSS */}
       {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "  rgba(0, 0, 0, 0.6)", // Dark background
              backdropFilter: "blur(2px)", // Blur effect
              zIndex: 9998, // Below the spinner
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999, // Above overlay
            }}
          >
            <CircularProgress color="secondary" />
          </div>
        </>
      )}


      {/* Pass setLoading to Navbar and Booking */}
      <Navbar setLoading={setLoading} />

      {/* Routes to dynamically render page content */}
      <Routes>
      <Route
          path="/"
          element={
            <div className="home-page">
              <Hero />
              <div id="services">
                <Services />
              </div>
              <div id="booking">
              {<Booking setLoading={setLoading} />} 
              </div>
              <Working />
              <div id="footer">
                <Footer />
              </div>
            </div>
          }
        />

        <Route
          path="/page-booking"
          element={
            <div className="page-booking">
              {<Booking_Page setLoading={setLoading} />} 
              </div>
          }
        />
        <Route path="/login"  element={<Login setLoading={setLoading} />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </>
  );
};

export default App;
