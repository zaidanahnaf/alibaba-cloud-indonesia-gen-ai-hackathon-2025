import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from "http";
import chatRoute from './routes/chat.route';
import userRoute from './routes/user.route';
// import { insertManyData } from './controller/insert.many';
import cors from 'cors';
import { getAllFood, getDetailFood, getFoodByMood } from './controller/food.controller';
import { getRekomenFood } from './controller/mood.controller';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true, 
  })
);

app.use('/chat', chatRoute)
app.use('/user', userRoute)
app.get('/food/:mood', getFoodByMood)
app.post('/food', getDetailFood)
app.get('/food', getAllFood)
app.get('/mood/:mood', getRekomenFood)

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})