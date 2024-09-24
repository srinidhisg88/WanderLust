const mongoose=require("mongoose")
const schema=mongoose.Schema
const review=require("./review.js")
const imageschema=schema({
    filename:String,
    url:String
})
const listingschema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:imageschema,
        set:(v)=>v===""?"https://images.unsplash.com/photo-1565413294262-fa587c396965?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        default:{
            filename:"listingimage",
            url:"https://images.unsplash.com/photo-1565413294262-fa587c396965?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true},
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"review"
        }
    ]

    
})
listingschema.post("findOneAndDelete",async (listing)=>{
    if(listing)
    await review.deleteMany({_id:{$in:listing.reviews}})
})
const listing=mongoose.model("Listing",listingschema)
module.exports=listing