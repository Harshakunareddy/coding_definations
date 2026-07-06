const productService = require('../services/product.service');

const { SuccessResponse, ErrorResponse } = require('../response_json/response');


const CreateProductApi = async (req, res) => {
    try {
        const response = await productService.createItem(req.body);
        return SuccessResponse(res, response, 'Product Created Successfully', 201);
    } catch (err) {
        return ErrorResponse(res, err.message);
    }
}

const GetAll = async (req,res) => {
    try{
        const response = await productService.getAllItems();
        return SuccessResponse(res, response, 'Products Retrieved Successfully', 200);
    } catch(err){
        return ErrorResponse(res,err.message);
    }
}


module.exports = {
    CreateProductApi, GetAll
}