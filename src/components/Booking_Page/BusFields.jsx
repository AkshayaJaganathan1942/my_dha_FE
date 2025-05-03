import React, { useState } from "react";
import { Box, TextField, List, Button, ListItem , CircularProgress} from "@mui/material";
import axios from "axios";

const BusFields = ({
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
  distance,
  setDistance,
}) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchPickup = async (query) => {
    setPickupLocation(query);
    if (query.length > 2) {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&countrycodes=IN`
      );
      setPickupSuggestions(response.data);
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleSearchDrop = async (query) => {
    setDropLocation(query);
    if (query.length > 2) {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&countrycodes=IN`
      );
      setDropSuggestions(response.data);
    } else {
      setDropSuggestions([]);
    }
  };

  const calculateDistance = async () => {
    const apiKey = "5b3ce3597851110001cf62489136814f45114359bf2b04307e11f67f"; // Replace with your API key
    try {
      if (pickupLocation && dropLocation) {
        setLoading(true); // Show spinner
        const responsePickup = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${pickupLocation}&addressdetails=1&countrycodes=IN`
        );
        const responseDrop = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${dropLocation}&addressdetails=1&countrycodes=IN`
        );

        if (responsePickup.data.length > 0 && responseDrop.data.length > 0) {
          const pickupCoords = [
            parseFloat(responsePickup.data[0].lon),
            parseFloat(responsePickup.data[0].lat),
          ];
          const dropCoords = [
            parseFloat(responseDrop.data[0].lon),
            parseFloat(responseDrop.data[0].lat),
          ];

          const responseDistance = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
              coordinates: [pickupCoords, dropCoords],
            },
            {
              headers: {
                Authorization: apiKey,
              },
            }
          );

          const { distance } = responseDistance.data.routes[0].summary;
          setDistance((distance / 1000).toFixed(2)); // Update state with calculated distance in kilometers
        }
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <Box>
       {loading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark background
                  backdropFilter: "blur(2px)", // Blur effect
                  zIndex: 9998, // Behind the spinner
                }}
              >
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999, // Spinner on top
                  }}
                >
                  <CircularProgress color="secondary" />
                </div>
              </div>
            )}
      {tripType === "oneway" && (
        <>
          <TextField
            label="Pickup Location"
            value={pickupLocation}
            onChange={(e) => handleSearchPickup(e.target.value)}
            fullWidth
          />
          <List>
            {pickupSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setPickupLocation(suggestion.display_name);
                  setPickupSuggestions([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>

          <TextField
            label="Drop Location"
            value={dropLocation}
            onChange={(e) => handleSearchDrop(e.target.value)}
            fullWidth
          />
          <List>
            {dropSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setDropLocation(suggestion.display_name);
                  setDropSuggestions([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button
              onClick={calculateDistance}
              sx={{
                width: "300px", // Adjust the width as desired
                color: "#177787",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "color 0.3s ease-in-out",
                mb: 2,
              }}
            >
              Calculate Distance :
            </Button>
            <TextField
              label="Total Distance (km)"
              value={distance} // Bind the calculated distance to the TextField
              InputProps={{
                readOnly: true, // Make the TextField read-only
              }}
              fullWidth
            ></TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <TextField
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Set minimum date to today's date
              }}
            
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => {
                setPickupTime(e.target.value); // Update state with the selected time
                e.target.blur(); // Close the dropdown programmatically
              }}              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </>
      )}
      {tripType === "roundtrip" && (
        <>
          <TextField
            label="Pickup Location"
            value={pickupLocation}
            onChange={(e) => handleSearchPickup(e.target.value)}
            fullWidth
          />
          <List>
            {pickupSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setPickupLocation(suggestion.display_name);
                  setPickupSuggestions([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>

          <TextField
            label="Drop Location"
            value={dropLocation}
            onChange={(e) => handleSearchDrop(e.target.value)}
            fullWidth
          />
          <List>
            {dropSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setDropLocation(suggestion.display_name);
                  setDropSuggestions([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button
              onClick={calculateDistance}
              sx={{
                width: "300px", // Adjust the width as desired
                color: "#177787",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "color 0.3s ease-in-out",
                mb: 2,
              }}
            >
              Calculate Distance :
            </Button>
            <TextField
              label="Total Distance (km)"
              value={distance} // Bind the calculated distance to the TextField
              onChange={(e) => setDistance(e.target.value)}
              InputProps={{
                readOnly: true, // Make the TextField read-only
              }}
              fullWidth
            ></TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <TextField
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Set minimum date to today's date
              }}
            
            />
            <TextField
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => {
                setPickupTime(e.target.value); // Update state with the selected time
                e.target.blur(); // Close the dropdown programmatically
              }}              InputLabelProps={{ shrink: true }}
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
            inputProps={{
              min: pickupDate || new Date().toISOString().split("T")[0], // Restrict to dates after Pickup Date
            }}
          
          />
        </>
      )}
    </Box>
  );
};

export default BusFields;
