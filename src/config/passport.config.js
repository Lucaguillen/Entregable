import passport, { Passport } from "passport";
import jwt, { Strategy } from "passport-jwt";

import { PRIVATE_KEY } from "../utils.js";

import local from "passport-local";
import usersModel from "../dao/dbManagers/models/users.model.js";
import { createHash } from "../utils.js";
import GitHubStrategy from 'passport-github2';

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    },async (jwt_payload, done) =>{
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }))

    //GITHUB

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.489c7bc8ee34faf2',
        clientSecret: '5930e73f36075b08acc651f9c15566686ff684d6',
        callBackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accsessToken, refreshToken, profile, done) => {
        try {
            const email= profile.emails[0].value
            const user = await usersModel.findOne({ email });
            
            if(user) {
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.name,
                last_name:'',
                age:'',
                email,
                password:''
            }

            if(email === "adminCoder@coder.com"){
                newUser.role = "admin"
            }

            const result = await usersModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(`Credenciales incorrectas`)
        }
    }));

    
    //LOCAL STRATEGY

    //REGISTRO

    passport.use('register', new LocalStrategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const user = await usersModel.findOne({ email: username });
            
            if(user) {
                return done(null, false);
            }

            const newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            }
            
            if(username === "adminCoder@coder.com" && password === "adminCod3r123"){
                newUser.role = "admin"
            }
            
            const result = await usersModel.create(newUser);

            return done(null, result); 
        } catch (error) {
            return done(error.message)
        }
    }));

    passport.serializeUser ((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) =>{
        const user = await usersModel.findById(id)
        done(null,user)
    })
}

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token
}

const passportCall = (Strategy) => {
    return async(req, res, next) =>{
        passport.authenticate(Strategy, {session: false}, function(err, user, info ){
            if (err) return next(err)
            if(!user){
                return res.status(401).send({status: "error", error: info.messages ? info.messages : info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}




export {
    initializePassport,
    passportCall
}


/* const initializePassport = () => {


    


    
    //LOGIN

    passport.use('login', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) =>{
        try {
            const user = await usersModel.findOne({ email: username });

            if (!user || !isValidPassword(password, user.password) ) {
                return done( null, false)
            }

            return done(null, user)
        } catch (error) {
            return done('Credenciales incorrectas')
        }
    }))
  

    // serializacion y deserializacion

    

} */

