const jsonwebtoken = require("jsonwebtoken")
const User = require("../Models/Users")
const bcrypt = require("bcrypt")
// Logins

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User-related operations
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Retrieve a list of all users.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Users retrieved successfully
 */
exports.login = async (req, res) => {

    const { username, email, password} = req.body;

    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if(!user){
           return res.status(401).json({message:"User not found"})
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Password Incorrect credentials' });
        }

 // Generate access token
 const accessToken = jsonwebtoken.sign(
    { userId: user._id, username: user.username },
   "ACCESS_TOKEN_SECRET",
    { expiresIn: '7d' } // Set the expiration time as needed
);

// Generate refresh token (optional)
const refreshToken = jsonwebtoken.sign(
    { userId: user._id, username: user.username },
    "REFRESH_TOKEN_SECRET",
    { expiresIn: '7d' } // Set the expiration time as needed
);


// Send the tokens in the response
res.json({ accessToken, refreshToken });
        
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// register Here 

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username or email already exists
 *       500:
 *         description: Internal server error
 */

exports.register = async (req, res) => {
    const { username, fullname, email, password, avatar } = req.body;
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const user = await User.create(req.body);
        return res.status(201).json({ message: 'User registered successfully' });
        // Respond with a success message
    } catch (error) {
        // Log the error and respond with an internal server error
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

