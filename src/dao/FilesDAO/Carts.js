import fs from 'fs';
import FilesContainer from './FilesContainer.js';

const path = 'src/files/carts.json'

export default class Carts extends FilesContainer{
    constructor() {
        super(path);
    }

    getById = async(cid) => {
        const cIdParsed = parseInt(cid);
        if (isNaN(cIdParsed)) return {status:"error",error:"El valor debe ser numérico."};
        if (cIdParsed < 1 ) return {status:"error",error:"ID out of boundary."};
        try {
            const carts = await this.getAll();
            const cartFound = carts.filter(e => e.id === cIdParsed)[0];
            return cartFound;
            
        } catch(error) {
            return{error:`No se pudo encontrar el carrito: ${error}`}
        }
    }

    save = async () => {
        try {
            let carts = await this.getAll();
            let newCart = {};
            if (carts.length === 0) {
                newCart.id = 1;
                newCart.timestamp = Date.now();
                newCart.products = [];
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            } else {
                newCart.id = parseInt(carts[carts.length-1].id) + 1;
                newCart.timestamp = Date.now();
                newCart.products = [];
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            }
            return newCart.id;
        } catch (error) {
            console.log(`No se pudo guardar el carrito... ${error}`);
        }
    }

    addProductById = async (cid, pid, pQuantity) => {
        try {
            let parsedcid = parseInt(cid)
            let parsedpid = parseInt(pid)
            let parsedpQuantity = parseInt(pQuantity)
            let carts = await this.getAll();
            if(carts.length < 1) return console.log("El carrito no exise");
            
            let cartIndex = carts.findIndex((element => element.id === parsedcid));
            if (cartIndex < 0) return console.log("ID de carrito incorrecto.");
            
            let prodExistsAt = carts[cartIndex].products.findIndex(e => e.product === parsedpid);
            if (prodExistsAt >= 0) {
                let lastQuantity = carts[cartIndex].products[prodExistsAt].quantity;
                let newQuantity = lastQuantity + parsedpQuantity;
                carts[cartIndex].products[prodExistsAt].quantity = newQuantity;
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return newQuantity;
            } else {
                let auxP = {
                    product: parsedpid,
                    quantity: parsedpQuantity
                }
                carts[cartIndex].products.push(auxP);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return auxP.quantity;
            }
        } catch (error) {
            console.log(`No se puedo agregar producto. ${error}`);
        }
    }

    emptyCartById = async(id) => {
        try {
            let parsedid = parseInt(id);
            let carts = await this.getAll();
            carts.forEach(element => {
                if(element.id === parsedid) {
                    element.products = []
                }
            });
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
            return carts;
        } catch (error) {
            return error;
        }
    }

    deleteProduct = async(cid, pid) => {
        let parsedcid = parseInt(cid)
        let parsedpid = parseInt(pid)
        let carts = await this.getAll();
        carts.forEach(element => {
            if(element.id === parsedcid) {      
                let newArr = element.products.filter(e => e.product !== parsedpid);
                element.products = newArr;
            }
        });
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
    }
}