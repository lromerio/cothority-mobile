import React from 'react';

export default class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };
    }

    show() {
        this.state.visible = true;
        document.addEventListener("click", this.hide.bind(this));
    }

    hide() {
        document.removeEventListener("click", this.hide.bind(this));
        this.state.visible = false;
    }

    render() {
        return (
            <div className="menu">
                <div className={(this.state.visible ? "visible" : "")}>
                    <div className="menu-item" onClick= {() => this.props.updatePage(0)} >
                        Status
                    </div>
                    <div className="menu-item" onClick= {() => this.props.updatePage(0)} >
                        Second Page
                    </div>
                </div>
            </div>
        )
    }
}