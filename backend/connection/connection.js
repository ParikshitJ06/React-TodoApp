const mongoose = require("mongoose")

async function connect()
{
    return await mongoose.connect(process.env.db_url);
}

module.exports = connect;