"use strict";

var db = window.openDatabase("cothority_database", "2.0", "cothority_database", 1000000);

var dbCallbacks = {

    dbErrorHandler: function (e) {
        console.log('Database error: ' + e);
    }
};

/**
 * Open the database, once the db is ready the handler passed as parameter will be triggered.
 *
 * @param handler
 */
function dbOpen(handler) {
    db.transaction(dbSetup, dbCallbacks.dbErrorHandler, handler);
}

/**
 * Create tables if they don't exist yet. Ideally, in a given device, they will be created
 * only the very first time the application is launched.
 *
 * @param tx
 */
function dbSetup(tx) {

    // tx.executeSql('drop table if exists key');
    // tx.executeSql('drop table if exists server');

    var sql = "create table if not exists conodes(id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT, serverId TEXT, deviceId TEXT, keyPair TEXT)";
    tx.executeSql(sql);
}

/**
 * Perform the sql query contained in 'sql' with 'arg' as parameters.
 * Once the query is completed trigger the given handler
 *
 * @param sql
 * @param arg
 * @param handler
 */
function dbAction(sql, arg, handler) {

    db.transaction(function (tx) {
        tx.executeSql(sql, arg, function (tx, result) {
            handler(result);
        }, dbCallbacks.dbErrorHandler);
    }, dbCallbacks.dbErrorHandler, function () {});
}