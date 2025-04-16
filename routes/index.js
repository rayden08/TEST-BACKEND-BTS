
const express = require('express');


const logger = require("../util/logger");
const router = express.Router();

router.get("/", (req, res) => {
  logger.info("GET request received at /");
  res.send("Hello World!");
});


module.exports = router;
