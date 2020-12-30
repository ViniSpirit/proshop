import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import asyncHandler from 'express-async-handler'

//@desc     Auth user & get token
//@route    POST /api/users/login
//@acess    public
const authUser = asyncHandler(async(request, response) => {
    const { email, password } = request.body

    const user = await User.findOne({email:email})

    if(user && ( await user.matchPassword(password))) {
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else {
        response.status(401)
        throw new Error('Invalid email or password')
    }

})

//@desc     Register a new user
//@route    POST /api/users
//@acess    public
const registerUser = asyncHandler(async(request, response) => {
    const { name, email, password } = request.body

    const userExists = await User.findOne({email:email})

    if(userExists) {
        response.status(400)
        throw new Error('User alredy exists')
    }

    const user = await User.create({
        name,
        email, 
        password
    })
    

    if(user) {
        response.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        response.status(404)
        throw new Error('User not found')
    }

})

//@desc     Get user profile
//@route    GET /api/users/profile
//@acess    Private
const getUserProfile = asyncHandler(async(request, response) => {
    const user = await User.findById(request.user._id)

    if(user) {
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        response.status(404)
        throw new Error('User not found')
    }

})

export { authUser, registerUser,  getUserProfile }