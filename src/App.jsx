import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Booking from "./components/Booking/Booking";
import { Working } from "./components/Working/Working";
import Booking_Page from "./components/Booking_Page/Booking_Page";
import Login from "./components/LoginPage/Login";

const App = () => {
  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

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
                <Booking />
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
              <Booking_Page />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </>
  );
};

export default App;
