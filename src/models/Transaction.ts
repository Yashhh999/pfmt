import mongoose,{Document, Schema} from "mongoose";

const TransactionSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    timeStamp:{
        type:String,
        required:true,
        default:Date.now()
    }
    
})

export default mongoose.models.Transaction || mongoose.model('Transaction',TransactionSchema)