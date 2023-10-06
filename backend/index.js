const express=require('express');
const {json} = require("express");
const {Constants} = require("./Constants");
const {MongoClient} = require("mongodb");
const app=express();
const PORT = Constants.Port;

const client = new MongoClient(Constants.DBConnectionString);
const database=client.db('blogDB');


app.use(express.json());

// region get /
app.get("/",(req,res)=>{
    res.send("home");
})
// endregion

//region post /register

/** request parameters: name || username || password
 * response: json success:true || json success:false when user already exists
 *
 */
app.post("/register",async (req,res)=>{
        const user=database.collection('users');
        const obj={ name:req.body.name,username:req.body.username,password:req.body.password};

        const check= await user.findOne({username:obj.username});
        if(!check) {
            const result = await user.insertOne(obj);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`,
            );

            res.json({
                success: true
            });
        }
        else{
            res.json({success:false,reason:"username already exists"});
        }

});
//endregion

app.listen(PORT,function (err) {
    if (err) console.log(err);
    else console.log("Server listening on PORT", PORT);
});