const express = require('express');
const router = express.Router();
const { handleUser } = require('../controller/EditProfile');
const upload = require("../middleware/upload");

//const authenticateToken = require('../middleware/jwtauth');


router.post("/:username/edit-profile", upload.single("profilePicture"), handleUser );

module.exports = router;
