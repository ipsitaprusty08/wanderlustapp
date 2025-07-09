const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
//const { search } = require("./listing.js");


const { listingSchema } = require("../schema.js");
const upload = multer({ storage });


//search
router.get("/search", async (req, res) => {
    const { city } = req.query;

    try {
        const listings = await Listing.find({
            
            location: { $regex: new RegExp(city, "i") }


             
        });

        res.render("listings/search", { listings, error: null });
    } catch (err) {
        res.render("listings/search", { listings: [], error: "Search failed!" });
    }
});


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));



//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//Update
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  

// Search Route - returns listings based on city query
/*router.get("/search", wrapAsync(async (req, res) => {
    const { city } = req.query; // Get the city from the query params

    if (!city) {
        return res.render("listings/search", { error: "Please enter a location." }); // Render with an error if no city provided
    }

    try {
        // Find listings by location (case-insensitive search)
        const listings = await Listing.find({
            location: { $regex: new RegExp(city, 'i') } // Case-insensitive regex search
        });

        if (listings.length === 0) {
            return res.render("listings/search", { error: "No listings found for this location.", listings: [] });
        }

        // Render the search results page with listings
       // res.render("listings/search", { listings, city });
        res.render("listings/search", { listings, error: null });

    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).render("listings/search", { error: 'Something went wrong while fetching listings.' });
    }
}));
*/



 module.exports=router;