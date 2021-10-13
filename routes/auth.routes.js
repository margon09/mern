const { Router } = require('express')
const bcrypt = require('bcryptjs') // hash passwords and compares
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// prefix is: '/api/auth' we concatinate is with '/register'
router.post(
	// 1. endpoint
	'/register',
	// 2. array of middlewares
	[
		check('email', 'Wrong email').isEmail(),
		check('password', 'Minimum password length is 6 symbols').isLength({
			min: 6
		})
	],
	// 3. function
	async (req, res) => {
		// working with validation
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			// return to frontend
			return res.status(400).json({
				errors: errors.array(),
				message: 'Wrong registration data'
			})
		}
		// control logic
		try {
			// we send 2 fields from frontend: email and password
			const { email, password } = req.body

			// registering a new user logic and checking up
			// of the email already exists in db, to stop the script -> return
			const candidate = await User.findOne({ email: email })

			if (candidate) {
				return res.status(400).json({ message: 'This user already exists' })
			}

			const hashedPassword = await bcrypt.hash(password, 12)
			const user = new User({ email, password: hashedPassword })

			await user.save()

			// as this Promise is done and user is created, we answer frontend
			res.status(201).json({ message: 'The user has been created' })
		} catch (e) {
			res.status(500).json({
				message: 'Something went wrong, try to register again'
			})
		}
	}
)

// '/api/auth/login'
router.post(
	'/login',
	[
		check('email', 'Enter the correct email').normalizeEmail().isEmail(),
		check('password', 'Enter your password').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Wrong registration when trying to enter the system'
				})
			}
			// Logic to create our user
			const { email, password } = req.body
			// find this user by email (else if he doens´t exist -> we can´t login)
			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: 'User is not found' })
			}

			// we need to check if the passwords are the same (entered from frontend and in db)
			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({ message: 'Wrong password, try again' })
			}
			// now we need to create authorization through jwt-token
			const token = jwt.sign(
				// 1. obj
				{ userId: user.id },
				// 2. secret key - // just a line/string depending on our configs
				config.get('jwtSecret'),
				// 3. obj of expiration hour, usually 1 hour
				{ expiresIn: '1h' }
			)
			// by default status here is 200, no need to write it
			res.json({ token, userId: user.id })
		} catch (e) {
			res.status(500).json({
				message: 'Something went wrong, try to register again'
			})
		}
	}
)

module.exports = router
