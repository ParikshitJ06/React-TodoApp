require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express();
const jwt  = require('jsonwebtoken');
const connect = require("./connection/connection")
const {validate_signup,validate_todo,updateTodo} = require("./ZOD_validate/data_validate")
const {user_schema ,Tododb_schema}= require("./model/user_model")
const bcrypt = require("bcrypt")

const cookieParser = require('cookie-parser');
const { description } = require('../../../NodeJS/Zod_Middleware/zod_inputValidation/zod_schema');
app.use(cookieParser());


const port = process.env.PORT ;

app.use(cors());

app.use(express.json())

connect().then(()=>{console.log("connected to database ")}).catch((err)=>{console.error(`the error is ${err}`)})

app.get("/todos",async(req,res)=>{

    const token = await req.cookies.token
    console.log(token)
    const data = await jwt.verify(token, process.env.jwt_passkey)
    console.log(data)
    if(!data)
    {
        res.status(404)
    }
    res.alert("todo added")
    res.send({msg : "successfully verfied "})

})
app.post("/todos",async(req,res)=>{
    const data = validate_todo(req.body).success
    if(!data)
    {
        return res.status(400).send({ msg: "Invalid data format" });
    }
    await Tododb_schema.create({
        title : req.body.title,
        description : req.body.description
    })
    console.log("added to database")
    res.send({msg :"added to database" })


})
app.put("/completed" ,(req,res)=>{

})

app.post("/sign-up",async (req,res)=>{
    // const body= req.body;
    const response = await validate_signup(req.body)
    if(!response.success)
    {
        res.status(400).send({error: "wrong inputs"})
    }


    const salt =await bcrypt.genSalt(Number(process.env.SALT))
    const hashpassword = await bcrypt.hash(req.body.user_password ,salt)

    // const newuser = await user_schema.create(
    //     {
    //         user_name : req.body.user_name,
    //         user_mail : req.body.user_mail,
    //         user_password : hashpassword
    //     }
    // )

    const newuser = new user_schema({...req.body, user_password : hashpassword})

    console.log("user created" + newuser)
    const token =await newuser.generateAuthToken();
    console.log("token"+token)
    await newuser.save()
    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: true,   // Ensures the cookie is sent over HTTPS
        sameSite: 'Strict', // Helps protect against CSRF attacks
    });
    res.json({ msg: "User logged in successfully" });
})


app.post("/login", async (req,res)=>{

    
    const password = req.body.user_password
    const email  = req.body.user_mail 
    const user  = await user_schema.findOne({user_mail : email})
    if(!user)
    {
        res.status(401).send({msg : "invaild email or password"})
    }
    const validpassword = bcrypt.compare(user.user_password , password)
    if(!validpassword)
        {
            res.status(401).send({msg : "invaild email or password"})
        }
    const token = user.generateAuthToken();
    res.cookie("token",token,  {
        httpOnly: true, // Prevents JavaScript access
        secure: true,   // Ensures the cookie is sent over HTTPS
        sameSite: 'Strict', // Helps protect against CSRF attacks
    })

    res.json({msg :"loged in successfully" })
    // console.log(response)


})




app.listen(port, ()=>{
    console.log(`Server started at PORT ${port}`)
})