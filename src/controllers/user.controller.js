import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudianry, avatar
    // create user object - create entry in db
    // remove password and refresh token fiend from response
    // check for user creation 
    // return response

    const {fullName, email, username, password} = req.body
    
    //console.log("email", email);

    // if(fullName === ""){
    //    throw new ApiError(400, "Full name is required")
    // }          You can try this too

    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist") 
    }

   // console.log(req.files);

    const avatarLocalpath = req.files?.avatar[0]?.path;
    //const coverImageLocalpath = req.files?.coverImage[0]?.path;

    let coverImageLocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalpath = req.files.coverImage[0].path
    }

    if(!avatarLocalpath){
        throw new ApiError(400, "Avatar image is required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar){
        throw new ApiError(400, "Avatar image is required!")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export {registerUser}