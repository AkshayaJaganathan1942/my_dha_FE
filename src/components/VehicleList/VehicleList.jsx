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
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
    const vehicleType = vehicleTypes.find((type) => type.name === selectedCategory);
    console.log("Matching Vehicle Type:", vehicleType); // Log matching vehicle type
    return vehicleType && vehicle.type === vehicleType.id;
  });
  console.log("Filtered Vehicles:", filteredVehicles); // Log filtered vehicles

  const handleBookingDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDialogOpen(true);
  };

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
          <Typography>Drop Location: {dropLocation}</Typography>
          <Typography>Pickup Date: {pickupDate}</Typography>
          <Typography>Pickup Time: {pickupTime}</Typography>
          <Typography>Distance: {distance} kms</Typography>
          <b>
            <Typography>
              Total Cost: ₹
              {distance * parseFloat(selectedVehicle?.price_per_km)}
            </Typography>
          </b>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // Construct the booking data based on tripType
              const bookingData = {
                pickupLocation,
                dropLocation,
                distance: parseFloat(distance),
                pickupDate,
                pickupTime,
                tripType,
                vehicleType: selectedVehicle?.id, // Use the vehicle ID
              };

              // Add specific fields for Round Trip and Hourly Rental
              if (tripType === "roundtrip") {
                bookingData.returnDate = returnDate;
                bookingData.totalFare =
                  distance * parseFloat(selectedVehicle?.price_per_km) * 2; // Example calculation
              } else if (tripType === "oneway") {
                bookingData.totalFare =
                  distance * parseFloat(selectedVehicle?.price_per_km); // Example calculation
              } else if (tripType === "rental") {
                bookingData.rentalDuration = rentalDuration;
              }

              // Call the posting function
              postBookingData(bookingData, tripType);

              // Close the dialog
              setDialogOpen(false);
            }}
            variant="contained"
            color="primary"
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
    </section>
  );
};

export default VehicleList;
