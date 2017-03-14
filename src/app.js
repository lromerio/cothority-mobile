import React from 'react';
import Tappable from 'react-tappable';

import './app.css';

import ServersStatus from './components/servers-status/servers-status';

export default class App extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentPage:  0
        };
    }

    updatePage(index) {
        this.setState({currentPage: index});
    }

    renderMenu(){
        return (
            <div className="menu">
                <Tappable className="menu-item" onTap={() => this.updatePage(1)} >
                    Status
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
        );
    }
}