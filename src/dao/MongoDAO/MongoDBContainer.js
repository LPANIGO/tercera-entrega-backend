import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export default class MongoDBContainer {
    constructor(collection,schema) {
        //mongoose.connect('mongodb+srv://leopanigo:Mongo2.0@clusterdeprueba.ozm98v9.mongodb.net/segundaEntrega?retryWrites=true&w=majority');
        this.model = mongoose.model(collection,schema);
    }

    getAll = async() => {
        let results = await this.model.find().lean();
        return results;
    }

    getById = async(_id) => {
        let result = await this.model.findById(_id);
        return result;
    }

    save = async(document) => {
        let result = await this.model.create(document);
        return result;
    }

    update = async (document) => {
        let result = await this.model.updateOne({"_id": document._id },{$set: {name:document.name}});
        return result;
    }

    delete = async (_id) => {
        let result = await this.model.deleteOne({"_id": _id });
        return result
    }
}