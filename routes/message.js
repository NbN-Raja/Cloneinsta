

module.exports=(app)=>{

    const router= require("express").Router()
    const MessageController = require("../controller/MessageController")
    const authMiddleware= require("../middleware/authMiddleware")

    router.post("/send-msg",MessageController.sendmessage)
    router.get("/get-msg",MessageController.getmessage)
    router.get("/chatusers",authMiddleware,MessageController.getChatUsers)
    router.get("/getlastmsg/:id",authMiddleware,MessageController.getLastMessage)
    router.get("/chathistory/:id",authMiddleware,MessageController.getchathistory)



    // add data



    app.use("/api/message", router);



}