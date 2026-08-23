import express from 'express';
import connectDB from './db/database.js';
import userRoutes from './routes/user.route.js';
import authRouter from "./routes/auth.route.js"
import listingRouter from './routes/listing.route.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

