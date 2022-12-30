import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";
import { v4 as uuidv4 } from 'uuid';


const collection = 'products'
const productsSchema = mongoose.Schema({
    code: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
        max:50
    },
    description:  {
        type:String,
        required:true,
    },
    thumbnail:  {
        type:String,
        required:true,
    },
    category:  {
        type:String,
        required:true,
    },
    brand:  {
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    stock: {
        type:Number,
        required:true,
    }
}, {timestamps:true})

export default class Products extends MongoDBContainer{
    constructor() {
        super(collection,productsSchema);
    }

    save = async(document, filename) => {
        document.thumbnail = filename;
        document.code = uuidv4();
        let results = await this.model.create(document);
        return results;
    }

    checkAndReduceStock =async(pid, pQuantity) => {
        let product = await this.model.find({_id:pid},{stock:1});
        if(product[0].stock >= pQuantity) {
            let aux = product[0].stock - pQuantity;
            await this.model.updateOne({_id:pid},{$set:{stock:aux}});
            return true;
        } else {
            return false;
        }
    }
}