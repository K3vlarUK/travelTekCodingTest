const express = require('express');
const app = express();

const cors = require("cors");
app.use(cors());

// const flights = require('./db/seeds').flightData;

const fs = require("fs");
const parser = require("xml2json");

const options = {
    object: true
}

let flightData = [];

fs.readFile('./flighdata_A.xml', function (err, data) {
    const json = parser.toJson(data, options);
    flightData = json.flights.flight;
});

app.get('/', function(req, res) {
    res.send(flightData)
});

app.listen(3000, function () {
    console.log('App running on port 3000');
});