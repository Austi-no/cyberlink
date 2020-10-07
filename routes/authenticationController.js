const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");


const express = require("express");
var app = express();


const storage = multer.diskStorage({
    destination: './upload',
    filename: (req, file, callBack) => {
        return callBack(null, `${
            file.fieldname
        }_${
            Date.now()
        }${
            path.extname(file.originalname)
        }`)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }
})

module.exports = (router) => {

    // router.use('/updateProfilePic', express.static('upload'))
    // router.post("/updateProfilePic", upload.single('pic'), (req, res) => {


    //     if (!req.file) {
    //         res.json({success: false, message: "no file was selected!"})
    //     } else {
    //         res.json({
    //                 success: true, message: "file is saved", profile_url: `http://localhost:8585/authentication/updateProfilePic/${
    //                 req.file.filename
    //             }`
    //         })
    //     }

    // })

    function errHandler(err, req, res, next) {
        if (err instanceof multer.MulterError) {
            res.json({success: false, message: err.message})
        }
    }

    router.use(errHandler)

    /* ==============
       Register Route
    ============== */
    router.post("/register", (req, res) => { // Check if email was provided
        if (!req.body.email) {
            res.json({success: false, message: "You must provide an e-mail"}); // Return error
        } else if (!req.body.username) {
            res.json({success: false, message: "You must provide a username"});
        } else if (!req.body.password) {
            res.json({success: false, message: "You must provide a password"}); // Return error
        } else { // Create new user object and apply user input
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                description: req.body.description,
                phone: req.body.phone,
                education: req.body.education,
                interest: req.body.interest,
                address: req.body.address,
                city: req.body.city,
                country: req.body.country
            });
            // Save user to database
            user.save((err) => { // Check if error occured
                if (err) { // Check if error is an error indicating duplicate account
                    if (err.code === 11000) {
                        res.json({success: false, message: "Username or e-mail already exists"}); // Return error
                    } else { // Check if error is a validation rror
                        if (err.errors) { // Check if validation error is in the email field
                            if (err.errors.email) {
                                res.json({success: false, message: err.errors.email.message}); // Return error
                            } else { // Check if validation error is in the username field
                                if (err.errors.username) {
                                    res.json({success: false, message: err.errors.username.message}); // Return error
                                } else { // Check if validation error is in the password field
                                    if (err.errors.password) {
                                        res.json({success: false, message: err.errors.password.message}); // Return error
                                    } else {
                                        res.json({success: false, message: err}); // Return any other error not already covered
                                    }
                                }
                            }
                        } else {
                            res.json({success: false, message: "Could not save user. Error: ", err}); // Return error if not related to validation
                        }
                    }
                } else { // let user = req.body;
                    let transport = nodemailer.createTransport({
                        host: "free.mboxhosting.com",
                        port: 25,
                        auth: {
                            user: "cyberlink@cyber-api.tk",
                            pass: "Austino@1228"
                        }
                    });

                    const message = {
                        from: ' "Cyber Link" <cyberlink@cyber-api.tk>', // Sender address
                        to: user.email, // recipients
                        subject: "Welcome to CyberLinks", // Subject line
                        html: `
                                      <table class="m_-7837185726430842604main-table" cellpadding="0" cellspacing="0" style="border-radius: 3px; width: 500px; margin: 25px auto;" bgcolor="#ffffff">
                              <tbody>
                                  <tr style="border: 0;">
                                      <td style="border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px; border: 0;" align="center" bgcolor="#96588a">
                                          <a href="https://portal.nocodeacademy.net/"
                                              style="text-decoration: none; font-size: 22px; border: none;color: #ffffff;font-weight: 700;">
                                              Cyber Links
                                          </a>
                                          ‌
                                      </td>
                                  </tr>
                                  <tr style="border: 0;">
                                      <td style="padding: 10px; border: 1px solid #96588a;" bgcolor="#fff">
                                          <div><h3>Welcome  ${
                            user.lastName
                        } ${
                            user.firstName
                        } ❤️❤️❤️</h3></div>
                                          <div>
                                        <p>Your account has been created!, Below are your credentials! Keep Safe</p>
                                              <p>Username:  <strong > ${
                            user.username
                        }</strong></p>
                                              <p>Email: <a href="#" > ${
                            user.email
                        }</a></p>
                                          </div>
                                      </td>
                                  </tr>
                                  <tr style="border: 0;">
                                  <td style="padding: 20px 40px; border: 0;color: #ffffff;font-weight: 500;" align="center" bgcolor="#96588a">
                                  <a>Thanks for joining us</a> <a href="#">Login to your account</a>
                               </td>
                                  </tr>
                              </tbody>
                          </table>
           `
                    };
                    transport.sendMail(message, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("mail has sent.");
                            res.json(info);
                        }
                    });
                    res.json({success: true, message: "User Registration was Successful..."}); // Return success
                }
            });
        }
    });

    /* ============================================================
       Route to check if user's email is available for registration
    ============================================================ */
    router.get("/checkEmail/:email", (req, res) => { // Check if email was provided in paramaters
        if (!req.params.email) {
            res.json({success: false, message: "E-mail was not provided"}); // Return error
        } else { // Search for user's e-mail in database;
            User.findOne({
                email: req.params.email
            }, (err, user) => {
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else { // Check if user's e-mail is taken
                    if (user) {
                        res.json({success: false, message: "E-mail is already taken"}); // Return as taken e-mail
                    } else {
                        res.json({success: true, message: "E-mail is available"}); // Return as available e-mail
                    }
                }
            });
        }
    });

    /* ===============================================================
       Route to check if user's username is available for registration
    =============================================================== */
    router.get("/checkUsername/:username", (req, res) => { // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({success: false, message: "Username was not provided"}); // Return error
        } else { // Look for username in database
            User.findOne({
                username: req.params.username
            }, (err, user) => { // Check if connection error was found
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else { // Check if user's username was found
                    if (user) {
                        res.json({success: false, message: "Username is already taken"}); // Return as taken username
                    } else {
                        res.json({success: true, message: "Username is available"}); // Return as vailable username
                    }
                }
            });
        }
    });

    router.post("/login", (req, res) => {
        if (!req.body.username) {
            res.json({success: false, message: "No username provided"});
        } else if (!req.body.password) {
            res.json({success: false, message: "No password provided"});
        } else {
            User.findOne({
                username: req.body.username
            }, (err, user) => {
                if (err) {
                    res.json({success: false, message: err});
                } else if (!user) {
                    res.json({success: false, message: "Username not Found"});
                } else {
                    const validPassword = user.comparePassword(req.body.password);
                    if (! validPassword) {
                        res.json({success: false, message: "Password is invalid!"});
                    } else {
                        const token = jwt.sign({
                            userId: user._id
                        }, 'Austine', {expiresIn: "1h"});
                        res.json({
                            success: true,
                            message: "Login Successful ✔️",
                            token: token,
                            user: {
                                username: user.username
                            }
                        });
                    }
                }
            });
        }
    });

    /* ================================================
    MIDDLEWARE - Used to grab user's token from headers
    // ================================================ */
    router.use((req, res, next) => {
        const token = req.headers["authorization"];
        // Create token found in headers
        // Check if token was found in headers
        if (! token) {
            res.json({success: false, message: "No token provided"}); // Return error
        } else { // Verify the token is valid
            jwt.verify(token, "Austine", (err, decoded) => { // Check if error is expired or invalid
                if (err) {
                    res.json({
                        success: false,
                        message: "Token invalid:" + err
                    }); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ===============================================================
       Route to get user's profile data
    =============================================================== */
    router.get("/profile", (req, res) => { // Search for user in database
        User.findOne({_id: req.decoded.userId}).select("username email firstName lastName description phone education interest address city country").exec((err, user) => { // Check if error connecting
            if (err) {
                res.json({success: false, message: err}); // Return error
            } else { // Check if user was found in database
                if (!user) {
                    res.json({success: false, message: "User not found"}); // Return error, user was not found in db
                } else {
                    res.json({success: true, user: user}); // Return success, send user object to frontend for profile
                }
            }
        });
    });

    router.get("/publicProfile/:username", (req, res) => {
        if (!req.params.username) {
            res.json({success: false, message: "User not found"});
        } else {
            User.findOne({username: req.params.username}).select("username email").exec((err, user) => {
                if (err) {
                    res.json({success: false, message: "Error Occurred while fetching user"});
                } else if (!user) {
                    res.json({success: false, message: "Username not found"});
                } else {
                    res.json({success: true, user: user});
                }
            });
        }
    });

    router.get("/allUsers", (req, res) => {
        User.find({}, (err, user) => {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            } else {
                if (!user) {
                    res.json({success: false, message: "No Feeds found."}); // Return error of no blogs found
                } else {
                    res.json({success: true, user: user}); // Return success and blogs array
                }
            }
        }).sort({_id: -1}); // Sort blogs from newest to oldest
    });

    // const upload = multer({storage: storage});

    // router.put("/uploadImage", upload.single("file"), (req, res, next) => {
    //     if (!req.file) {
    //         return res.status(500).send({message: "upload failed!"});
    //     }
    //     try {
    //         req.body.imageUrl = "http://localhost:8585/images/" + req.file.filename;
    //         User.save(req.body, (err, user) => {
    //             if (err) {
    //                 console.log(err);
    //                 return next(err);
    //             } else {
    //                 res.json({success: true, message: "Pic Uploaded! Successfully"});
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // });


    router.put('/updateProfile/:id', (req, res) => {
        if (!req.params.id) {
            res.json({success: false, message: "No User Was Found with such ID"});
        } else {
            User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
                if (err) {
                    res.json({success: false, message: "Invalid ID"});
                } else if (!user) {
                    res.json({success: false, message: "No User Found"});
                } else {
                    user.education = req.body.education;
                    user.interest = req.body.interest
                    user.description = req.body.description
                    user.phone = req.body.phone
                    user.address = req.body.address
                    user.city = req.body.city
                    user.country = req.body.country

                    user.save((err) => {

                        res.json({success: true, message: "User Updated saved", user});
                        // res.json(user); // Return success message

                    });
                }

            })
        }
    })

    // router.use(upload.array());

    router.use('/updateProfilePic', express.static('upload'))
    router.post("/updateProfilePic", upload.single('file'), (req, res) => {


        if (!req.file) {
            res.json({success: false, message: "no file was selected!"})
        } else {
            console.log(res)
            res.json({
                    success: true, message: "file is saved", profile_url: `http://localhost:8585/authentication/updateProfilePic/${
                    req.file.filename
                }`
            })
        }

    })


    return router;
};
