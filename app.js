const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const config = require("./config/db");
const path = require("path");
const authentication = require("./routes/authenticationController")(router);
const feeds = require("./routes/feedController")(router);
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080

// database connection

mongoose.connect("mongodb://localhost:27017/BlogDB", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    console.log("-------------------");
    if (err) {
        console.log("Unable to connect to database:", err);
    } else {
        console.log("Connected to database: " + config.db);
    }
});
// Middleware
app.use(cors({origin: "http://localhost:4200"}));
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.raw());
app.use(bodyParser.json());
// parse application/json
app.use(bodyParser.json({type: "application/vnd.api+json"}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


// app.use(multer().array())

app.use(express.static(__dirname + '/dist'))
app.use("/authentication", authentication);
app.use("/feeds", feeds);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
});


app.listen(port, () => {
    console.log("Application started at port " + port);
});
