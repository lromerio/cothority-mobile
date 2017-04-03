"use strict";

var db = window.openDatabase("cothority_database", "1.0", "cothority_database", 1000000);

var ready;

function dbOpen() {
    db.transaction(dbSetup, dbErrorHandler, function() {ready = true;});
}

function dbSetup(tx) {
    // Setup: create new database if doesn't exist one yet
    var sql = "create table if not exists key(id INTEGER PRIMARY KEY AUTOINCREMENT, keyPair TEXT, created DATE)";
    tx.executeSql(sql);
}

function dbInsert(keyPair) {
    if (ready) {
        db.transaction(
            function (tx) {
                var sql = "insert into key(keyPair, created) values(?,?)";
                var d = Date.now();
                tx.executeSql(sql, [keyPair, d]);
            }, dbErrorHandler, dbShowMessage("Row added.")
        );
    } else {
        dbShowMessage("Database not ready yet");
    }
}

function dbRetrieveAll() {
    db.transaction(function (tx) {
        var sql = "select * from key";
        tx.executeSql(sql, [], dbBuildLog, dbErrorHandler);
    }, dbErrorHandler, function() {});
}

function dbClean() {
    if (ready) {
        db.transaction(
            function (tx) {
                var sql = "delete from key";
                tx.executeSql(sql);
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

function dbShowMessage(m) {
    document.getElementById("db_result").innerHTML = '<span style = "color: green;">' + m + '</span>';
}