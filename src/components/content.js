import React from 'react';
import Tappable from 'react-tappable';

import './content.css';

import ServersStatus from './servers-status/servers-status';

export default class Content extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentPage:  1
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
                <hr/>
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
                <Tappable className="menu_button" onTap= {() =>this.updatePage(0)}>
                    MENU
                </Tappable>
                <hr/>

                {content}
            </div>
        );
    }
}