if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL exists:", !!dbUrl);


// ================= MIDDLEWARE =================

app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 224 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);

});

// ================= SESSION =================

const sessionOptions = {
    store,
    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));


// ================= FLASH =================

app.use(flash());


// ================= PASSPORT =================

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


// ================= LOCALS =================

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    res.locals.currUser = req.user;

    next();
});


// ================= DEMO USER =================

// app.get("/demouser", async (req, res) => {

//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser =
//         await User.register(fakeUser, "helloworld");

//     res.send(registeredUser);

// });


// ================= ROUTERS =================

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);


// ================= DATABASE =================

main()
    .then(() => {
        console.log("connect to DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl);
}


// ================= HOME =================

// app.get("/listings", (req, res) => {
//     res.send("Hello, Express!");
// });


// ================= ERROR HANDLING =================

app.use((err, req, res, next) => {

    console.log(err);

    res.status(500).send("Something went wrong.");

});


// ================= SERVER =================

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
