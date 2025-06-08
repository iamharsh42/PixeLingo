import express from 'express'
import {createCheckoutSession} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const paymentRouter = express.Router()

paymentRouter.post('/create-checkout-session', userAuth, createCheckoutSession)

export default paymentRouter

// new file added