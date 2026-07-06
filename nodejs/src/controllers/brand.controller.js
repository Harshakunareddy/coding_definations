const brandService = require('../services/brand.service');

const { SuccessResponse, ErrorResponse } = require('../response_json/response');

const CreateBrandApi = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        }
        const response = await brandService.createItem(req.body);
        return SuccessResponse(res, response, 'Brand Created Successfully', 201);
    } catch (err) {
        return ErrorResponse(res, err.message);
    }
}



const GetAll = async (req, res) => {
    try {
        const response = await brandService.getAllItems();
        return SuccessResponse(res, response, 'Brands Retrieved Successfully', 200);
    } catch (err) {
        return ErrorResponse(res, err.message);
    }
}




module.exports = {
    CreateBrandApi, GetAll
}