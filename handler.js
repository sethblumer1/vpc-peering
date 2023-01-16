'use strict';
// For .env variables
require('dotenv').config();
const mongo = require('mongodb');
const { MongoClient } = mongo;
let db = null;

let connectToDatabase = async (uri, dbName) => {
  if (db && db.serverConfig.isConnected()) {
    return Promise.resolve(db);
  }
  return MongoClient.connect(uri, {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client) => {
    db = client.db(dbName);
    return db;
  });
};

let getReminders = async (db, table) => {
  const reminderTable = db.collection(table).find().toArray();
  return reminderTable;
};

module.exports.getData = async (event) => {
  const dbConnection = await connectToDatabase(process.env.MONGO_URI, 'test');
  const todo = await getReminders(dbConnection, 'reminders');

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  };
};
