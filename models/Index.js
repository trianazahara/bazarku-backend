// models/index.js
const User = require('./User');
const Bazar = require('./Bazar');
const Application = require('./Application');
const Notification = require('./Notification');

// Define relationships
User.hasMany(Bazar, { foreignKey: 'organizerId' });
Bazar.belongsTo(User, { foreignKey: 'organizerId' });

User.hasMany(Application, { foreignKey: 'umkmId' });
Application.belongsTo(User, { foreignKey: 'umkmId' });

Bazar.hasMany(Application, { foreignKey: 'bazarId' });
Application.belongsTo(Bazar, { foreignKey: 'bazarId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Bazar,
  Application,
  Notification
};