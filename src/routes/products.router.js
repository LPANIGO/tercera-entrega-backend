import {Router} from 'express';
import services from '../dao/index.js';
import { uploader } from '../utils.js';

const router = Router();
const admin = true;

const authenticationMiddleware = (req,res,next) => {
    if(admin === false) return res.status(401).send({error:"Not authorized"})
    next(); //permite ir a lo que sigue
}


router.get('/', async (req, res) => {
    try {
        let productsArray = await services.productsService.getAll();
        if (Object.keys(productsArray).length === 0) return res.status(404).send("No hay Productos");
        res.send({status:"success",payload:productsArray});
    } catch (error) {
        res.send({status:"error", payload:error});
    }
});

router.get('/:pid', async (req, res) => {
    try {
        let product = await services.productsService.getById(req.params.pid);
        if (Object.keys(product).length === 0) return res.status(400).send("No hay producto con ese numero de ID");
        if(product.status === "error") return res.send(product);//fs
        res.send({status:"success",payload:product});
    } catch (error) {
        res.send({status:"error", payload:error});
    }
    
});

router.post('/',  uploader.single('image'),  async (req, res) => { //ADMIN middleware Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }
    const {name,description,category,brand,price,stock} = await req.body;
    if(!name||!description||!category||!brand||!price||!stock) return res.status(400).send({error:"Incomplete values"});
    let addedProduct = await services.productsService.save(req.body, req.file.filename); 
    res.send({status:"success",payload:addedProduct});
    
});

router.put('/', authenticationMiddleware, async (req, res) => { //ADMIN middleware
    try {
        let updated = await services.productsService.update( req.body ); 
        if(updated.status === "error") return res.send(updated);//fs
        res.send({status:"success",payload:updated})
    } catch (error) {
        res.send({status:"error", payload:error});
    }
});

router.delete('/:pid', authenticationMiddleware, async (req, res) => {  //ADMIN middleware
    try {
        let newArray = await services.productsService.delete(req.params.pid);
        if(newArray.status === "error") return res.send(newArray);
        res.send({status:"success",payload:newArray});
    } catch (error) {
        res.send({status:"error", payload:error});
    }
    
});

export default router;