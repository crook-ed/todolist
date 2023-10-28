const { Sequelize } = require("sequelize");


module.exports = new Sequelize('pernstack' , 'postgres' , 'postgres@6404' , {
    host: 'localhost',
    dialect: 'postgres'
});
