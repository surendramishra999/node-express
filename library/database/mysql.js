const mysql = require('promise-mysql');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'Local@Magento123',
  database: 'node_app',
};

const connection = () => mysql.createConnection(config);

module.exports = connection;
