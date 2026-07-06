const { ErrorResponse, SuccessResponse } = require("../response_json/response");
const { Signup, login, SignupAdmin } = require("../services/user.service");

const signupApiAdmin = async (req, res) => {
    try {
        const response = await SignupAdmin(req.body);
        return SuccessResponse(res, response, "Signup Success", 200);
    } catch (err) {
        return ErrorResponse(res, err.message, 400);
    }
}

const signupApi = async (req, res) => {
    try {
        const response = await Signup(req.body);
        return SuccessResponse(res, response, "Signup Success", 200);
    } catch (err) {
        return ErrorResponse(res, err.message, 400);
    }
}

const loginApi = async (req, res) => {
    try {
        const logged_in_user = await login(req.body);
        return SuccessResponse(res, logged_in_user,'login success', 200);
    } catch (error) {
        return ErrorResponse(res, error.message, 400);
    }
}
module.exports = {
    loginApi, signupApi, signupApiAdmin
}