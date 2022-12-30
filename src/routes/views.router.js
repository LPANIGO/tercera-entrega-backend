import {Router} from 'express';
import services from '../dao/index.js';

const router = Router();


router.get('/', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/data', (req, res) => {
    if(!req.session.user) return res.render('/login');
    res.render('data', {user: req.session.user});
});

router.get('/createProduct', (req, res) => {
    res.render('createProduct');
})

router.get('/products', async (req,res) => {
    let products = await services.productsService.getAll();
    res.render('products', {products})
})

export default router;