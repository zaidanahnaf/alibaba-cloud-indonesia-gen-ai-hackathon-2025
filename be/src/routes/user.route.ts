import { Router } from "express";
import { getUserByEmail, getUserById, loginUser, registerUser } from "../controller/user.controller";

const userRoute = Router();

userRoute.post('/', registerUser)
userRoute.post('/login', loginUser)
userRoute.get('/:email', getUserByEmail)
userRoute.get('/:id', getUserById)

export default userRoute