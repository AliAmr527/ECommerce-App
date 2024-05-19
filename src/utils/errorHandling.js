import { ErrorClass } from "./errorClass.js"

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(error => {
            return next(new ErrorClass(error, 500))
        })
    }
}

export const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.status || 500).json({ msgError: error.message })
}