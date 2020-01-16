import React, { Component } from 'react';
import moment from 'moment';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flights: []
        }
        this.findAllSwedishArrivals = this.findAllSwedishArrivals.bind(this);
        this.findAllMorningFlights = this.findAllMorningFlights.bind(this);
        this.calculateAverageDubaiFlightTime = this.calculateAverageDubaiFlightTime.bind(this);
        this.calculateMostPopularDestinations = this.calculateMostPopularDestinations.bind(this);
        this.findMostExpensiveFlight = this.findMostExpensiveFlight.bind(this);
        this.findCheapestFlight = this.findCheapestFlight.bind(this);
    }

    componentDidMount() {
        // Fetch the data from the API hosted in our server side folder
        fetch('http://localhost:3000/')
        .then(results => {
            return results.json()
        })
        // Update the state so all of our flight data is updated in the app
        .then(data => {
            this.setState({flights: data})
        })
    }

    // Calculate how many flights are in the morning
    findAllMorningFlights() {
       let counter = 0;
       // Loop through the array of flights
       this.state.flights.forEach(flight => {
           // If the flights indeparttime is before 12:00:00AM then add to counter
           if (flight.indeparttime < "12:00:00"){
               counter ++;
           }
       })
       return counter;
    }

    // Calculate how many flights arrive in airports with swedish IATA codes (Seems to only be ARN and GOT)
    findAllSwedishArrivals() {
        // Create an array of biggest airports in sweden.
        const swedishAirports = ["ARN", "GOT", "BMA", "NYO", "MMX", "LLA", "UME", "GSE", "OSD", "VBY", "AGH", "KRN", "SDL", "RNB", "SFT", "KLR", "VXO", "VST", "NRK"]
        let counter = 0;
        // Loop through our Array of flights from the state
        this.state.flights.forEach(flight => {
            // Loop through the airport array
            for (let i = 0; i < swedishAirports.length; i++) {
                // If the flights Destair is includes the swedish IATA codes then add 1 to counter.
                if (flight.destair.includes(swedishAirports[i])) {
                    counter ++;
                }
            }
        })
        // Return the number of flights a percentage of all flights in data
        return (counter / this.state.flights.length).toFixed(4);
    }

    // Calculate the 10 most popular destinations
    calculateMostPopularDestinations() {
        // Map all destination airport codes to a new array.
        const destinations = this.state.flights.map((flight) => {
            return flight.destair;
        })
        // Create an empty object to track IATA codes with occurences.
        const occurences = {};
        // Fill the object with key value pairs
        for (let i = 0; i < destinations.length; i++) {
            occurences[destinations[i]] = (occurences[destinations[i]] || 0 ) +1;  
        }
        // Create an empty array that we can use to sort the travel occurences
        let sortedOccurences = [];
        // Loop through the occurences object and map each destination and visit number to an array within the new Array we have created.
        for (const visit in occurences) {
            sortedOccurences.push([visit, occurences[visit]]);
        }
        // Sort this array in descending order to give us the most visited.
        sortedOccurences.sort((a, b) => {
            return b[1] - a[1];
        });
        // Only return the 10 most visited.
        let topTen = sortedOccurences.slice(0, 9);
        return (
            <ul>
                {topTen.map((dest, index) => <li key={index}>{dest[0]} with {dest[1]} visits</li>)}
            </ul>
        );
    }
    
    // Calculate the average time between LHR and DXB
    calculateAverageDubaiFlightTime() {
        // Create Counter and DurationTotal
        let counter = 0;
        let durationTotal = 0;
        // Loop through flight data
        this.state.flights.forEach(flight => {
            // If the flights depair = LHR and destair = DXB
            if (flight.depair === "LHR" && flight.destair === "DXB"){
                // Add 2 to counter for return flight
                counter += 2;
                // Subtract the flights arrival time from the departure Time and add to the DurationTotal for Inbound flights.
                const inboundDepartureTime = flight.indepartdate + ' ' + flight.indeparttime;
                const inboundArrivalTime = flight.inarrivaldate + ' ' + flight.inarrivaltime;
                const inboundDiff = moment.duration(moment(inboundArrivalTime).diff(moment(inboundDepartureTime)));
                // Add 4 hours on for time difference
                const inboundMinutes = parseInt(inboundDiff.asMinutes()) + 240;
                durationTotal += inboundMinutes;
                // Subtract the flights arrival time from the departure time and add to DurationTotal for outbound flights.
                const outboundDepartureTime = flight.outdepartdate + ' ' + flight.outdeparttime;
                const outboundArrivalTime = flight.outarrivaldate + ' ' + flight.outarrivaltime;
                const outboundDiff = moment.duration(moment(outboundArrivalTime).diff(moment(outboundDepartureTime)));
                // Subtract 4 hours for the time difference
                const outboundMinutes = parseInt(outboundDiff.asMinutes()) - 240;
                durationTotal += outboundMinutes;
            }
        })
        // Calculate the average by adding all the flight times and dividing by the counter
        // Rounded the average to a whole number to make displaying it tidy.
        const averageFlightTime = (durationTotal / counter).toFixed(0);
        const averageHours = Math.floor(averageFlightTime / 60);
        const averageMinutes = averageFlightTime % 60;
        // Return a simple string to display the findings
        return `The average flight time between LHR and DXB is ${averageHours} hours and ${averageMinutes} minutes.`
    }

    // What is the most expensive flight of the data? How about the cheapest?
    findMostExpensiveFlight() {
        const prices = this.state.flights.map(flight => {
            return parseFloat(flight.originalprice);
        })
        const descendingPrices = prices.sort((a,b) => {
            return b - a;
        });
        return descendingPrices[0];
    }

    findCheapestFlight() {
        const prices = this.state.flights.map(flight => {
            return parseFloat(flight.originalprice);
        })
        const ascendingPrices = prices.sort((a,b) => {
            return a - b;
        });
        return ascendingPrices[0];
    }

    render() { 
        return ( 
            <div>
                <div>
                    <p>There is {this.findAllMorningFlights()} morning flights.</p>
                    <p>Only {this.findAllSwedishArrivals()}% of flights in this data fly into Sweden.</p>
                    <h4>The top 10 destinations are: </h4>
                    {this.calculateMostPopularDestinations()}
                    <p>{this.calculateAverageDubaiFlightTime()}</p>
                    <p>The most expesive flight was £{this.findMostExpensiveFlight()} whereas the cheapest was only £{this.findCheapestFlight()}</p>
                </div>
            </div>
         );
    }
}
 
export default MainContainer;