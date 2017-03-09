import React from 'react';
import Tappable from 'react-tappable';


import ServersStatus from './servers-status/servers-status';

export default class Content extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentPage:  1,
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
                <Tappable className="menu-item" onTap={() => this.updatePage(1)} >
                    Second Page
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
                <Tappable id="open_menu" onTap= {() =>this.updatePage(0)}>
                    <img src="src/img/menu.png" alt="MENU"/>
                </Tappable>
                <hr/>

                {content}
            </div>
        );
    }
}