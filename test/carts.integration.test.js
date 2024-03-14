import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('https://entregable.up.railway.app')

describe('Pruebas de integracios modulo de productos', ()=>{


    it('GET de /api/carts/:cid debe retornar el carrito vinculado con la id proporcionada', async () =>{
        const cid = "6584d91ae9c1b54cd55b8b0e"
        const {statusCode, _body} = await requester.get(`/api/carts/${cid}`)
        
        expect(statusCode).to.be.eql(200)

        expect(_body.payload).to.have.property('productsCart')
        expect(Array.isArray(_body.payload.productsCart)).to.be.eql(true);

        expect(_body.payload).to.have.property('userId')


        expect(_body.payload).to.have.property('_id')
        expect(_body.payload._id).to.be.eql(cid)

    })

})