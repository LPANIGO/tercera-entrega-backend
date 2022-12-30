import fs from 'fs';
import FilesContainer from './FilesContainer.js';
import { v4 as uuidv4 } from 'uuid';
import e from 'express';

const path = 'src/files/products.json';

export default class Products extends FilesContainer{
    constructor() {
        super(path);
    }

    getById = async(productId) => {
        const pIdParsed = parseInt(productId);
        if (isNaN(pIdParsed)) return {status:"error",error:"ID must be a number."};
        if (pIdParsed < 1 ) return {status:"error",error:"ID out of boundary."}; 
        try {
            let products = await this.getAll();
            let product = {};
            for(let p of products) { 
                if(pIdParsed === p.id) {
                    product = p;
                }
            }
            return product;
        } catch(error) {
            return{status:"error", error:`No se pudo encontrar el producto: ${error}`};
        }
    }

    save = async (object, filename) => {
        try {
            let products = await this.getAll();
            if (products.length === 0) {
                object.id = 1;
                object.timestamp = Date.now();
                object.code = uuidv4();
                object.thumbnail = filename;
                products.push(object);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            } else {
                //object.id = products[products.length-1].id+1;
                let products = await this.getAll();
                object.id = parseInt(products[products.length-1].id) + 1;
                object.timestamp = Date.now();
                object.code = uuidv4();
                console.log(object);
                products.push(object);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }
            
            return object;
        } catch (error) {
            return {status:"error",error: `No se pudo guardar el producto... ${error}`};
        }
    }

    update = async (object) => {
        const pIdParsed = parseInt(object.id);
        if (isNaN(pIdParsed)) return {status:"error",error:"ID must be a number"};
        if (parseInt(pIdParsed) < 1 ) return {status:"error",error:"ID out of boundary."}; 
        try {
            let products = await this.getAll();
            object.timestamp = Date.now();
            object.code = uuidv4();
            let elemIndex = products.findIndex((element => element.id === parseInt(object.id)));
            if(elemIndex > -1) {
                products[elemIndex] = object;
            } else {
                return {status:"error", error:"El producto no existe."};
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return object;
        } catch (error) {
            return {status:"error", error:`Error ${error}`};
        }
    }

    delete = async (id) => {
        const pIdParsed = parseInt(id);
        if (isNaN(pIdParsed)) return {status:"error",error:"ID must be a number"};
        if (parseInt(pIdParsed) < 1 ) return {status:"error",error:"ID out of boundary."}; 
        try {
            let products = await this.getAll();
            let newArray = products.filter(element => element.id !== parseInt(id));
            await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, '\t'))
            return newArray;
        } catch (error) {
            return {status:"error", error: `${error}`};
        }
    }

    checkAndReduceStock = async(pid, pQuantity) => {
        try {
            let productId = parseInt(pid);
            let products = await this.getAll();
            let product = products.filter(e => e.id === productId)[0];
            if (product.stock >= pQuantity) {
                let aux = product.stock - pQuantity;
                products.forEach(element => {if(element.id === productId){ element.stock = aux}}) //reduce stock
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return true
            } else {
                return false
            }
        } catch (error) {
            return {status:"error", error: error}
        }
    }
}