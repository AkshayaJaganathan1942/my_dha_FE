import React from "react";
import { Box, TextField } from "@mui/material";

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
    </Box>
  );
};

export default CarFields;
