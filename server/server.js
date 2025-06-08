import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import ImageRouter from './routes/imageRoutes.js'
import paymentRouter from './routes/paymentRoutes.js' // new line added

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', ImageRouter)
app.use('/api/payment', paymentRouter) // new line added
app.get('/', (req, res)=> res.send("API Working fine"))

app.listen(PORT, ()=> console.log('Server running on port ' + PORT));
