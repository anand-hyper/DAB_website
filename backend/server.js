import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import 'dotenv/config'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/useRoute.js'

// Debug logs
console.log('Starting server with environment:')
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI)
console.log('Cloudinary Name exists:', !!process.env.CLOUDINARY_CLOUD_NAME)
console.log('PORT:', process.env.PORT || 4000)

// app config
const app = express()
const port = process.env.PORT || 4000

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend-url.com'], // Add your frontend URLs
    credentials: true
}))

// Error handling for database connection
try {
    await connectDB()
    console.log('Database connected successfully')
} catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
}

// Error handling for cloudinary connection
try {
    connectCloudinary()
    console.log('Cloudinary connected successfully')
} catch (error) {
    console.error('Cloudinary connection failed:', error)
}

// middlewares
app.use(express.json())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'API Working',
        environment: process.env.NODE_ENV
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.error(err)
    server.close(() => {
        process.exit(1)
    })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.error(err)
    process.exit(1)
})
