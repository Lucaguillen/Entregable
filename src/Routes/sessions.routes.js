import { Router } from 'express';
import passport from 'passport';

const router = Router();

//GITHUB

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res) => {
   res.send({ status: 'success', message: 'usuario registrado'}) 
})

router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res) => {
    req.session.user = req.user
    res.redirect('/products')
})

//LocalStrategy

router.post('/register', passport.authenticate('register',{failureRedirect: 'failRegister'}), async (req, res) => {
    res.status(201).send({status: 'success', message: 'Usuario Registrado'})
});

router.get('/failRegister', async (req, res) =>{
    res.status(500).send({status: 'error', message: 'falla en el registro'})
})

router.post('/login', passport.authenticate('login', {failureRedirect: 'failLogin'}), async (req, res) => {
    if(!req.user){
        return res.status(401).send({status: 'error', message: 'Credenciales incorrectas' })
    }
    
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    res.send({ status: 'success', message: 'login exitoso' })
});

router.get('/failLogin', async (req, res) =>{
    res.status(500).send({status: 'error', message: 'falla en el Inicio de sesion'})
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/login');
    })
})

export default router;