const express = require('express');
const router = express.Router();
const batchController= require("../controllers/batch");

// POST 
 router.post('/', batchController.batchForUsers);


module.exports = router;