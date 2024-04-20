import createError from 'http-errors'

export const badRequest = (err, res) => {
    const error = createError.BadRequest(err)
    return res.status(error.status).json({
        message: error.message,
        code: 0
    })
}
export const internalServerError = (err, res) => {
    const error = createError.InternalServerError();
    return res.status(error.status).json({
        message: error.message,
        code: -1
    })
}
export const notFound = (res) => {
    const error = createError.NotFound('This route is not define');
    return res.status(error.status).json({
        message: error.message,
        code: 0
    })
}
export const notAuth = (mes, res) => {
    const error = createError.Unauthorized(mes);
    return res.status(error.status).json({
        message: error.message,
        code: 0
    })
}
export const handleUnauthorizedError = (err, req, res, next) => {
    console.log(123);
    if (err.status === 401) {
        console.log(234);
        return res.status(200).json({
            message: 'You cannot access this page',
            code: 0
        });
    }
    next();
}