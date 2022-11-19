const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');


// router.post('/create', UserController.store);

router.get('/getAll', UserController.show);

// router.put('/edit', UserController.update);

// router.delete('/delete', UserController.deleteUser)

module.exports = router;