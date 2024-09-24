const mongoose=require("mongoose")
const schema=mongoose.Schema
const reviewSchema=new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true
    }
})
module.exports=mongoose.model("review",reviewSchema)