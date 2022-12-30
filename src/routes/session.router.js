import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', [{session:false}, {failureRedirect:'/api/sessions/registerfail'}]), async (req,res) => {
    res.send({status:"Success", payload:req.user._id});
})

router.get('/registerfail', (req, res) => {
    res.status(500).send({error:"Something went wrong."})
});

router.post('/login', passport.authenticate('login', [{session:false}, {failureRedirect:'/api/sessions/loginfail'}]), async (req, res) => {
    req.session.user = {
        name: req.user.name,
        email: req.user.email,
        id: req.user._id
    }
    res.send({status:"success",payload:req.session.user})
});

router.get('/loginfail', async (req, res) => {
    res.status(500).send({status:"error", error:"Error in login"})
});

export default router;