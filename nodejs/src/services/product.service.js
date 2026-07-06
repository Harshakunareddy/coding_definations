const { Product } = require('../../models');

const createItem = data => Product.create(data);

const getAllItems = () => Product.findAll();


module.exports = {
    createItem, getAllItems
}