import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/dbManagers/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;


const initializePassport = () => {

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
            return done(`Credenciales incorrectas`)
        }
    }));

    
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

    passport.serializeUser ((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) =>{
        const user = await usersModel.findById(id)
        done(null,user)
    })

}

export {
    initializePassport
}
