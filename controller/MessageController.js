const { ObjectId } = require('mongoose').Types; // Import ObjectId from Mongoose
const io = require("../socket")
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 15
/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message-Related Routes here
 */

const Message = require("../Models/Message");
const User = require('../Models/Users');

/**
 * @swagger
 * /api/message/send-msg:
 *   post:
 *     summary: Send a message
 *     description: Endpoint to send a message.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               timestamp:
 *                 type: string  // Corrected type to string
 *               deleteAt:
 *                 type: string  // Corrected type to string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */

exports.sendmessage = async (req, res) => {
    // Your implementation for sending a message will go here
    const { from, to, content } = req.body;

    const message = new Message({ from, to, content })
    await message.save()
    // Assuming 'io' is set in the app
    const io = req.app.get('io');

    if (!io) {
        // Handle the case where 'io' is not set in the app
        return res.status(500).json({ message: 'Socket.io instance not available' });
    }

    console.log('Emitting Message:', message);
    io.emit('send-messages', message);


    res.status(200).json({ message: 'Message sent successfully' });
};



/**
 * @swagger
 * /api/message/get-msg:
 *   get:
 *     summary: Get a message
 *     description: Endpoint to send a message.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               timestamp:
 *                 type: string  // Corrected type to string
 *               deleteAt:
 *                 type: string  // Corrected type to string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */



exports.getmessage = async (req, res) => {
    const from = req.body.from;
    const to = req.body.to;

    try {
        const message = await Message.find({
            $or: [{ from: from, to: to },
            { to: from, from: to }]

        })

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Assuming 'io' is set in the app
        const io = req.app.get('io');

        if (!io) {
            // Handle the case where 'io' is not set in the app
            return res.status(500).json({ message: 'Socket.io instance not available' });
        }

        console.log('Emitting Message:', message);
        io.emit('get-message', message);


        res.status(200).json({ message: message });

    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



/**
 * @swagger
 * /api/message/chat-users:
 *   get:
 *     summary: Get a message
 *     description: Endpoint to send a message.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               timestamp:
 *                 type: string  // Corrected type to string
 *               deleteAt:
 *                 type: string  // Corrected type to string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */




exports.getChatUsers = async (req, res) => {
  // API endpoint for retrieving distinct users
  try {
    const userId = req.userId;
    const distinctUsers = await Message.distinct('to', { from: userId });
    res.json({ id: distinctUsers });

  } catch (error) {
    console.error('Error fetching distinct users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
  
};








exports.getLastMessage = async (req, res) => {
    try {
        const otherUserId = req.params.id;
        const myUserId = req.userId;

        const lastMessage = await Message.findOne({
            $or: [
                { from: myUserId, to: otherUserId },
                { from: otherUserId, to: myUserId }
            ]
            
        }).sort({ timestamp: -1}); // Sort in descending order, so the latest message comes first
        
        if (!lastMessage) {
            return res.status(404).json({ message: 'No messages found' });
        }

        const user = await User.findById(otherUserId, 'avatar fullname');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = {
            message: lastMessage,
            profile: user
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


exports.getchathistory = async (req, res) => {
    try {
        const otherUserId = req.params.id;
        const myUserId = req.userId; // Extracted from JWT and attached in middleware
        
        let { page, pageSize } = req.query; // Extract pagination parameters from query string
        page = parseInt(page) || 1;
        pageSize = parseInt(pageSize) || 10;

        const skip = (page - 1) * pageSize;

        const messages = await Message.find({
            $or: [
                { from: myUserId, to: otherUserId },
                { from: otherUserId, to: myUserId }
            ]
        })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(pageSize);

        const user = await User.findById(otherUserId).select("fullname");

        // Assuming 'io' is set in the app
        const io = req.app.get('io');

        if (!io) {
            // Handle the case where 'io' is not set in the app
            return res.status(500).json({ message: 'Socket.io instance not available' });
        }

        io.emit('gethistory', messages);

        // Return both messages and user data in the response
        return res.json({ messages, user });
    } catch (error) {
        console.error("Error in getChatHistory:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



