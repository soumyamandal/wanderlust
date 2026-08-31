const User = require("../models/user.js");


//signup ka he sab yaha 

module.exports.signupForm = async(req, res) =>{ 
    res.render("users/signup.ejs");
};

module.exports.createUser = async(req, res, next) =>{
      try {
        let{username, email, password} =req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
      } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
};

//login ka sab yaha he .

module.exports.AfterLogin = (req, res) => {

        console.log(
            "AFTER PASSPORT SESSION:",
            req.session
        );

        const redirectUrl =
            req.session.redirectUrl || "/listings";

        console.log("FINAL REDIRECT:", redirectUrl);

        delete req.session.redirectUrl;

        req.flash("success", "Welcome to Wanderlust!");

        res.redirect(redirectUrl);
};

module.exports.loginUser =  (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out !");
        res.redirect("/listings");
    });
};
