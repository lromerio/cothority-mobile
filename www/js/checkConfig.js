
var updates = false;

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

    var sql = "select C.serverId from conodes C where C.address = ?";

    dbAction(sql, [addr], function(res) {

        //TODO: should be === 1 ...can not register multiple time to same server
        //if (res.rows.length >= 1) {

            var  id = hex2buf(res.rows.item(0).serverId);

            if(updates) {
                // Create ProposeUpdate
                const pu = CothorityProtobuf.createProposeUpdate(id);

                proposeUpdate(addr, pu, function(response) {

                    // Decode message
                    var config = CothorityProtobuf.decodeProposeUpdateReply(response).propose;

                    showConfig(addr, config);
                });
            } else {

                // Create ConfigUpdate
                const cu = CothorityProtobuf.createConfigUpdate(id);

                configUpdate(addr, cu, function(response) {

                    // Decode message
                    var config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

                    showConfig(addr, config);
                });
            }
        //}
    })
}

function showConfig(addr, config) {

    var html = addr + '<hr>';

    if (updates && config === undefined) {
        html += 'No updates to vote.';
    } else {

        //html += '<b>Threshold: </b>' + config.threshold + '</br></br>';

        html += '<b>Devices:</b></br>';
        for (var key in config.device) {
            html += '<i>' + key + '</i> ' + buf2hex(config.device[key].point) + '</br></br>';
        }

        html += '</br>';

        html += '<b>Data:</b></br>';
        for (var key in config.data) {
            html += '<i>' + key + '</i> ' + buf2hex(config.data[key]) + '</br></br>';
        }
    }

    if (updates) {
       //TODO: add vote button
    }

    // Update GUI
    document.getElementById("conodes_list").style.display = 'none';
    document.getElementById("show_config").style.display = 'block';
    document.getElementById("show_config").innerHTML = html;
}