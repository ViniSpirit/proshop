import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (request, response, next) => {
    let token

    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        try {
           token = request.headers.authorization.split(' ')[1]

           const decode = jwt.verify(token, process.env.JWT_SECRET)

           request.user = await User.findById(decode.id).select('-password')

           next()
        } catch (error) {
            console.error(error)
            response.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token) {
        response.status(401)
        throw new Error('Not Authorizate, no token')
    }

})

export {
    protect
}