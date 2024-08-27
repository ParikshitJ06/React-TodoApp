const zod =require('zod');


// const validate_todo  = (data)=>
// {
//     const response = zod.object(
//         {
//             title : zod.string(),
//             description : zod.string()
//         }
//     )

//     return response.safeParse(response)
// }

const validate_todo = (data) => {
    const schema = zod.object({
        title: zod.string(),
        description: zod.string()
    });
    return schema.safeParse(data);
};

const updateTodo = (data)=>
{
    const response = zod.object({
        id : zod.string()
    })
    return response.safeParse(response)
}


const validate_signup = (data)=>
{
    const schema  = zod.object({
        user_name : zod.string(),
        user_mail : zod.string().email(),
        user_password : zod.string().min(8)
    })
    return schema.safeParse(data)

}

module.exports =
{
    validate_signup : validate_signup,
    validate_todo : validate_todo,
    updateTodo : updateTodo,
}