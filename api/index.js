import express from 'express';
import connectDB from './db/database.js';
import userRoutes from './routes/user.route.js';
import authRouter from "./routes/auth.route.js"
import errorMiddleware from './middlewares/errorMiddleware.js';


connectDB();

const app = express();

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter)

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

