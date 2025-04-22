import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

import carImg1 from "../../assets/INNOVA.png";
import ttImg1 from "../../assets/TRAVELLER.png";
import busImg1 from "../../assets/EICHER.png";

import VehicleList from "../VehicleList/VehicleList";
import CarFields from "./CarFields"; // Import CarFields component
import TempoTravellerFields from "./TempoTravellerFields"; // Import TempoTravellerFields component
import BusFields from "./BusFields"; // Import BusFields component
import "./Booking_Page.css";

const vehicleOptions = [
  { name: "Car", image: carImg1 },
  { name: "Tempo Traveller", image: ttImg1 },
  { name: "Bus", image: busImg1 },
];

const Booking_Page = ({ setLoading }) => {
  const location = useLocation();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || "Car");
  const [tripType, setTripType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [localType, setLocalType] = useState("Local"); // Local or Outstation selector
  const [dialogOpen, setDialogOpen] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [showVehicles, setShowVehicles] = useState(false); // State to show available vehicles
  const vehicleListRef = useRef(null);
  const [distance, setDistance] = useState("");

  useEffect(() => {
    if (showVehicles && vehicleListRef.current) {
      vehicleListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showVehicles]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleVehicleSelect = (selectedVehicle) => {
    setVehicle(selectedVehicle);
    handleDialogClose();
  };

  const validateForm = () => {
    let emptyFields = [];
    let invalidFields = [];

    if (!vehicle) emptyFields.push("Vehicle");
    if (!tripType) emptyFields.push("Trip Type");
    if (!pickupLocation?.trim()) emptyFields.push("Pickup Location");
    if (!dropLocation?.trim()) emptyFields.push("Drop Location");
    if (!pickupDate) emptyFields.push("Pickup Date");
    if (!pickupTime) emptyFields.push("Pickup Time");
    if (tripType === "Round trip" && !returnDate)
      emptyFields.push("Return Date");
    if (tripType === "Hourly Rental" && !rentalDuration) {
      emptyFields.push("Rental Duration");
    }
    if (!distance) emptyFields.push("Distance (Calculate it)");

    // Show alert for empty or invalid fields
    if (emptyFields.length > 0) {
      alert(`\n${emptyFields.join(", ")} fields are empty!!!`);
      return false; // Validation failed
    }

    return true; // Validation succeeded
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }
  
    setLoading(true); // Trigger loading spinner and blur effect
    setTimeout(() => {
      const formData = {
        vehicle,
        tripType,
        pickupLocation,
        dropLocation,
        pickupDate,
        pickupTime,
        returnDate,
        rentalDuration,
        distance,
      };
  
      console.log("Form Data:", formData);
  
      setShowVehicles(true); // Trigger VehicleList rendering
      vehicleListRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to vehicle list
  
      setLoading(false); // Stop loading
    }, 1500); // Simulate loading time (adjust as necessary)
  };

  return (
    <Box className="booking-container">
      <div>
        <div className="heading">
          <h1>
            Book Your <span>Perfect Ride</span>
          </h1>
        </div>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <Paper elevation={3}>
            <Box className="vehicle-trip-row">
              <div className="vehicle-trip-details">
                <h3>
                  {vehicle && tripType
                    ? `${vehicle} - ${tripType}`
                    : vehicle || tripType}
                </h3>
              </div>
              <Button
                onClick={handleDialogOpen}
                className="change-selection-button"
              >
                Change Selection
              </Button>
            </Box>
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
            >
              <DialogTitle id="dialog-title">Select Your Vehicle</DialogTitle>
              <DialogContent id="dialog-description">
                {vehicleOptions.map((option, index) => (
                  <Box
                    key={index}
                    className="dialog-box"
                    onClick={() => handleVehicleSelect(option.name)}
                  >
                    <img
                      className="dialog-box-img"
                      src={option.image}
                      alt={option.name}
                    />
                    <span>{option.name}</span>
                  </Box>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} className="cancel-button">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <Box className="radio-box">
              <Box
                className="radio-with-select"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <Typography sx={{ marginRight: "1rem" }}>
                  Select the trip Type:
                </Typography>

                <FormControl>
                  <RadioGroup
                    aria-labelledby="trip-type-radio-label"
                    name="trip-type-radio"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="One-way"
                      control={<Radio />}
                      label="One-way"
                      className="radio-item"
                    />
                    <FormControlLabel
                      value="Round trip"
                      control={<Radio />}
                      label="Round trip"
                      className="radio-item"
                    />
                    {vehicle !== "Tempo Traveller" && vehicle !== "Bus" && (
                      <FormControlLabel
                        value="Hourly Rental"
                        control={<Radio />}
                        label="Hourly Rental"
                        className="radio-item"
                      />
                    )}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
            <Box className="form-fields">
              {vehicle === "Car" && (
                <CarFields
                  tripType={tripType}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  pickupLocation={pickupLocation}
                  setPickupLocation={setPickupLocation}
                  dropLocation={dropLocation}
                  setDropLocation={setDropLocation}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                  rentalDuration={rentalDuration}
                  setRentalDuration={setRentalDuration}
                  distance={distance}
                  setDistance={setDistance}
                />
              )}
              {vehicle === "Tempo Traveller" && (
                <TempoTravellerFields
                  tripType={tripType}
                  setTripType={setTripType}
                  localType={localType}
                  setLocalType={setLocalType}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  pickupLocation={pickupLocation}
                  setPickupLocation={setPickupLocation}
                  dropLocation={dropLocation}
                  setDropLocation={setDropLocation}
                  rentalDuration={rentalDuration}
                  setRentalDuration={setRentalDuration}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                />
              )}
              {vehicle === "Bus" && (
                <BusFields
                  tripType={tripType}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  pickupLocation={pickupLocation}
                  setPickupLocation={setPickupLocation}
                  dropLocation={dropLocation}
                  setDropLocation={setDropLocation}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                variant="outlined"
                color="primary"
                className="search-button"
                onClick={() => {
                  setVehicle("Car");
                  setTripType("");
                  setPickupLocation("");
                  setDropLocation("");
                  setPickupDate("");
                  setPickupTime("");
                  setRentalDuration("");
                  setLocalType("Local");
                  setReturnDate("");
                  setDistance("");
                }}
              >
                CLEAR
              </button>
              <button
                type="submit"
                variant="contained"
                color="primary"
                className="search-button"
              >
                SEARCH CABS
              </button>
            </Box>
          </Paper>
        </form>
        <div ref={vehicleListRef}>
          {showVehicles && (
            <VehicleList
              selectedCategory="Car"
              tripType="One-way"
              showVehicles={showVehicles}
            />
          )}
        </div>
      </div>
    </Box>
  );
};

export default Booking_Page;
