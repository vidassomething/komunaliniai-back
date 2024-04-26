const Sequelize = require('sequelize');
const sequelize = new Sequelize('nukmais', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  // other configuration
});

module.exports = sequelize;
