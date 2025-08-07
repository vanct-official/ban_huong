const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Province = sequelize.define('Province', {
  code: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  name: DataTypes.STRING,
  name_en: DataTypes.STRING,
  full_name: DataTypes.STRING,
  full_name_en: DataTypes.STRING,
  code_name: DataTypes.STRING,
  administrative_unit_id: DataTypes.INTEGER,
}, {
  tableName: 'provinces',
  timestamps: false,
});

module.exports = Province;
