import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Logo from "../../assets/Logo1.png"; // Default image
import { Link } from "react-router-dom";
import "./NavBar.css";
import {
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import "remixicon/fonts/remixicon.css";
import { useAuth } from "../../AuthContext";

export const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const linksRef = useRef([]);
  const animationRef = useRef(null);

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleNavbar = () => {
    if (mobileDrawerOpen) {
      const timeline = gsap.timeline({
        onComplete: () => setMobileDrawerOpen(false),
      });
      timeline.to(drawerRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    } else {
      setMobileDrawerOpen(true);
    }
  };

  useEffect(() => {
    if (mobileDrawerOpen) {
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline();

        timeline.fromTo(
          drawerRef.current,
          { y: "-100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        timeline.fromTo(
          linksRef.current,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );
      });

      animationRef.current = ctx;
    } else if (animationRef.current) {
      animationRef.current.revert();
    }

    return () => animationRef.current?.revert();
  }, [mobileDrawerOpen]);

  const handleNavLinkClick = (hash) => {
    navigate("/"); // Redirects to the home page
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight; // Get the height of the navbar
        const additionalOffset = 100; // Extra space below the navbar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY; // Calculate the element's position
        const offsetPosition = elementPosition - navbarHeight - additionalOffset; // Add extra offset
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth", // Smooth scrolling
        });
      }
    }, 100); // Timeout ensures navigation occurs first
    setMobileDrawerOpen(false); // Close the drawer after clicking
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(null); // Clear auth state
    navigate("/"); // Redirect to the home page
    localStorage.removeItem("currentUser"); // Remove session data
    handleClose(); // Close the menu
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="text-container">
            <img src={Logo} alt="Toad Logo" className="logo-image" />
            <h1 className="logo-text">DHA Tours & Travels</h1>
          </div>
          <ul className="nav-items">
            <li>
              <a href="/">
                <i className="ri-home-line"></i> Home
              </a>
            </li>
            <li>
              <a onClick={() => handleNavLinkClick("#services")}>
                <i className="ri-service-line"></i> Services
              </a>
            </li>
            <li>
              <a onClick={() => handleNavLinkClick("#booking")}>
                <i className="ri-book-line"></i> Book Now
              </a>
            </li>
            <li>
              <a onClick={() => handleNavLinkClick("#footer")}>
                <i className="ri-information-line"></i> About Us
              </a>
            </li>
          </ul>

          <div className="auth-buttons">
            {auth ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                  {auth.username || "Guest"}{" "}
                  {/* Display the logged-in username */}
                </span>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <Link
                  to="/login?type=login"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <Button className="login-button" variant="outlined">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/login?type=signup"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <button className="signup-button">Sign Up</button>
                </Link>
              </>
            )}
          </div>

          <div className="mobile-menu">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? (
                <i className="ri-close-large-fill"></i>
              ) : (
                <i className="ri-menu-3-fill"></i>
              )}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="mobile-drawer" ref={drawerRef}>
            <ul>
              {[
                { text: "Home", icon: "ri-home-line", href: "/" },
                {
                  text: "Services",
                  icon: "ri-service-line",
                  href: "#services",
                },
                {
                  text: "About Us",
                  icon: "ri-information-line",
                  href: "#footer",
                },
                { text: "Book Now", icon: "ri-book-line", href: "#booking" },
              ].map((item, index) => (
                <li
                  key={item.text}
                  ref={(el) => (linksRef.current[index] = el)}
                >
                  <a
                    href={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                  >
                    <i className={item.icon}></i> {item.text}
                  </a>
                </li>
              ))}
            </ul>
            <div className="drawer-buttons">
              {auth ? (
                <div
                  className="profile-section"
                  style={{ display: "flex", alignItems: "center", gap: "24px" }} // Increased gap
                >
                  {/* Merged Profile Icon and Username */}
                  <div
                    onClick={() => {
                      console.log("Profile clicked"); // Add your desired profile action here
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <AccountCircle style={{ fontSize: "2.3rem" }} />
                    <span style={{ fontWeight: "bold" }}>
                      {auth.username || "Guest"}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <IconButton
                    size="small"
                    color="inherit"
                    style={{ marginLeft: "50px" }} // You can also add margin for precise spacing
                    onClick={() => {
                      setAuth(null);
                      setMobileDrawerOpen(false); // Close the drawer
                      navigate("/login?type=login"); // Redirect to login page
                    }}
                  >
                    <LogoutIcon />
                    <span style={{ marginLeft: "20px" }}>Logout</span>
                  </IconButton>
                </div>
              ) : (
                <>
                  {/* Login and Sign-Up Buttons */}
                  <Link
                  to="/login?type=login"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <Button className="login-button" variant="outlined">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/login?type=signup"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <button className="signup-button">Sign Up</button>
                </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
