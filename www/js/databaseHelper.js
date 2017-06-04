/**
 * Group a series of functions to interact with PhoneGap built-in database.
 *
 * @author Lucio Romerio (lucio.romerio@epfl.ch)
 */

/**
 *  Global instance that represent the database itself.
 *
 * @type {Database}
 */
var db = window.openDatabase("cothority_database", "1.0", "cothority_database", 1000000);

/**
 * Given a database error print an error message to the console.
 *
 * @param e
 */
function dbErrorHandler(e) {
        console.log('Database error: ' + e.code + ' ' + e.message);
}

/**
 * Open the database, once the db is ready the handler passed as parameter will be triggered.
 *
 * @param handler
 */
function dbOpen(handler) {
    db.transaction(dbSetup, dbErrorHandler, handler);
}

/**
 * Create tables if they don't exist yet. Ideally, in a given device, they will be created
 * only the very first time the application is launched.
 *
 * @param tx
 */
function dbSetup(tx) {

    var conodes = "create table if not exists conodes(address TEXT PRIMARY KEY, " +
        "serverId TEXT NOT NULL, deviceId TEXT NOT NULL, keyPair TEXT NOT NULL, " +
        "UNIQUE(serverId), UNIQUE(keypair))";

    tx.executeSql(conodes);

    var ssh = "create table if not exists ssh(serverAddr TEXT, sshName TEXT, " +
        "sshKeyPair TEXT NOT NULL, PRIMARY KEY(serverAddr, sshName), " +
        "FOREIGN KEY(serverAddr) REFERENCES conodes(address), UNIQUE(sshKeyPair))";
    tx.executeSql(ssh);
}

/**
 * Perform the sql query contained in 'sql' with 'arg' as parameters.
 * Once the query is completed the given handler is trigger.
 *
 * @param sql
 * @param arg
 * @param handler
 */
function dbAction(sql, arg, handler) {

    db.transaction(function (tx) {
        tx.executeSql(sql, arg, function (tx, result) {
            handler(result);
        }, dbErrorHandler);
    }, dbErrorHandler, function () {});
}