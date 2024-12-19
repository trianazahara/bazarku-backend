// models/Bazar.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bazar = sequelize.define('Bazar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  location: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('draft', 'open', 'ongoing', 'completed'),
    defaultValue: 'draft'
  },
  organizerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = Bazar;