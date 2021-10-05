module.exports = {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: 'gilang123',
    DB: 'fiverr',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: "+07:00"
}