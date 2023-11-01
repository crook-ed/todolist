const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');

app.use(cors());
app.use(express.json()); //req.body



app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"))

db.authenticate()
    .then(() => console.log('databse connected...'))
    .catch(err => console.log('Error: ' + err));



app.listen(5000 , () => {
    console.log("Server is starting on port 5000")
});