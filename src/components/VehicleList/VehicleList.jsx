import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import carImg1 from "../../assets/INNOVA.png";
import carImg2 from "../../assets/ETIOS.png";
import carImg3 from "../../assets/INDICA.png";
import ttImg1 from "../../assets/TRAVELLER.png";
import busImg1 from "../../assets/EICHER.png";
import busImg2 from "../../assets/MAHINDRA.png";

const vehicles = [
    {
      category: "Car",
      models: [
        {
          name: "Sedan",
          image: carImg2,
          capacity: "4 passengers",
          price: "₹1200/day",
          availability: true,
          rating: 4.5,
        },
        {
          name: "Hatchback",
          image: carImg3,
          capacity: "4 passengers",
          price: "₹1000/day",
          availability: false,
          rating: 4.2,
        },
        {
          name: "SUV",
          image: carImg1, // Add the appropriate image path
          capacity: "6 passengers",
          price: "₹2000/day",
          availability: true,
          rating: 4.7,
        },
      ],
    },
    {
      category: "Tempo Traveller",
      models: [
        {
          name: "12-Seater",
          image: ttImg1,
          capacity: "12 passengers",
          price: "₹2500/day",
          availability: true,
          rating: 4.8,
        },
        {
          name: "18-Seater",
          image: ttImg1,
          capacity: "18 passengers",
          price: "₹3000/day",
          availability: true,
          rating: 4.3,
        },
      ],
    },
    {
      category: "Bus",
      models: [
        {
          name: "Mini Bus",
          image: busImg2,
          capacity: "30 passengers",
          price: "₹6000/day",
          availability: true,
          rating: 4.6,
        },
        {
          name: "Coach",
          image: busImg1,
          capacity: "50 passengers",
          price: "₹8000/day",
          availability: false,
          rating: 4.7,
        },
      ],
    },
  ];

const VehicleList = ({ selectedCategory, tripType, showVehicles }) => {
  const [sortBy, setSortBy] = useState("name"); // Default sorting by name

  if (!showVehicles) return null; // Render nothing if vehicles are not yet visible

  const filteredVehicles = vehicles
    .filter((vehicle) => vehicle.category === selectedCategory)
    .flatMap((vehicle) => vehicle.models)
    .sort((a, b) => {
      if (sortBy === "price") {
        return (
          parseInt(a.price.replace(/₹|\/day/g, "")) -
          parseInt(b.price.replace(/₹|\/day/g, ""))
        );
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name); // Default: name sorting
    });

  return (
    <section className="available-vehicles-section">
      <Typography variant="h5" sx={{ marginTop: "2rem" }}>
        Available {selectedCategory} Models for {tripType}:
      </Typography>
      <Box sx={{ marginTop: "1rem" }}>
        <Button
          variant="outlined"
          onClick={() => setSortBy("name")}
          sx={{ marginRight: "1rem" }}
        >
          Sort by Name
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSortBy("price")}
          sx={{ marginRight: "1rem" }}
        >
          Sort by Price
        </Button>
        <Button variant="outlined" onClick={() => setSortBy("rating")}>
          Sort by Rating
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Reduced min width
          marginTop: "1rem",
        }}
      >
        {filteredVehicles.map((model, index) => (
          <Card
            key={index}
            sx={{ border: "1px solid #ddd", maxWidth: "420px" }}
          >
            {" "}
            {/* Reduced max width */}
            <CardMedia
              component="img"
              height="200"
              image={model.image}
              alt={model.name}
            />
            <CardContent>
              <Typography variant="h6">{model.name}</Typography>
              <Typography variant="body2">{model.capacity}</Typography>
              <Typography variant="body2" sx={{ marginTop: "0.5rem" }}>
                Price: {model.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: model.availability ? "green" : "red",
                  marginTop: "0.5rem",
                }}
              >
                {model.availability ? "Available" : "Not Available"}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "0.5rem" }}>
                Rating: ⭐ {model.rating}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </section>
  );
};

export default VehicleList;
