const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json()); //req.body



if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "client/build")));
};

console.log(__dirname);
console.log(path.join(__dirname, "client/build"));


app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"))

db.authenticate()
    .then(() => console.log('databse connected...'))
    .catch(err => console.log('Error: ' + err));

    
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT , () => {
    console.log(`Server is starting on port ${PORT}`)
});