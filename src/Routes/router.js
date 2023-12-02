import { Router as expressRouter } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}


    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };

        res.sendServerError = (error) => {
            res.status(500).json( { error } )
        };

        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };

        next();
    }

    handlePolicies = (policies) => (req, res, next) => {
        if(policies[0] === 'public') return next();
        const authToken = req.cookies.coderCookieToken
        if(!authToken) return res.status(401).json({ error: 'no token provide' });
        
        
        const user = jwt.verify(authToken, PRIVATE_KEY);
        
        
        console.log('Policies:', policies);
        if(!policies.includes(user.user.role))
            return res.status(403).json({ error: 'not permissions' });

        req.user = user;
        next();
    }

    applyCallbacks(callbacks) {
        
        return callbacks.map((callback) => async (...params) => {
            try {
                
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message })
            }
        }) //[req, res]
    }
}