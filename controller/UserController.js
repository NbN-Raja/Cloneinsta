/**
 * @swagger
 * tags:
 *    name: User
 *    description: User-Related Routes here  
 */

const  mongoose  = require("mongoose");
const User = require("../Models/Users");

/**
 * @swagger
 * /api/users/details:
 *   get:
 *     summary: Get user details
 *     description: Retrieve details of the authenticated user.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               username: test
 *               fullname: test Doe
 *               email: test@example.com
 *               avatar: http://test.com/avatar.jpg
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */

exports.details = async (req, res) => {
    try {
        // Retrieve user details using the authenticated user's ID from the token
        const userId = req.params.id; // Assuming you have middleware to extract user information from the token

        // Fetch user details from the database using userId
        const user = await User.findById(userId);
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user details
        res.status(200).json(user);
    } catch (error) {
        console.error('Error while fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// update here 

exports.updatedetails =async(req,res)=>{
    
}