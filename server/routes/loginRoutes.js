const express = require('express');
const router = express.Router();
const { readFromDb, writeToDb, deleteFromDb } = require('../helpers/dbhelpers');

module.exports = router;
