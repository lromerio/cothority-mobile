var db;
var ready;

function dbOpen() {
    db = window.openDatabase("cothority_database", "1.0", "cothority_database", 1000000);
    db.transaction(dbSetup, dbErrorHandler, function() {ready = true});
}

function dbSetup(tx) {
    // Setup: create new database if doesn't exist one yet
    tx.executeSql('CREATE table if not exist key(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'keyPair TEXT, created DATE)');
}

function dbInsert(keyPair) {
    if (ready) {
        db.transaction(
            function (tx) {
                tx.executeSql("insert into key(keyPair, created) values(?,?)", [keyPair, new Date()]);
            }, dbErrorHandler, dbShowMessage("Row added.")
        );
    } else {
      dbShowMessage("Database not ready yet");
    }
}

function dbRetrieveAll() {
    db.transaction(function (tx) {
        tx.executeSql("select * from key ordered by desc", [], displayLog, dbErrorHandler);
    }, dbErrorHandler, function() {});
}

function dbClean() {
    if (ready) {
        db.transaction(
            function (tx) {
                tx.executeSql("delete from key");
            }, dbErrorHandler, dbShowMessage("Database deleted.")
        );
    } else {
        dbShowMessage("Database not ready yet");
    }
}

function dbBuildLog(tx, result) {
    if (result.rows.length === 0) {
        dbShowMessage("No data.");
        return false;
    }

    var s = "";
    for (var i = 0; i < result.rows.length; ++i) {
        var d = new Date();
        d.setTime(result.rows.item(i).created);
        s += d.toDateString() + " " + d.toTimeString() + "<br/>";
    }
    dbShowMessage(s);
}

function dbErrorHandler(e) {
    alert(e.message);
}

function dbShowMessage(msg) {
    document.getElementById("db_result").innerHTML = '<span style = "color: green;">msg</span>';
}