import { time, timeStamp } from "console";
import mongoose,{Document, Schema} from "mongoose";

const BudgetSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    timeStamp:{
        type:String,
        required:true,
        default:Date.now()
    }
    
})

const Budget = mongoose.models.Budget || mongoose.model('Budget',BudgetSchema)
export default Budget;