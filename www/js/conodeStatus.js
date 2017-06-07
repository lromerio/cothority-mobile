/**
 * Wrap all functions specific to 'www/checkConfig.html'.
 *
 * @author Lucio Romerio (lucio.romerio@epfl.ch)
 */

/**
 * Display - as buttons - all conodes to which the device is registered.
 */
function displayConodes() {

    // Retrieve all keyPairs
    var sql = "select C.address from conodes C";

    var html = 'Conodes<hr>';

    dbAction(sql, [], function(res) {

        // Populate conodes list
        for (var i = 0; i < res.rows.length; ++i) {
            var addr  = res.rows.item(i).address;
            html += '<button class="list" onclick="conodeStatus(this.innerHTML);">' + addr + '</button>';
        }

        // Update GUI
        document.getElementById("conodes_list").innerHTML = html;
    });
}

/**
 * Send a StatusRequest to a conode and handle the response
 *
 * @param address
 */
function conodeStatus(address) {

    getStatus(address, function (response) {

        // Get status from response and update GUI
        var data = CothorityProtobuf.decodeStatusResponse(response).system.Status.field;

        console.log(JSON.stringify(data, null, 4));

        document.getElementById("show_status").innerHTML = showStatus(data);
        document.getElementById("conodes_list").style.display = 'none';
        document.getElementById("show_status").style.display = 'block';
    });

}

/**
 * Parse Server Status to an html table
 *
 * @param data
 * @returns {string}
 */
function showStatus(data) {

    var html = "<table><tbody>" +
            "<tr><th>Name</th><td>"+ data.Description + "</td></tr>" +
            "<tr><th>IP</th><td>"+ data.Host +"</td></tr>" +
            "<tr><th>Connection</th><td>" + data.ConnType + "</td></tr>" +
            "<tr><th>Port Number</th><td>" + data.Port + "</td></tr>" +
            "<tr><th>Uptime</th><td>" + data.Uptime.split('m')[0] + "</td></tr>" +
            "<tr><th>Traffic [Bps]</th><td>" + parseTraffic(data.RX_bytes, data.TX_bytes, data.Uptime) + "</td></tr>" +
            "<tr><th>Services</th><td>" + data.Available_Services + "</td></tr>" +
            "<tr><th>Version</th><td>" + data.Version + "</td></tr>" +
        "</tbody></table>";

    return html;
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

    var traffic = Number(rx_bytes) + Number(tx_bytes);
    traffic = Number(traffic / parseUptime(uptime)).toFixed(2);
    return traffic;
}

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 *
 * Convert ??h??m??s to the total amount of seconds
 * @param uptime
 * @returns {number}
 */
function parseUptime(uptime) {

    const TO_SECONDS_ADAPTER = [1, 60, 60*60];

    var seconds = 0;
    uptime.split(/[hm.]/).reverse().slice(1).forEach(function(t, i) {seconds += Number(t) * TO_SECONDS_ADAPTER[i]});

    return seconds;
}