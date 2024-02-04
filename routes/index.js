
module.exports=(app)=>{
  var router = require("express").Router();
  const Indexcontroller = require('../controller/Indexcontroller');


 
  // NormalUsers 
  router.get("/home",Indexcontroller.home)
  router.post("/nav",Indexcontroller.nav)
  
  
  app.use("/api/home", router);
  }

