//Memamnggil data-data kongigurasi database
const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');

//Konifgurasi database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    timezone: dbConfig.timezone,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Memanggil model-model yang sudah dibuat
db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.category = require('./category.model')(sequelize, Sequelize);
db.service = require('./service.model')(sequelize, Sequelize);
db.servicePlan = require('./service-plan.model')(sequelize, Sequelize);
db.servicePlanFeature = require('./service-plan-feature.model')(sequelize, Sequelize);
db.purchasing = require('./purchasing.model')(sequelize, Sequelize);
db.payment = require('./payment.model')(sequelize, Sequelize);

db.role.hasMany(db.user);
db.user.belongsTo(db.role);

db.category.hasOne(db.service);
db.service.belongsTo(db.category);

db.service.hasMany(db.servicePlan);
db.servicePlan.belongsTo(db.service);

db.user.hasMany(db.service);
db.service.belongsTo(db.user);

db.servicePlan.hasMany(db.servicePlanFeature);
db.servicePlanFeature.belongsTo(db.servicePlan);

db.service.hasMany(db.purchasing);
db.user.hasMany(db.purchasing);
db.purchasing.belongsTo(db.service);
db.purchasing.belongsTo(db.user);

db.purchasing.hasMany(db.payment);
db.payment.belongsTo(db.purchasing);


module.exports = db;