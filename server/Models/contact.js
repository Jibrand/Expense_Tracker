import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    fullname:{
        type : String,
    },
    email:{
        type : String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const contactData = mongoose.model("contact",contactSchema);
export default contactData