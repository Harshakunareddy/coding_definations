const SuccessResponse = (res, data = null, message = "Success", statusCode)=> {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
}

const ErrorResponse = (res, error, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: error
    })
}

module.exports = {SuccessResponse, ErrorResponse};