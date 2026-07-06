const { Brand } = require('../../models');

const createItem = data => Brand.create(data);

const getAllItems = () => Brand.findAll();



module.exports = {
    createItem, getAllItems
}