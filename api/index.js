import express from 'express';
import connectDB from './db/database.js';
import userRoutes from './routes/user.route.js';
import authRouter from "./routes/auth.route.js"

connectDB();
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

