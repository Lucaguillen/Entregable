import passport from "passport";
import jwt from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";
import { usersModel } from "../dao/dbManagers/models/users.model.js";
import GitHubStrategy from 'passport-github2';
import config from "../../config.js";



const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


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






export {
    initializePassport
}


