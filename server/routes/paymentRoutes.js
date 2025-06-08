import express from 'express'
import {createCheckoutSession, addCredits, verifySession} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const paymentRouter = express.Router()

paymentRouter.post('/create-checkout-session', userAuth, createCheckoutSession)
paymentRouter.post('/add-credits', userAuth, addCredits)
paymentRouter.post('/verify-session', verifySession)

export default paymentRouter

// new file added