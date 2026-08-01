const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getConfig } = require('../controllers/config.controller');

const router = express.Router();

router.get('/config', asyncHandler(getConfig));

module.exports = router;
