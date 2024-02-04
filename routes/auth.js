
module.exports=(app)=>{
    var router = require("express").Router();
    const AuthController = require('../controller/AuthController.js');
  
  
   
    // NormalUsers 
    router.post("/login",AuthController.login)
    router.post("/register",AuthController.register)
    
    
    app.use("/api/auth", router);
    };

