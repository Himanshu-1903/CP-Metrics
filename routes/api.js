const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

router.post('/analyze', analyzeController.analyzeProfile);

module.exports = router;
