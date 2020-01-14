import React, { Component } from 'react';
import Request from '../helpers/request';
import { stat } from 'fs';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flights: []
         }
    }

    componentDidMount() {
        fetch('http://localhost:3000/')
        .then(results => {
            return results.json()
        })
        .then(data => {
            console.log(data[0]);
            this.setState({flights: data})
        })
    }

    render() { 
        return ( 
            <div>
                <div>
                {this.state.flights.map(flight => <p><b>Carrier:</b> {flight.carrier}<br/><b>Departure Airport:</b> {flight.depair}<br/><b>Destination Airport:</b> {flight.destair}</p>)}
                </div>
                <p></p>
            </div>
         );
    }
}
 
export default MainContainer;