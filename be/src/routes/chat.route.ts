import { Router } from "express";
import { getChatByCreator, getChatById, sendMessage } from "../controller/chat.controller";

const chatRoute = Router();

chatRoute.post('/post', sendMessage)
chatRoute.get('/:creatorId', getChatByCreator)
chatRoute.get('/:id', getChatById)

export default chatRoute