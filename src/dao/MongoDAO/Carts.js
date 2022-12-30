import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'carts'
const productsSchema = mongoose.Schema({
    name:String,
    products:
    {
        type: Array,
        default: []
    },
    price:{
        type:Number,
        default:0
    }
    
})

export default class Carts extends MongoDBContainer{
    constructor() {
        super(collection,productsSchema);
    }

    addProductById = async(cid, pid, pQuantity) => {
        let pFilter = await this.model.findById(cid,{products:{$elemMatch:{product:pid}}})
        
        
        if (pFilter.products.length > 0) {
            let aux = pFilter.products[0].quantity + pQuantity;
            let result = await this.model.updateOne({_id:cid,'products.product':pid},{$set:{'products.$.quantity':aux} })
            return result;
        } else {
            let result = await this.model.findByIdAndUpdate(cid,{$push:{products:{product:pid, quantity:pQuantity}}});
            return result;
        }
    }

    emptyCartById = async(id) => {
        let result = await this.model.updateOne({_id:id},{$set:{products:[]}});
        //agregar funcion restock
        return result;
    }

    deleteProduct = async(cid, pid) => {
        let result = await this.model.updateOne({_id:cid},{$pull:{'products':{ 'product': pid }}});
        //agregar funcion restock
        return result;
    }
}