import express from 'express';
import config from './config/config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/session.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import initializeCustomPassport from './config/passport.config.js'
import passport from 'passport';

const app = express();

mongoose.set('strictQuery', true);
const connection = mongoose.connect(`mongodb+srv://${config.mongo.USER}:${config.mongo.PASSWORD}@clusterdeprueba.ozm98v9.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`)

console.log(config);

app.use(express.json());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://leopanigo:Mongo2.0@clusterdeprueba.ozm98v9.mongodb.net/testRegister?retryWrites=true&w=majority',
        ttl:3600
    }),
    secret: "Session2000",
    resave: false,
    saveUninitialized: false
}))//crea una cookie aun sin tener endpoint, con su propio id

initializeCustomPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars')
app.use('/', viewsRouter);

app.use(express.static(__dirname+'/public'));
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
//ver plantilla front ingresar productos en final de clase 12 y clase motor de plantillas.
//validar params recibidos en cada ruta, procesar de string a int por ej.

const PORT = process.env.PORT || config.app.PORT;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.use( (req, res, next) => {
    res.status(404).send({ error : "404", description: `path '${req.path}' method '${req.method}' not implemented`})
    next();
})