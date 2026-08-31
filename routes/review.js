const express = require("express");

const router = express.Router({
    mergeParams: true
});

const{isLoggedIn, isReviewAuthor} =require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// CREATE REVIEW
router.post("/",isLoggedIn,reviewController.createReview);


// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, reviewController.deleteReview );


module.exports = router;