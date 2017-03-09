import './css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Content from './components/content';

const App = React.createClass({

  render() {
    return (
      <div>
            <Content/>
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
