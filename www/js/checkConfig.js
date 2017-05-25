
var updates = false;

var config;
var address;

function displayConodes() {

    // Retrieve all keyPairs
    var sql = "select C.address from conodes C";

    dbAction(sql, [], function(res) {

        // Populate conodes list
        var html = 'Conodes<hr>';
        for (var i = 0; i < res.rows.length; ++i) {
            var addr  = res.rows.item(i).address;
            html += '<button class="list" onclick="conodeAction(this.innerHTML);">' + addr + '</button>';
        }

        // Update GUI
        document.getElementById("conodes_list").innerHTML = html;
    });
}

function stateCallback() {
    updates = false;

    document.getElementById("state").style.color = "#008CBA";
    document.getElementById("updates").style.color = "#999999";

    document.getElementById("conodes_list").style.display = 'block';
    document.getElementById("show_config").style.display = 'none';
}

function updatesCallback() {
    updates = true;

    document.getElementById("state").style.color = "#999999";
    document.getElementById("updates").style.color = "#008CBA";

    document.getElementById("conodes_list").style.display = 'block';
    document.getElementById("show_config").style.display = 'none';
}


function conodeAction(addr) {

    // Store address
    address = addr;

    var sql = "select C.serverId from conodes C where C.address = ?";

    dbAction(sql, [address], function(res) {

        //TODO: should be === 1 ...can not register multiple time to same server?
        //if (res.rows.length >= 1) {

            var  id = hex2buf(res.rows.item(0).serverId);

            if(updates) {
                // Create ProposeUpdate
                const pu = CothorityProtobuf.createProposeUpdate(id);

                proposeUpdate(address, pu, function(response) {

                    // Decode message and store config
                    config = CothorityProtobuf.decodeProposeUpdateReply(response).propose;

                    showConfig();
                });
            } else {

                // Create ConfigUpdate
                const cu = CothorityProtobuf.createConfigUpdate(id);

                configUpdate(address, cu, function(response) {

                    // Decode message and store config
                    config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

                    showConfig();
                });
            }
        //}
    })
}

/**
 * Show the 'config' to the screen.
 */
function showConfig() {

    var html = address + '<hr>';

    if (updates && config === null) {
        html += 'No updates to vote.';
    } else {

        //html += '<b>Threshold: </b>' + config.threshold + '</br></br>';

        html += '<b>Devices:</b></br>';
        for (var device in config.device) {
            html += '<i>' + device + '</i> ' + buf2hex(config.device[device].point) + '</br></br>';
        }

        html += '</br>';

        html += '<b>Data:</b></br>';
        for (var key in config.data) {
            html += '<i>' + key + '</i> ' + buf2hex(config.data[key]) + '</br></br>';
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

        // Compute hash
        var hash = cryptoJS.hashConfig(config);

        // Sign and extract challenge/response
        var signature = cryptoJS.schnorrSign(hex2buf(res.rows.item(0).keyPair), hash);
        var challenge = hex2buf(buf2hex(signature).substring(0, 64));
        var response = hex2buf(buf2hex(signature).substring(64));

        // Create ProposeVote
        const pv = CothorityProtobuf.createProposeVote(hex2buf(res.rows.item(0).serverId),
            res.rows.item(0).deviceId, challenge, response);

        proposeVote(address, pv, function (response) {

            // Update GUI
            document.getElementById("show_config").style.display = 'none';
            document.getElementById("success_msg").style.display = 'block';
        });
    });
}