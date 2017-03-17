import React from 'react';
import Tappable from 'react-tappable'

import CothorityWS from './websocket'

import './pop-organizer.css'

export default class PopOrganizer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            phase:  0,
            address: '',
            pin: '',
            name: '',
            location:'',
            date: '',
            description: '',
            organizers: ''
        }
    }

    updatePhase(index) {
        this.setState({phase: index})
    }

    //TODO: send message to the given address (verify this is right) ... need to create a WebSocket?
    contactConode(event) {
        event.preventDefault();
        // Move to next phase


        this.updatePhase(1);
    }

    //TODO: send PIN message with public key and PIN to the conode
    completePairing(event) {
        event.preventDefault();
        // Move to next phase
        this.updatePhase(2);
    }

    //TODO: send StoreConfig message to the server
    storeConfig(event) {
        event.preventDefault();
        // Move to next phase
        this.updatePhase(3);
    }

    //TODO: generate key pair and save it.
    generateKeyPair() {

    }

    //TODO: start clicable only after inserting address + check address?!?
    renderStartPairing() {
        return (
            <div>
                <h2>Setup Pop Party 1/3</h2>
                <p>
                    Insert the address of a conode and press "Start" in order to
                    begin setting up a PoP party.
                </p>
                <form onSubmit={this.contactConode}>
                    <label>
                        Conode Address:
                        <br/>
                        <input type="text" value={this.state.address}
                               onChange={this.setState({address: event.target.value})}/>
                    </label>
                    <input className="start_button" type="submit" value="Start" />
                </form>
            </div>
        )
    }

    //TODO: input only digits, done clicable only after generating keys and inserting PIN
    renderCompletePairing() {
        return (
            <div>
                <h2>Setup Pop Party 2/3</h2>
                <p>
                    Generate a pair of keys (public/private) and insert the PIN generated by the conode
                    in order to accomplish the pairing phase.
                </p>
                <form onSubmit={this.completePairing}>
                    <label>
                        PIN:
                        <input type="text" value={this.state.pin}
                               onChange={this.setState({pin: event.target.value})}/>
                    </label>
                    <Tappable className="keys_button" onTap={() => this.generateKeyPair()}>
                        Generate Keys
                    </Tappable>
                    <input className="done_button" type="submit" value="Done" />
                </form>
            </div>
        )
    }

    //TODO: check input, done clicable only if required information have been provided
    renderStoreConfig() {
        return (
            <div>
                <h2>Setup Pop Party 3/3</h2>
                <p>
                    Insert details about the PoP party.
                </p>

                <form onSubmit={this.storeConfig}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name}
                               onChange={this.setState({name: event.target.value})}/>
                    </label>
                    <label>
                        Location:
                        <input type="text" value={this.state.location}
                               onChange={this.setState({location: event.target.value})}/>
                    </label>
                    <label>
                        Date:
                        <input type="text" value={this.state.date}
                               onChange={this.setState({date: event.target.value})}/>
                    </label>
                    <label>
                        Description:
                        <input type="text" value={this.state.description}
                               onChange={this.setState({description: event.target.value})}/>
                    </label>
                    <label>
                        Other organizers:
                        <input type="text" value={this.state.organizers}
                               onChange={this.setState({organizers: event.target.value})}/>
                    </label>
                    <input className="done_button" type="submit" value="Done" />
                </form>
            </div>
        )
    }

    //TODO: show recap of PoP party details
    renderSetupComplete() {
        return (
            <h2>Setup Completed!</h2>
        )
    }

    render() {
        let content = null;
        switch(this.state.phase) {
            case 0:
                content = this.renderStartPairing();
                break;
            case 1:
                content = this.renderCompletePairing();
                break;
            case 2:
                content = this.renderStoreConfig();
                break;
            case 3:
                content = this.renderSetupComplete();
                break;
            default:
                content = this.renderStartPairing();
                break;
        }

        return content;
    }
}