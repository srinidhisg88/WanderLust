const express=require("express")
const app=express()
const mongoose =require("mongoose")
const listing=require("./models/listing.js")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const review=require("./models/review.js")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
main().then(()=>{
    console.log("connection successfull")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
   
    if(error){
        let errmsg=err.details.map((el)=>el.message).join(",")
     throw new ExpressError(400, errmsg)
    }else{
        next()
    }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
   
    if(error){
        let errmsg=err.details.map((el)=>el.message).join(",")
     throw new ExpressError(400, errmsg)
    }else{
        next()
    }
}
app.listen(8081,()=>{
    console.log("server is listening to port")
})
app.get("/",(req,res)=>{
    res.send("hi i am root")
})
//index route
app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings= await listing.find({})
    res.render("./listings/index.ejs",{allListings})
}))
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params
    const Listing=await listing.findById(id).populate("reviews")
    res.render("./listings/show.ejs",{Listing})
}))
//new route
//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    
   const newListing=new listing(req.body.listing)
   newListing.save()
   res.redirect("/listings")
  
}))
//edit route 
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params
    const Listing=await listing.findById(id)
    res.render("listings/edit.ejs",{Listing})
}))
//update
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params
    await listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings")
}))
//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params
    await listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))
app.post("/listings/:id/reviews",wrapAsync(async (req,res)=>{
    let List=await listing.findById(req.params.id)
    let newreview=new review(req.body.review)
    List.reviews.push(newreview)
    await newreview.save()
    await List.save()
    res.redirect(`/listings/${List._id}`)
}))
//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
    let {id,reviewId}=req.params
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}

))
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err
    res.status(statusCode).render("error.ejs",{err} )
    // res.status(statusCode).send(message)
})
//reviews
//post route


