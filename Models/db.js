const mongoose = require("mongoose");

const express = require("express");

const MONGODB_URI = "mongodb://localhost:27017/DB_INSTA"; // Replace with your connection string

mongoose
  .connect(
    MONGODB_URI,

    {}
  )
  .then(() => {
    console.log("Database Connect");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
