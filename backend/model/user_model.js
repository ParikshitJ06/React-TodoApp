const mongoose = require("mongoose");
const {v4  : uuidv4} = require('uuid')
const jwt = require("jsonwebtoken");

const user = new  mongoose.Schema(
    {
        user_name: { type: String, required: true },
        user_mail: { type: String, required: true, unique: true },
        user_password: { type: String, required: true },
        user_id: { type: String, default: uuidv4 },
    },{timestamps:true}
)
// user.methods.generateAuthToken = ()=>
// {
//     const token  = jwt.sign( { _id : this._id , 
//                             user_id : this.user_id }, process.env.jwt_passkey , {expiresIn:"1d"}) // it can be 7d , 6h
//     return token
// }
user.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, user_id: this.user_id },
        process.env.jwt_passkey,
        { expiresIn: "1d" }
    );
    return token;
};

const Userdb_schema = mongoose.model("user_info", user)




const todo_data = mongoose.Schema(
    {
        title: {type:String , required:true},
        description : {type:String , required:true},
    }
)
const Tododb_schema = mongoose.model("todo_db" ,todo_data)

module.exports = {Userdb_schema : Userdb_schema
     , Tododb_schema : Tododb_schema}