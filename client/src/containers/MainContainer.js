import React, { Component } from 'react';
import Request from '../helpers/request';
import { stat } from 'fs';
import moment from 'moment';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flights: [],
            swedishArrivals: 0
        }
        this.findAllSwedishArrivals = this.findAllSwedishArrivals.bind(this);
        this.findAllMorningFlights = this.findAllMorningFlights.bind(this);
        this.calculateAverageDubaiFlightTime = this.calculateAverageDubaiFlightTime.bind(this);
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
        let counter = 0;
        // Loop through our Array of flights from the state
        this.state.flights.forEach(flight => {
            // If the flights Destair is includes the swedish IATA codes then add 1 to counter.
            if (flight.destair.includes("ARN") || flight.destair.includes("GOT")) {
                counter ++;
            }
            
        })
        // Return the number of flights a percentage of all flights in data
        return (counter / this.state.flights.length).toFixed(4);
    }

    // Calculate the 10 most popular destinations
    
    // Calculate the average time between LHR and DXB
    calculateAverageDubaiFlightTime() {
        // Create Counter and DurationTotal
        let counter = 0;
        let durationTotal = 0;
        // Loop through flight data
        this.state.flights.forEach(flight => {
            // If the flights depair = LHR and destair = DXB
            if (flight.depair == "LHR" && flight.destair == "DXB"){
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

    render() { 
        return ( 
            <div>
                <div>
                    <p>There is {this.findAllMorningFlights()} morning flights.</p>
                    <p>Only {this.findAllSwedishArrivals()}% of flights on this data fly into Sweden.</p>
                    <p>{this.calculateAverageDubaiFlightTime()}</p>
                </div>
            </div>
         );
    }
}
 
export default MainContainer;