import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
// Import vehicle images
import carImg1 from "../../assets/INNOVA.png";
import carImg2 from "../../assets/ETIOS.png";
import carImg3 from "../../assets/INDICA.png";
import ttImg1 from "../../assets/TRAVELLER.png";
import busImg1 from "../../assets/EICHER.png";
import busImg2 from "../../assets/MAHINDRA.png";
import {
  VEHICLE_ENDPOINT,
  OWT_ENDPOINT,
  RT_ENDPOINT,
  RENTAL_ENDPOINT,
  VEHICLETYPE_ENDPOINT,
} from "../../Api";

// Image mapping
const imageMapping = {
  Sedan: carImg2,
  Hatchback: carImg3,
  SUV: carImg1,
  "12-Seater": ttImg1,
  "18-Seater": ttImg1,
  "Mini Bus": busImg1,
  Coach: busImg2,
};

const handleBooking = () => {
  alert("Booking Confirmed!!!");
};

const VehicleList = ({
  selectedCategory,
  tripType,
  pickupLocation,
  dropLocation,
  pickupDate,
  pickupTime,
  returnDate,
  distance,
  rentalDuration,
}) => {
  const { auth } = useAuth(); // Check authentication state
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const selectedKM = rentalDuration
    ? rentalDuration.match(/\d+(?= km)/)?.[0]
    : "0";
  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch(VEHICLE_ENDPOINT);
      const data = await response.json();
      console.log("Fetched Vehicles:", data); // Log fetched vehicles
      setVehicles(data);
    };

    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch(VEHICLETYPE_ENDPOINT);
        const data = await response.json();
        console.log("Fetched Vehicle Types:", data); // Log fetched vehicle types
        setVehicleTypes(data);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

    fetchVehicles();
    fetchVehicleTypes();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleType = vehicleTypes.find(
      (type) => type.typename === selectedCategory
    ); // Use 'typename' here
    console.log("Selected Category:", selectedCategory);
    console.log("Matching Vehicle Type:", vehicleType); // Log matching vehicle type
    return vehicleType && vehicle.type === vehicleType.id; // Match against the correct ID
  });
  console.log("Filtered Vehicles:", filteredVehicles); // Log filtered vehicles

  const postBookingData = async (bookingData, tripType) => {
    let endpoint = "";

    // Determine the endpoint based on tripType
    if (tripType === "oneway") {
      endpoint = OWT_ENDPOINT;
    } else if (tripType === "roundtrip") {
      endpoint = RT_ENDPOINT;
    } else if (tripType === "rental") {
      endpoint = RENTAL_ENDPOINT;
    }

    try {
      // Make the POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      // Handle response
      if (!response.ok) {
        throw new Error("Failed to post booking data");
      }

      const result = await response.json();
      console.log("Booking successful:", result);
      alert("Booking successfully confirmed!");
    } catch (error) {
      console.error("Error posting booking data:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  const handleBookingDialog = (vehicle) => {
    const matchedVehicleType = vehicleTypes.find(
      (type) => type.typename === selectedCategory
    );
    const vehicleTypeId = matchedVehicleType ? matchedVehicleType.id : null; // Extract pk id

    console.log("Vehicle Type ID:", vehicleTypeId); // Log the extracted id

    setSelectedVehicle({ ...vehicle, vehicleTypeId }); // Store vehicle along with its type ID
    setDialogOpen(true);
  };

  const handleConfirmClick = () => {
    if (!auth) {
      setOpenDialog(true); // 🔹 Show login prompt if user isn’t logged in
      return;
    }

    // 🔹 Proceed with booking
    let totalFare = 0;
    if (tripType === "roundtrip") {
      totalFare = (distance * 2 * parseFloat(selectedVehicle?.price_per_km)).toFixed(2);
    } else if (tripType === "rental") {
      const selectedKM = parseInt(rentalDuration.match(/\d+(?= km)/)[0], 10);
      totalFare = (selectedKM * parseFloat(selectedVehicle?.price_per_km) + 500).toFixed(2);
    } else {totalFare = (distance * parseFloat(selectedVehicle?.price_per_km)).toFixed(2);
    }

    const bookingData = {
      vehicleType: selectedVehicle.vehicleTypeId,
      pickupLocation,
      pickupDate,
      pickupTime,
      tripType,
      distance,
      totalFare,
    };

    if (tripType === "roundtrip") bookingData.returnDate = returnDate;
    if (tripType === "rental") bookingData.rentalDuration = selectedKM;
    else {
      bookingData.dropLocation = dropLocation;
      bookingData.distance = distance;
    }

    postBookingData(bookingData, tripType);
    setDialogOpen(false); // 🔹 Close dialog after booking
  };


  return (
    <section className="available-vehicles-section">
      <Typography variant="h5" sx={{ marginTop: "2rem" }}>
        Available {selectedCategory} for {tripType}:
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginTop: "1rem",
        }}
      >
        {filteredVehicles.map((model, index) => (
          <Card
            key={index}
            sx={{ border: "1px solid #ddd", maxWidth: "420px" }}
          >
            <CardMedia
              component="img"
              height="200"
              image={imageMapping[model.name] || defaultImage}
              alt={model.name}
            />
            <CardContent>
              <Typography variant="h6">{model.name}</Typography>
              <Typography variant="body2">
                {model.capacity} passengers
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "0.5rem" }}>
                Price: ₹{model.price_per_km}/km
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color:
                    model.availability_status === "available" ? "green" : "red",
                  marginTop: "0.5rem",
                }}
              >
                {model.availability_status === "available"
                  ? "Available"
                  : "Not Available"}
              </Typography>
              <Button
                sx={{ mt: 1, bgcolor: "#177787" }}
                onClick={() => handleBookingDialog(model)} // Pass model here
                variant="contained"
                className="booking-button"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="vehicle-details-dialog-title"
        aria-describedby="vehicle-details-dialog-description"
      >
        <DialogTitle id="vehicle-details-dialog-title">
          <center>
            <h2>
              <b>Booking Details</b>
            </h2>
          </center>
        </DialogTitle>
        <DialogContent id="vehicle-details-dialog-description">
          <center>
            <img
              src={imageMapping[selectedVehicle?.name]}
              alt={selectedVehicle?.name}
              style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
            />
          </center>
          <Typography variant="h6">
            <b>Vehicle Details:</b>
          </Typography>
          <Typography>
            Name: {selectedVehicle?.name} ({selectedVehicle?.description})
          </Typography>
          <Typography>
            Capacity: {selectedVehicle?.capacity} passengers
          </Typography>
          <Typography>
            Price per KM: ₹{selectedVehicle?.price_per_km}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: "1rem" }}>
            <b>Trip Details:</b>
          </Typography>
          <Typography>Trip Type: {tripType}</Typography>
          <Typography>Pickup Location: {pickupLocation}</Typography>
          {tripType !== "rental" && (
            <Typography>Drop Location: {dropLocation}</Typography>
          )}{" "}
          <Typography>Pickup Date: {pickupDate}</Typography>
          <Typography>Pickup Time: {pickupTime}</Typography>
          {tripType === "roundtrip" && (
            <>
              <Typography>Return Date: {returnDate}</Typography>
              <Typography>Total Distance: {distance * 2} kms</Typography>{" "}
              {/* Double the distance */}
              <br></br>
              <Typography>
                <b>
                  Total Cost: ₹
                  {(
                    distance *
                    2 *
                    parseFloat(selectedVehicle?.price_per_km)
                  ).toFixed(2)}
                </b>{" "}
                (Other charges included)
              </Typography>
            </>
          )}
          {tripType === "rental" && (
            <>
              <Typography>Rental Duration: {rentalDuration}</Typography>
              <br></br>
              <Typography>
                <b>
                  Total Cost: ₹
                  {(
                    selectedKM * parseFloat(selectedVehicle?.price_per_km) +
                    500
                  ).toFixed(2)}
                </b>{" "}
                (Other charges included)
              </Typography>
            </>
          )}
          {tripType === "oneway" && (
            <>
              <Typography>Distance: {distance} kms</Typography>
              <br></br>
              <Typography>
                <b>
                  Total Cost: ₹
                  {(
                    distance * parseFloat(selectedVehicle?.price_per_km)
                  ).toFixed(2)}
                </b>{" "}
                (Other charges included)
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
         
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmClick}
              

            //   let totalFare = 0;

            //   if (tripType === "roundtrip") {
            //     totalFare = (
            //       distance *
            //       2 *
            //       parseFloat(selectedVehicle?.price_per_km)
            //     ).toFixed(2);
            //   } else if (tripType === "rental") {
            //     const selectedKM = rentalDuration.match(/\d+(?= km)/)[0]; // Extract KM value
            //     totalFare = (
            //       selectedKM * parseFloat(selectedVehicle?.price_per_km) +
            //       500
            //     ).toFixed(2);
            //   } else {
            //     totalFare = (
            //       distance * parseFloat(selectedVehicle?.price_per_km)
            //     ).toFixed(2);
            //   }

            //   const bookingData = {
            //     vehicleType: selectedVehicle.vehicleTypeId,
            //     pickupLocation,
            //     pickupDate,
            //     pickupTime,
            //     tripType,
            //     totalFare, // Send totalFare instead of total price
            //   };

            //   if (tripType === "roundtrip") {
            //     bookingData.returnDate = returnDate;
            //   }

            //   if (tripType === "rental") {
            //     bookingData.rentalDuration = selectedKM; // Send only the KM value (30, 40, 50, or 60)
            //     bookingData.totalFare = (
            //       selectedKM * parseFloat(selectedVehicle?.price_per_km) +
            //       500
            //     ).toFixed(2); // Add ₹500 driver beta charge
            //   } else {
            //     bookingData.dropLocation = dropLocation;
            //     bookingData.distance = distance;
            //   }

            //   postBookingData(bookingData, tripType);
            //   setDialogOpen(false);
            // }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>You should login before booking a vehicle!</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => navigate("/login")} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default VehicleList;
