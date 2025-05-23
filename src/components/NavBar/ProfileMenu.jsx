import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Drawer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../AuthContext";
import {
  USER_ENDPOINT,
  VEHICLETYPE_ENDPOINT,
  VEHICLE_ENDPOINT,
  OWT_ENDPOINT,
  RT_ENDPOINT,
  RENTAL_ENDPOINT,
} from "../../Api";

import SedanImage from "../../assets/ETIOS.png";
import HatchbackImage from "../../assets/INDICA.png";
import SUVImage from "../../assets/INNOVA.png";
import TravellerImage from "../../assets/TRAVELLER.png";
import EicherImage from "../../assets/EICHER.png";
import MahindraImage from "../../assets/MAHINDRA.png";

const imageMapping = {
  Sedan: SedanImage,
  Hatchback: HatchbackImage,
  SUV: SUVImage,
  "12-Seater": TravellerImage,
  "18-Seater": TravellerImage,
  "Mini Bus": EicherImage,
  Coach: MahindraImage,
};

const ProfileMenu = ({ open, onClose }) => {
  const { auth } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState({});
  const [vehicles, setVehicles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!auth?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch User Details
        const userResponse = await fetch(`${USER_ENDPOINT}${auth.id}/`);
        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user details: ${userResponse.status}`
          );
        }
        const userData = await userResponse.json();
        setUserDetails(userData);

        // Fetch booking history with username_id filter
        const fetchOWT = fetch(`${OWT_ENDPOINT}?username_id=${auth?.id}`).then(res => res.ok ? res.json() : []);
        const fetchRT = fetch(`${RT_ENDPOINT}?username_id=${auth.id}`).then(res => res.ok ? res.json() : []);
        const fetchRental = fetch(`${RENTAL_ENDPOINT}?username_id=${auth.id}`).then(res => res.ok ? res.json() : []);

        const [owtBookings, rtBookings, rentalBookings] = await Promise.all([
          fetchOWT,
          fetchRT,
          fetchRental,
        ]);

        // Combine all booking histories
        const allBookings = [...owtBookings, ...rtBookings, ...rentalBookings];
        setBookingHistory(allBookings);

        // Fetch Vehicle Types
        const vehicleTypeResponse = await fetch(VEHICLETYPE_ENDPOINT);
        if (vehicleTypeResponse.ok) {
          const vehicleTypeData = await vehicleTypeResponse.json();
          const typesMap = {};
          vehicleTypeData.forEach((type) => (typesMap[type.id] = type.typename));
          setVehicleTypes(typesMap);
        } else {
          console.warn(
            "Failed to fetch vehicle types:",
            vehicleTypeResponse.status
          );
        }

        // Fetch Vehicles (to get names for image mapping)
        const vehicleResponse = await fetch(VEHICLE_ENDPOINT);
        if (vehicleResponse.ok) {
          const vehicleData = await vehicleResponse.json();
          const vehicleMap = {};
          vehicleData.forEach((vehicle) => (vehicleMap[vehicle.id] = vehicle));
          setVehicles(vehicleMap);
        } else {
          console.warn("Failed to fetch vehicles:", vehicleResponse.status);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [auth?.id]);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <div style={{ width: 550, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="h4" gutterBottom><b> Your Profile</b>
        </Typography>
        {loading && <Typography>Loading profile information...</Typography>}
        {error && <Typography color="error">Error: {error}</Typography>}
        {userDetails && (
          <div>
            <Typography>Username: {userDetails.username}</Typography>
            <Typography>Email: {userDetails.email}</Typography>
            <br />
            <Typography variant="h6"><b>Booking History</b></Typography>
            {bookingHistory.length > 0 ? (
              <List>
                {bookingHistory.map((booking, index) => {
                  const vehicleTypeName = vehicleTypes[booking.vehicleType];
                  const vehicleDetails = vehicles[booking.vehicleType];
                  const imageName = vehicleDetails?.name;
                  const imageUrl = imageMapping[imageName] || null;

                  let locationInfo = "";
                  let displayTripType = booking.tripType;
                  let bookingTypePrefix = "";

                  if (booking.pickupLocation && booking.dropLocation && booking.tripType === 'oneway') {
                    locationInfo = `${booking.pickupLocation} to ${booking.dropLocation}`;
                    bookingTypePrefix = "owt";
                  } else if (booking.pickupLocation && booking.dropLocation && booking.returnDate) {
                    locationInfo = `From ${booking.pickupLocation} to ${booking.dropLocation}, Return: ${new Date(booking.returnDate).toLocaleDateString()}`;
                    displayTripType = 'roundtrip';
                    bookingTypePrefix = "rt";
                  } else if (booking.pickupLocation && booking.rentalDuration) {
                    locationInfo = `Rental from ${booking.pickupLocation} for ${booking.rentalDuration} days`;
                    displayTripType = 'rental';
                    bookingTypePrefix = "rental";
                  } else if (booking.pickupLocation && booking.dropLocation) {
                    locationInfo = `${booking.pickupLocation} to ${booking.dropLocation}`;
                  } else if (booking.pickupLocation) {
                    locationInfo = `Pickup: ${booking.pickupLocation}`;
                  }

                  const bookingDate = booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A';
                  const uniqueKey = booking.id ? `${bookingTypePrefix}-${booking.id || index}` : `booking-${index}`;

                  return (
                    <ListItem
                      key={uniqueKey}
                      sx={{ borderBottom: "1px solid #eee", padding: "16px 0" }}
                    >
                      {imageUrl && (
                        <ListItemAvatar>
                          <Avatar
                            src={imageUrl}
                            alt={imageName}
                            sx={{ width: 60, height: 60, mr: 2 }}
                          />
                        </ListItemAvatar>
                      )}
                      <ListItemText
                        primary={`${vehicleTypeName || "Vehicle"} - ${displayTripType || "Booking"}`}
                        secondary={
                          <>
                            {booking.totalFare !== undefined && (
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Amount: ₹{booking.totalFare}
                                </Typography>
                                <br />
                              </>
                            )}
                            {displayTripType && (
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Trip Type: {displayTripType}
                                </Typography>
                                <br />
                              </>
                            )}
                            {booking.pickupDate && (
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Date: {bookingDate}
                                </Typography>
                                <br />
                              </>
                            )}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              Location: {locationInfo}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography>No booking history available.</Typography>
            )}
          </div>
        )}
        {!auth?.id && !loading && (
          <Typography>Please log in to view your profile.</Typography>
        )}
      </div>
    </Drawer>
  );
};

export default ProfileMenu;