const express = require('express');
const router = express.Router();

const {
  getUserWithInRadius,
  addUserEndpoint
} = require('../controllers/user')

router.get('/users-within-radius', getUserWithInRadius);
router.post('/add-user', addUserEndpoint)

module.exports = router;
