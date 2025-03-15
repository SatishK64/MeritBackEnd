const app = require("express")();
require("dotenv").config();
app.get("/",(req,res)=>{
    res.json({message : "hello World!!"});
})
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`The Server is running on PORT ${port}`))