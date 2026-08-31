const express = require("express");
const router = express.Router();

const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});

// INDEX + CREATE
router.route("/")
    .get(listingController.index)
    .post(isLoggedIn,upload.single("listing[image]"), listingController.createListing);

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(listingController.showListing)
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), listingController.updateListing)
    .delete(isLoggedIn, isOwner, listingController.deleteListing);

// EDIT
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    listingController.renderEditForm
);

module.exports = router;