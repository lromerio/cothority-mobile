import React, {PropTypes as T} from 'react'

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 *
 * Increase a count over time and display the time since the given timestamp
 */
export default class LastUpdate extends React.Component {

  static propTypes = {
    timestamp: T.number.isRequired,
    refresh: T.number
  };

  static defaultProps = {
    refresh: 1000
  };

  componentDidMount() {
    const {refresh} = this.props;
    const self = this;
    this.refresh_counter = setInterval(() => self.forceUpdate(), refresh);
  }

  componentWillUnmount() {
    clearInterval(this.refresh_counter);
  }

  render() {
    const {timestamp} = this.props;
    const lastUpdate = Math.floor((Date.now() - timestamp) / 1000); // Timestamp is in ms

    return <span>{`${lastUpdate}s`}</span>;
  }

}