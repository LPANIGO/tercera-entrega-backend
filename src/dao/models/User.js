import mongoose from 'mongoose';

const collection = "Users";

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const userSerice = mongoose.model(collection,usersSchema);
export default userSerice;