const mariadb = require('mariadb');
const {createClient} = require('redis');
const client = createClient({
    socket: {
        host: 'redis'
    }
});

// redis connection errors
client.on('error', async (err) => {
    await client.disconnect()
});
// Connect to redis
client.connect().catch(() => console.log("redis disconnected"))

const DB_HOST = 'localhost'
const DB_USER = 'user'
const DB_PWD = 'pass'
const DB_NAME = 'webdata'

const dbPool = mariadb.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME
});

async function DBConnect() {
    let dbCon = await mariadb.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PWD
    })
    let res = dbCon.isValid();
    await dbCon.end();
    return res;
}

async function redisConnect() {
    if (!client.isReady) {
        await client.connect().catch(() => console.log("Error reconnecting"))
    }
    return client.isReady;
}

function selectData(req, res) {
    dbPool.getConnection().then(async conn => {
        try {
            let query = await conn.query('SELECT * FROM users')
            await conn.end();
            res.status(200).send(query);
        } catch (err){
            console.log("Error SELECT")
        }
    })
}

module.exports = {
    DBConnect,
    redisConnect,
    selectData
}
