import React from 'react'
import Tappable from 'react-tappable';

import './server-status.css';

import StatusService from '../../services/status'

export default class ServersStatus extends React.Component {

  constructor(props) {
      super(props);

      this.service = new StatusService(30000);

      this.state = {
          status: [],
          recap: true,
          data: null
    };
  }

  onStatusUpdate(status) {
    this.setState({
      status: Object.keys(status).map((server) => status[server])
    });
  }

  componentDidMount() {
    this.service.subscribe(this);
  }

  componentWillUnmount() {
    this.service.unsubscribe(this);
  }

  showDetails(data) {
      this.setState({
          data: data,
          recap: false
      });
  }

  hideDetails() {
      this.setState({
          recap: true,
          data: null
      });
  }

  renderServerList(status) {
        return status.map(status => {
            let data;
            if (status.system) {
                data = status.system.Status.field;
            } else {
                data = {
                    className: 'has-error',
                    Host: status.server.address,
                    Description: 'Error'
                };
            }

            return (
                <div className="server-name">
                    <Tappable className={data.className} onTap={() => this.showDetails(data)}>
                        {data.Description}
                    </Tappable>
                </div>
            );
        });
  }

  renderDetails(data) {
      return (
          <div>
              <table>
                  <tr>
                      <th>Name</th>
                      <td>{data.Description}</td>
                  </tr>
                  <tr>
                      <th>IP</th>
                      <td>{data.Host}</td>
                  </tr>
                  <tr>
                      <th>Connection</th>
                      <td>{data.ConnType}</td>
                  </tr>
                  <tr>
                      <th>Port Number</th>
                      <td>{data.Port}</td>
                  </tr>
                  <tr>
                      <th>Uptime</th>
                      <td>{data.Uptime}</td>
                  </tr>
                  <tr>
                      <th>Traffic [Bps]</th>
                      <td>{parseTraffic(data.RX_bytes, data.TX_bytes, data.Uptime)}</td>
                  </tr>
                  <tr>
                      <th>Services</th>
                      <td>{data.Available_Services}</td>
                  </tr>
                  <tr>
                      <th>Version</th>
                      <td>{data.Version}</td>
                  </tr>
              </table>

              <br/>

              <Tappable className="back_button" onTap={() => this.hideDetails()}>
                  Back
              </Tappable>
          </div>
      );
  }

  render() {
      const {status} = this.state;

      const rows = this.renderServerList(status);

      if(this.state.recap) {
          return (
              <div className="servers-status">
                  {rows}
              </div>
          );
      } else {
          return this.renderDetails(this.state.data);
      }
  }
}



/**
 * Source: https://github.com/Gilthoniel/cothority-web
 *
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
 * Source: https://github.com/Gilthoniel/cothority-web
 *
 * Convert ??h??m??s to the total amount of seconds
 * @param uptime
 * @returns {number}
 */
function parseUptime(uptime) {
    let seconds = 0;
    uptime.split(/[hm.]/).reverse().slice(1).forEach((t, i) => seconds += Number(t) * TO_SECONDS_ADAPTER[i]);

    return seconds;
}