import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const CarFields = ({
  tripType,

  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  pickupLocation, 
  setPickupLocation, 
  dropLocation,
  setDropLocation,
  returnDate,
  setReturnDate,
  rentalDuration,
  setRentalDuration,
}) => {
  return (
    <Box>
      {tripType === "One-way" && (
        <>
          <TextField
            label="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          <TextField
            label="Drop Location"
            value={dropLocation}
            onChange={(e) => setDropLocation(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <TextField
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </>
      )}
      {tripType === "Round trip" && (
        <>
          <TextField
            label="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          <TextField
            label="Drop Location"
            value={dropLocation}
            onChange={(e) => setDropLocation(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <TextField
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          <TextField
            label="Return Date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </>
      )}
      {tripType === "Hourly Rental" && (
        <>
        <TextField
              label="Pickup Location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            

            <TextField
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          <TextField
            label="Rental Duration"
            select
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
            fullWidth
          >
            <MenuItem value="3 hr (30 km)">3 hr (30 km)</MenuItem>
            <MenuItem value="4 hr (40 km)">4 hr (40 km)</MenuItem>
            <MenuItem value="5 hr (50 km)">5 hr (50 km)</MenuItem>
            <MenuItem value="6 hr (60 km)">6 hr (60 km)</MenuItem>
          </TextField>
        </>
      )}
    </Box>
  );
};

export default CarFields;
