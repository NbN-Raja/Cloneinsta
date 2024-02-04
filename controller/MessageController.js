const { ObjectId } = require('mongoose').Types; // Import ObjectId from Mongoose
const io = require("../socket")

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message-Related Routes here
 */

const Message = require("../Models/Message");

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
    const {from,to,content}=req.body;

    const message=  new Message({from,to,content})
    await message.save()
    // Assuming 'io' is set in the app
   const io = req.app.get('io');
        
   if (!io) {
       // Handle the case where 'io' is not set in the app
       return res.status(500).json({ message: 'Socket.io instance not available' });
   }

   console.log('Emitting Message:', message);
   io.emit('messages', message);

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
            $or: [{from:from, to:to},
              {to:from,from:to}]

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
   io.emit('message', message);
   

        res.status(200).json({ message: message });

    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
