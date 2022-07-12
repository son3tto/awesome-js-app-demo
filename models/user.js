const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true 
    },      
    email:{
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true 
    },
    avatar:{
        type: String
    },
    identity:{
        type: String
    },   
    date:{
        type: Date,
        default: Date.now
    }
})

// User?
// first parameter - schema name in db
// second parameter - scheme name in js
module.exports = User = mongoose.model("users", UserSchema);
// 在我们自己写模块的时候，需要在模块最后写好模块接口，声明这个模块对外暴露什么内容，module.exports 提供了暴露接口的方法。