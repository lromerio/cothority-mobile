import React from 'react'
import {Table} from 'reactstrap'

import './servers-status.css'
import LastUpdate from './last-update'
import StatusService from '../../services/status'


/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
export default class ServersStatus extends React.Component {

  constructor(props) {
    super(props);

    this.service = new StatusService(30000);

    this.state = {
      status: [],
      isLoading: true
    };
  }

  onStatusUpdate(status) {
    this.setState({
      isLoading: false,
      status: Object.keys(status).map((server) => status[server])
    });
  }

  componentDidMount() {
    this.service.subscribe(this);
  }

  componentWillUnmount() {
    this.service.unsubscribe(this);
  }

  render() {
    const {status, isLoading} = this.state;

    const rows = generateRows(status);
    const loading = isLoading ? generateLoading() : null;

    return (
      <div className="servers-status">
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Update</th>
              <th>IP</th>
              <th>Connection Type</th>
              <th>Port Number</th>
              <th>Uptime</th>
              <th>Traffic [Bps]</th>
              <th>Services</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>

        {loading}

      </div>
    );
  }
}

function generateLoading() {
  return (
    <div className="servers-status-loading">
      <LoadingSpinner/>
    </div>
  );
}

/**
 * Generate a table row from a list of status responses
 * @param status
 */
function generateRows(status) {
  return status.map(status => {
    let data;
    if (status.system) {
      data = status.system.Status.field;
    } else {
      data = {
        className: 'has-error',
        Host: status.server.address
      };
    }

    return (
      <tr key={status.server.address} className={data.className}>
        <td>{data.Description}</td>
        <td><LastUpdate timestamp={status.timestamp}/></td>
        <td>{data.Host}</td>
        <td>{data.ConnType}</td>
        <td>{data.Port}</td>
        <td>{data.Uptime}</td>
        <td>{parseTraffic(data.RX_bytes, data.TX_bytes, data.Uptime)}</td>
        <td>{data.Available_Services}</td>
        <td>{data.Version}</td>
      </tr>
    );
  });
}

/**
 * Compute the total traffic since the server started
 * @param rx_bytes
 * @param tx_bytes
 * @param uptime
 * @returns {number}
 */
function parseTraffic(rx_bytes, tx_bytes, uptime) {
  if (!rx_bytes || !tx_bytes || !uptime) {
    return 0;
  }

  let traffic = Number(rx_bytes) + Number(tx_bytes);
  traffic = Number(traffic / parseUptime(uptime)).toFixed(2);
  return traffic;
}

const TO_SECONDS_ADAPTER = [1, 60, 60*60];

/**
 * Convert ??h??m??s to the total amount of seconds
 * @param uptime
 * @returns {number}
 */
function parseUptime(uptime) {
  let seconds = 0;
  uptime.split(/[hm.]/).reverse().slice(1).forEach((t, i) => seconds += Number(t) * TO_SECONDS_ADAPTER[i]);

  return seconds;
}