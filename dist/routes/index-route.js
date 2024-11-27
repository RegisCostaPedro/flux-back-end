// src/routes/index-route.js
var express = require("express");
var router = express.Router();
router.get("/", (req, res, next) => {
  res.status(200).send({
    title: "Flux",
    version: "0.0.28"
  });
});
module.exports = router;
