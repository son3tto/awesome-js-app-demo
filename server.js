// import express
const express = require('express');
// import mongoose
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
// instantiate express
const app = express();
// import user.JS
const users = require("./routes/api/users");
// import database uri
const db = require("./config/key").mongoURI;
//use body-parser middleware
//url encoded - parameters wont show in the url
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// connect to the database
mongoose.connect(db)
        .then(() => console.log("database connected."))
        .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("hello world");
})

// using routes
//parameter 1: secondary directory uri; 
//parameter 2: location
app.use("/api/users", users);


// server port
const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`SERVER running on port ${port}`);
})