import React, { useState } from "react";
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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import carImg1 from "../../assets/car_sample.png";
import carImg2 from "../../assets/car_sample.png";
import carImg3 from "../../assets/car_sample.png";
import CarFields from "./CarFields"; // Import CarFields component
import TempoTravellerFields from "./TempoTravellerFields"; // Import TempoTravellerFields component
import "./Booking_Page.css";

const vehicleOptions = [
  { name: "Car", image: carImg1 },
  { name: "Tempo Traveller", image: carImg2 },
  { name: "Bus", image: carImg3 },
];

const Booking_Page = () => {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      vehicle,
      tripType,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      returnDate,
      rentalDuration,
      localType,
    };
    console.log("Form Data:", formData);
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
              className="dialog-container"
              open={dialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
            >
              <DialogTitle className="dialog-title">
                Select Your Vehicle
              </DialogTitle>
              <DialogContent className="dialog-content">
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
              {vehicle === "Tempo Traveller" ? (
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
                    </RadioGroup>
                  </FormControl>
                </Box>
              ) : (
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
                      className="radio-group-left"
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
                      {vehicle !== "Tempo Traveller" && (
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
              )}
            </Box>
            <Box className="form-fields">
              {vehicle === "Car" && (
                <CarFields
                  tripType={tripType}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  dropLocation={dropLocation}
                  setDropLocation={setDropLocation}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                  rentalDuration={rentalDuration}
                  setRentalDuration={setRentalDuration}
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
            </Box>
            <button
              variant="contained"
              color="primary"
              className="search-button"
            >
              SEARCH CABS
            </button>
          </Paper>
        </form>
      </div>
    </Box>
  );
};

export default Booking_Page;
