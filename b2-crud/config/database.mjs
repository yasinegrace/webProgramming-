import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.Promise = global.Promise

// Remove deprecated options
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongoose connected to db'))
    .catch((err) => console.log('Mongoose connection error:', err))

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open')
})

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection has occurred ${err} error`)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected')
})

export default mongoose
