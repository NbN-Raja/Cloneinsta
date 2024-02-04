
module.exports =(app)=>{
    var router = require("express").Router();
    const UserController = require("../controller/UserController")

    const authorization= require("../middleware/authMiddleware")

    router.get("/details/:id", UserController.details)
    router.get("/update/:id", UserController.updatedetails)

    app.use("/api/users", router);

}