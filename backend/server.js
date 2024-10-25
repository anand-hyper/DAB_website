import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import 'dotenv/config'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/useRoute.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Debug logs with timestamp
const logWithTimestamp = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`)
}

logWithTimestamp('Starting server with environment configuration:')
logWithTimestamp(`MongoDB URI exists: ${!!process.env.MONGODB_URI}`)
logWithTimestamp(`Cloudinary Name exists: ${!!process.env.CLOUDINARY_CLOUD_NAME}`)
logWithTimestamp(`PORT: ${process.env.PORT || 4000}`)

// App configuration
const app = express()
const port = process.env.PORT || 4000

// Security configurations
const allowedOrigins = [
    'https://dab-website-frontendnew.vercel.app',
    'https://dab-website-admin.vercel.app',
    // Include development origins if needed
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean)

// Enhanced CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            logWithTimestamp(`Blocked request from unauthorized origin: ${origin}`)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-access-token'],
    maxAge: 86400 // CORS preflight cache for 24 hours
}))

// Security middlewares
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parser with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Database connection with retry mechanism
const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await connectDB()
            logWithTimestamp('Database connected successfully')
            return
        } catch (error) {
            if (i === retries - 1) {
                logWithTimestamp(`Database connection failed after ${retries} attempts:`)
                console.error(error)
                process.exit(1)
            }
            logWithTimestamp(`Database connection attempt ${i + 1} failed, retrying in ${delay/1000}s...`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
}

// Cloudinary connection
const initializeCloudinary = async () => {
    try {
        await connectCloudinary()
        logWithTimestamp('Cloudinary connected successfully')
    } catch (error) {
        logWithTimestamp('Cloudinary connection failed:')
        console.error(error)
        // Don't exit process, as this is not critical for the API to function
    }
}

// Initialize services
await connectWithRetry()
await initializeCloudinary()

// API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Health check endpoint with enhanced information
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'API Working',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        serverInfo: {
            nodeVersion: process.version,
            platform: process.platform,
            memory: process.memoryUsage()
        }
    })
})

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    logWithTimestamp(`Error occurred during ${req.method} ${req.path}:`)
    console.error(err)

    // Handle CORS errors specifically
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            status: 'error',
            message: 'Origin not allowed',
            requestOrigin: req.headers.origin
        })
    }

    // Handle other types of errors
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.path}`
    })
})

// Start server with enhanced error handling
const server = app.listen(port, () => {
    logWithTimestamp(`Server running on port ${port}`)
})

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    logWithTimestamp(`${signal} received. Starting graceful shutdown...`)
    
    server.close(() => {
        logWithTimestamp('HTTP server closed')
        // Close database connection and other resources here
        process.exit(0)
    })

    // Force close after 10 seconds
    setTimeout(() => {
        logWithTimestamp('Could not close connections in time, forcefully shutting down')
        process.exit(1)
    }, 10000)
}

// Handle various shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logWithTimestamp('UNHANDLED REJECTION! 💥')
    console.error(err)
    gracefulShutdown('unhandled rejection')
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logWithTimestamp('UNCAUGHT EXCEPTION! 💥')
    console.error(err)
    gracefulShutdown('uncaught exception')
})

export default app
