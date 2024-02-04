

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home-related operations
 */

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Welcome message
 *     description: Retrieve a welcome message.
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Welcome to the home page
 */
exports.home = async (req, res) => {
    res.json({ message: "Welcome to the home page" });
};

/**
 * @swagger
 * /api/home/nav:
 *   get:
 *     summary: Navigation message
 *     description: Retrieve a navigation message.
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Navigation here
 */
exports.nav = async (req, res) => {
    res.json({ message: "Navigation here" });
};
