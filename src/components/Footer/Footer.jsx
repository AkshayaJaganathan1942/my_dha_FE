import React from "react";
import { Box, Typography, Link, Table, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import "./Footer.css";

const Footer = () => {
  return (
    <div id="footer">
      <Box
        sx={{
          background: "linear-gradient(to bottom, #4a6572, #344955)",
          color: "white",
          p: 4,
          boxShadow:
            "0 6px 10px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)",
          border: "2px solid white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap", // Allows wrapping for smaller screens
            mb: 3,
            mt: 1,
            mr: 4,
          }}
        >
          {/* First Column */}
          <Box sx={{ flex: "1 1 30%", minWidth: "300px", mb: 4, mr: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
              DHA Tours & Travels
            </Typography>
            <Divider sx={{ backgroundColor: "white", width: "90%", my: 1 }} />
            <Typography
              variant="body2"
              sx={{
                textAlign: "left",
                lineHeight: 2,
                mt: 5,
                mr: 5,
              }}
            >
              DHA Tours & Travels is developing an innovative web application to
              streamline the booking process. Explore various travel options,
              secure bookings, receive real-time updates, and manage itineraries
              all from a single interface.
            </Typography>
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Link href="https://www.facebook.com" color="inherit">
                <FacebookIcon sx={{ mr: 2 }} />
              </Link>
              <Link href="https://www.twitter.com" color="inherit">
                <TwitterIcon sx={{ mr: 2 }} />
              </Link>
              <Link href="https://www.instagram.com" color="inherit">
                <InstagramIcon sx={{ mr: 2 }} />
              </Link>
              <Link href="https://www.linkedin.com" color="inherit">
                <LinkedInIcon />
              </Link>
            </Box>
          </Box>

          {/* Second Column */}
          <Box
            sx={{
              flex: "1 1 30%",
              minWidth: "200px",
              mb: 4,
              textAlign: "left",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Helpful Links
            </Typography>
            <Divider sx={{ backgroundColor: "white", width: "70%", my: 1 }} />
            <Typography variant="body2" sx={{ mb: 1, mt: 5 }}>
              <Link href="/" color="inherit">
                Home
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/about-us" color="inherit">
                About Us
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/packages" color="inherit">
                Packages
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/booking" color="inherit">
                Booking
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/contact-us" color="inherit">
                Contact Us
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/faqs" color="inherit">
                FAQs
              </Link>
            </Typography>
          </Box>

          {/* Third Column */}
          <Box
            sx={{
              flex: "1 1 30%",
              minWidth: "300px",
              textAlign: "left",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Reach Us
            </Typography>
            <Divider
              sx={{ backgroundColor: "white", width: "88%", my: 1, mb: 5 }}
            />
            <Table>
              <tbody>
              <tr>
                <td align="center">
                  <LocalPhoneIcon fontSize="small" />
                </td>
                <td>Phone: (555) 123-4567</td>
              </tr>
              <tr>
                <td align="center">
                  <EmailIcon fontSize="small" />
                </td>
                <td>Email: info@dhatoursandtravels.com</td>
              </tr>
              <tr>
                <td align="center">
                  <HomeIcon fontSize="small" />
                </td>
                <td>Address: SSCS, CMR University</td>
              </tr>
              <tr>
                <td align="center">
                  <AccessTimeFilledIcon fontSize="small" />
                </td>
                <td>Business Hours: Mon - Fri: 9:00am - 5:00pm</td>
              </tr></tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Footer;
