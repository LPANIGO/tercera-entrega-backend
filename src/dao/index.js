const persistence = "MONGO";
let productsService;
let cartsService;

switch(persistence) {
    case "MONGO":
        const {default:MongoProd} = await import('./MongoDAO/Products.js');
        productsService = new MongoProd();
        const {default:MongoCarts} = await import('./MongoDAO/Carts.js');
        cartsService =  new MongoCarts();
        break;
    case "FILESYSTEM":
        const {default:FileProd} = await import('./FilesDAO/Products.js');
        productsService = new FileProd();
        const {default:FileCarts} = await import('./FilesDAO/Carts.js');
        cartsService =  new FileCarts();
        break;
}
const services = {
    productsService,
    cartsService
}

export default services;