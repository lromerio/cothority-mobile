/**
 * Wrap all functions bounded to 'www/checkConfig.html'.
 *
 * @author Lucio Romerio (lucio.romerio@epfl.ch)
 */

// Indicates whether the current tab is the 'update' one or not.
var updates = false;

// Single conode information
var config;
var address;

/**
 * Display all conodesto which the device is registered.
 * The conodes are displayed as buttons.
 */
function displayConodes() {

    // Retrieve all keyPairs
    var sql = "select C.address from conodes C";

    var html = 'Conodes<hr>';

    dbAction(sql, [], function(res) {

        // Populate conodes list
        for (var i = 0; i < res.rows.length; ++i) {
            var addr  = res.rows.item(i).address;
            html += '<button class="list" onclick="conodeAction(this.innerHTML);">' + addr + '</button>';
        }

        // Update GUI
        document.getElementById("conodes_list").innerHTML = html;
    });
}

/**
 * Display the 'State' tab.
 */
function stateCallback() {
    updates = false;

    document.getElementById("state").style.color = "#008CBA";
    document.getElementById("updates").style.color = "#999999";

    document.getElementById("conodes_list").style.display = 'block';
    document.getElementById("show_config").style.display = 'none';
    document.getElementById("success_msg").style.display = 'none';
}

/**
 * Display the 'Update' tab.
 */
function updatesCallback() {
    updates = true;

    document.getElementById("state").style.color = "#999999";
    document.getElementById("updates").style.color = "#008CBA";

    document.getElementById("conodes_list").style.display = 'block';
    document.getElementById("show_config").style.display = 'none';
    document.getElementById("success_msg").style.display = 'none';
}

/**
 * Depending on the current tab send a ConfigUpdate or ProposeUpdate to
 * the given conode.
 *
 * @param addr
 */
function conodeAction(addr) {

    // Store address
    address = addr;

    var sql = "select C.serverId from conodes C where C.address = ?";

    dbAction(sql, [address], function(res) {

        if (res.rows.length === 1) {

            var  id = hex2buf(res.rows.item(0).serverId);

            if(updates) {
                // Create ProposeUpdate
                const pu = CothorityProtobuf.createProposeUpdate(id);

                proposeUpdate(address, pu, function(e) {

                        document.getElementById("show_config").innerHTML = "<span style = 'color: red;'>ERROR: </span>"
                            + e.data;
                        document.getElementById("conodes_list").style.display = 'none';
                        document.getElementById("show_config").style.display = 'block';

                    }, function(response) {

                        // Decode message and store config
                        config = CothorityProtobuf.decodeProposeUpdateReply(response).propose;

                        showConfig();
                    }
                );
            } else {

                // Create ConfigUpdate
                const cu = CothorityProtobuf.createConfigUpdate(id);

                configUpdate(address, cu, function(e) {

                        document.getElementById("show_config").innerHTML = "<span style = 'color: red;'>ERROR: </span>"
                            + e.data;
                        document.getElementById("conodes_list").style.display = 'none';
                        document.getElementById("show_config").style.display = 'block';

                    }, function(response) {

                        // Decode message and store config
                        config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

                        showConfig();
                    }
                );
            }
        } else {
            alert("Database corrupted: duplicate conode.");
        }
    });
}

/**
 * Display a config file.
 */
function showConfig() {

    var html = address + '<hr>';

    if (updates && config === null) {
        html += 'No updates to vote.';
    } else {

        //html += '<b>Threshold: </b>' + config.threshold + '</br></br>';

        html += '<b>Devices:</b></br>';
        for (var device in config.device) {
            html += '<i>' + device + '</i> ' + buf2hex(config.device[device].point) + '</br>';
        }

        html += '</br>';

        html += '<b>Data:</b></br>';
        for (var key in config.data) {
            html += '<i>' + key + '</i></br>';
        }
    }

    if (updates && config !== null) {
       html += '<button onclick="voteUpdate()">Vote</button>';
    }

    // Update GUI
    document.getElementById("conodes_list").style.display = 'none';
    document.getElementById("show_config").style.display = 'block';
    document.getElementById("show_config").innerHTML = html;
}

/**
 * Create a ProposeVote message and send.
 */
function voteUpdate() {

    var sql = "select * from conodes C where C.address = ?";
    dbAction(sql, [address], function(res) {

        if (res.rows.length === 1) {
            var pv = createProposeVote(config, res.rows.item(0));
            proposeVote(address, pv, function(e) {

                    document.getElementById("success_msg").innerHTML = "<span style = 'color: red;'>ERROR: </span>"
                        + e.data;
                    document.getElementById("show_config").style.display = 'none';
                    document.getElementById("success_msg").style.display = 'block';

                }, function () {
                    // Update GUI
                    document.getElementById("show_config").style.display = 'none';
                    document.getElementById("success_msg").style.display = 'block';
                }
            );
        } else {
            alert("Database corrupted: duplicate conode.");
        }
    });
}