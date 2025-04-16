import { React, useEffect } from "react";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import "./Services.css"; // Import the CSS file
import AOS from "aos";
import "aos/dist/aos.css";

const skillsData = [
  {
    name: "Best Price",
    icon: (
      <MonetizationOnIcon
        style={{ fontSize: "3rem", color: "#f0a500", marginTop: "2" }}
      />
    ),
    link: "#",
    description:
      "Enjoy unbeatable deals and competitive pricing for maximum value.",
    aosDelay: "0",
  },
  // {
  //   name: "Best Price",
  //   icon: <MonetizationOnIcon style={{ fontSize: "3rem", color: "#f0a500", marginTop: "2" }} />,
  //   link: "#",
  //   description: "Offering transparent and fair pricing that you can trust.",
  //   aosDelay: "0",
  // },
  {
    name: "Fast and Safe",
    icon: <SecurityIcon style={{ fontSize: "3rem", color: "#f0a500" }} />,
    link: "#",
    description:
      "Experience quick and secure services designed to prioritize your safety.",
    aosDelay: "500",
  },
  {
    name: "Experienced Drivers",
    icon: <VerifiedIcon style={{ fontSize: "3rem", color: "#f0a500" }} />,
    link: "#",
    description:
      "Ride with trusted professionals who ensure a smooth and reliable journey.",
    aosDelay: "1000",
  },
];

const Services = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });

    // Refresh AOS on component render
    return () => {
      AOS.refresh();
    };
  }, []);


  return (
    <>
      <span id=""></span>
      <div className="services-container" id="services">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title" data-aos="fade-up">
              Why Choose Us
            </h1>
          </div>
          <div className="cards-grid">
            {skillsData.map((skill) => (
              <div
                key={skill.name}
                data-aos="fade-up"
                data-aos-delay={skill.aosDelay}
                className="card"
              >
                <div className="icon-wrapper">{skill.icon}</div>
                <h1 className="card-title">{skill.name}</h1>
                <p className="description">{skill.description}</p>
                {/* <a href={skill.link} className="link">
                  Learn more
                </a> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
