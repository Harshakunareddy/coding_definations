const categoryService = require('../services/category.service');

const { SuccessResponse, ErrorResponse } = require('../response_json/response');


const CreateCategoryApi = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        }
        const response = await categoryService.createItem(req.body);
        return SuccessResponse(res, response, 'Category Created Successfully', 201);
    } catch (err) {
        return ErrorResponse(res, err.message);
    }
}

const GetAll = async (req,res) => {
    try{
        const response = await categoryService.getAllItems();
        return SuccessResponse(res, response, 'Categories Retrieved Successfully', 200);
    } catch(err){
        return ErrorResponse(res,err.message);
    }
}


const GetByBrandId = async (req,res) => {
    try{
        const response = await categoryService.getByBrandId(req.params.brandId);
        return SuccessResponse(res, response, 'Categories Retrieved Successfully', 200);
    } catch(err){
        return ErrorResponse(res,err.message);
    }
}


module.exports = {
    CreateCategoryApi, GetAll, GetByBrandId
}