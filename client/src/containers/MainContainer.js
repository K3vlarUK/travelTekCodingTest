import React, { Component } from 'react';
import Request from '../helpers/request';
import { stat } from 'fs';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flights: [],
            swedishArrivals: 0
        }
        this.findAllSwedishArrivals = this.findAllSwedishArrivals.bind(this);
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

    render() { 
        return ( 
            <div>
                <div>
                    <p>Only {this.findAllSwedishArrivals()}% of flights on this data fly into Sweden.</p>
                </div>
            </div>
         );
    }
}
 
export default MainContainer;