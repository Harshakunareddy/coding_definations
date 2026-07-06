const {Category, Product} = require('../../models');

const createItem = data => Category.create(data);

const getAllItems = () => Category.findAll();          



const getByBrandId = async (brandId) => {
    return Category.findAll({
        include: [
            {
                model: Product,
                as: 'products',
                where: { brand_id: brandId },
                attributes: ['id', 'name']
            }
        ], attributes: ['id', 'name', 'image'], distinct: true
    });
};





module.exports = {
    createItem, getAllItems, getByBrandId
}