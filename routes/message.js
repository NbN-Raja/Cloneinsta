

module.exports=(app,io)=>{

    const router= require("express").Router()
    const MessageController = require("../controller/MessageController")
    const authMiddleware= require("../middleware/authMiddleware")

    router.post("/send-msg",authMiddleware,MessageController.sendmessage)
    router.get("/get-msg",authMiddleware,MessageController.getmessage)






    app.use("/api/message", router);



}