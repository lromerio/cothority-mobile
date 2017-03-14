import React from 'react'
import Tappable from 'react-tappable'

import './content.css'

import ServersStatus from './servers-status/servers-status';
import PopOrganizer from './pop/pop-organizer'
import PopAttendee from './pop/pop-attendee'


export default class Content extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentPage:  0
        }
    }

    updatePage(index) {
        this.setState({currentPage: index})
    }

    //TODO: substitute <br/> with css?!?
    renderMenu(){
        return (
            <div className="menu">
                <br/>
                <Tappable className="menu-item" onTap={() => this.updatePage(1)} >
                    Status
                </Tappable>
                <br/>
                <br/>
                <Tappable className="menu-item" onTap={() => this.updatePage(2)} >
                    PoP Organizer
                </Tappable>
                <br/>
                <br/>
                <Tappable className="menu-item" onTap={() => this.updatePage(3)} >
                    PoP Attendee
                </Tappable>
            </div>
        )
    }

    render() {

        let content = null;
        switch (this.state.currentPage) {
            case 0:
                content = this.renderMenu();
                break;
            case 1:
                content = <ServersStatus/>;
                break;
            case 2:
                content = <PopOrganizer/>;
                break;
            case 3:
                content = <PopAttendee/>;
                break;
            default:
                content = this.renderMenu();
                break;
        }

        return (
            <div>
                <br/>
                <Tappable className="menu_button" onTap= {() =>this.updatePage(0)}>
                    HOME
                </Tappable>
                <hr/>

                {content}
            </div>
        )
    }
}