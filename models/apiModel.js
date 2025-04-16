
const mysql = require("../config/mysql");
const jwt = require('jsonwebtoken');
const {createHash} = require("crypto");


async function isAuthenticated( username, password) {
    var salt=process.env.SALT
    const passhash = createHash("sha3-256")
         .update(password+salt)
         .digest("hex")

    const connection = await mysql.connection();
    
    try {
        let items = await connection.query({
            sql: "SELECT user_id " +
                "FROM users " +
                "WHERE username = ? AND password = ? AND is_active = 1 " +
                "LIMIT 1",
            values: [username, passhash]
        });
        return items.length > 0 ? items[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function insertLogRefreshToken( userId, refreshToken) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "INSERT INTO apps_refresh_tokens SET ? ON DUPLICATE KEY UPDATE refresh_token = ?, is_revoked = 0 , created = NOW(), modified = NOW() ",
            values: [{
                user_id: userId,
                refresh_token:refreshToken,
            },refreshToken]
        });
        return items.affectedRows > 0
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function insert(tableName, data) {
    const connection = await mysql.connection();

    try {
        let items = await connection.query({
            sql: "INSERT INTO ?? SET ?",
            values: [tableName, data]
        });
        return items.affectedRows > 0
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function createPassHash(password){
    var salt=process.env.SALT
    const passhash = createHash("sha3-256")
        .update(password+salt)
        .digest("hex")

    return passhash;
}



async function getChecklistUser(userId) {
    const connection = await mysql.connection();
  

    try {
        let items = await connection.query({
            sql: "Select checklist_id,name " +
                "From checklist " +
                "where user_id = ? ",
            values: [userId]
        });
        return items.length > 0 ? items : [];
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function deleteChecklistByChecklistId(checklistId) {
    const connection = await mysql.connection();

    try {
        const result = await connection.query({
            sql: "DELETE FROM checklist WHERE checklist_id = ?",
            values: [checklistId]
        });
        return result.affectedRows > 0;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function getChecklistItemByChecklistIdAndChecklistItemId(checkListId,checklistItemId) {
    const connection = await mysql.connection();
    

    try {
        let items = await connection.query({
            sql: "Select checklist_item_id,item_name ,is_done" +
                "From checklist_item " +
                "where checklist_id = ? ",
            values: [checkListId]
        });
        return items.length > 0 ? items : [];
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}


async function getChecklistItemByChecklistId(checkListId) {
    const connection = await mysql.connection();
    

    try {
        let items = await connection.query({
            sql: "Select checklist_item_id,item_name ,is_done" +
                "From checklist_item " +
                "where checklist_id = ? and checklist_item_id ",
            values: [checkListId]
        });
        return items.length > 0 ? items : [];
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function deleteChecklistItemByChecklistIdAndChecklistItemId(checklistId,checklistItemId) {
    const connection = await mysql.connection();

    try {
        const result = await connection.query({
            sql: "DELETE FROM checklist_item WHERE checklist_id = AND checklist_item_id = ?",
            values: [checklistId,checklistItemId]
        });
        return result.affectedRows > 0;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function update(tableName, data,whereData) {
    const connection = await mysql.connection();
    

    try {
        let items = await connection.query({
            sql: "UPDATE ?? SET ? WHERE ?",
            values: [tableName, data,whereData]
        });
        return items.affectedRows > 0
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}
module.exports = {isAuthenticated,insertLogRefreshToken,insert,createPassHash,getChecklistUser,deleteChecklistByChecklistId,getChecklistItemByChecklistId,deleteChecklistItemByChecklistIdAndChecklistItemId,update,getChecklistItemByChecklistIdAndChecklistItemId}