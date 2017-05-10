
var config;
var conodeEntry;

function displayConodes() {

    // Retrieve all keyPairs
    var sql = "select C.address from conodes C";

    dbAction(sql, [], function(res) {

        // Populate conodes list
        var html = 'Conodes<hr>';
        for (var i = 0; i < res.rows.length; ++i) {
            var addr  = res.rows.item(i).address;
            html += '<button class="list" onclick="sshGetConfig(this.innerHTML);">' + addr + '</button>';
        }

        // Update GUI
        document.getElementById("ssh_conodes_list").innerHTML = html;
    });
}

function sshGetConfig(addr) {

    var sql = "select * from conodes C where C.address = ?";

    dbAction(sql, [addr], function(res) {

        // TODO: check number of item? should be 1...
        conodeEntry = res.rows.item(0)

        var id = hex2buf(conodeEntry.serverId);

        // Create ConfigUpdate
        const cu = CothorityProtobuf.createConfigUpdate(id);

        configUpdate(addr, cu, function (response) {

            // Decode message
            config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

            document.getElementById("ssh_conodes_list").style.display = 'none';
            document.getElementById("ssh_propose").style.display = 'block';
        });
    });
}

function sshPropose() {

    // Get key name
    var sshName = document.getElementById("sshName").value;

    if (sshName === '') {
        alert('Id field cannot be empty!');
        handler('');
    } else if (sshName in config.device) {
        alert('Key name not available');
        handler('');
    } else {

        // Generate keys pair
        var keyPair = cryptoJS.keyPair();
        var hexKeyPair = buf2hex(keyPair);

        // Add new entry to database
        var sql = "insert into ssh(serverAddr, sshName, sshKeyPair) values(?,?,?)";

        alert(hex2buf(conodeEntry.serverId));

        dbAction(sql, [conodeEntry.address, sshName, hexKeyPair], function(res) {

            // Add new ssh key to config and create ProposeSend
            //TODO test this
            config.data[sshName] = hexKeyPair;
            const ps = CothorityProtobuf.createProposeSend(hex2buf(conodeEntry.serverId), config);

            proposeSend(conodeEntry.address, ps, function () {

                // Update GUI
                document.getElementById("threshold").innerHTML = 'Threshold: ' + config.threshold;
                document.getElementById("ssh_propose").style.display = 'none';
                document.getElementById("ssh_verify").style.display = 'block';
            });
        });
    }
}