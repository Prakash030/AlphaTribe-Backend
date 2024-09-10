import auth from './auth.route.js'
import user from './user.route.js'
import posts from './posts.route.js'
import express from 'express'
const router = express.Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/posts', posts)

export default router