const sequelize = require('../config/db');
const BrandModel = require('./brand');
const CategoryModel = require('./category');
const ProductModel = require('./product');
const UserModel = require('./user');
const Brand = BrandModel(sequelize, require('sequelize').DataTypes);
const Category = CategoryModel(sequelize, require('sequelize').DataTypes);
const Product = ProductModel(sequelize, require('sequelize').DataTypes);
const User = UserModel(sequelize, require('sequelize').DataTypes);

const db = {sequelize, Brand, Category, Product, User};
Object.values(db).forEach(model => {
    if (model.associate) {
        model.associate(db);
    }
});

module.exports = db;