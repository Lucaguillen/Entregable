import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('https://entregable.up.railway.app')

describe('Pruebas de integracios modulo de productos', ()=>{


    it('GET de /api/products/:id debe retornar el producto vinculado con la id proporcionada', async () =>{
        const id = "65b196986a2b8e697d9e07eb"
        const {statusCode, _body} = await requester.get(`/api/products/${id}`)
        
        expect(statusCode).to.be.eql(200)

        expect(_body).to.have.property('title')
        expect(_body).to.have.property('description')
        expect(_body).to.have.property('code')
        expect(_body).to.have.property('price')
        expect(_body).to.have.property('stock')
        expect(_body).to.have.property('category')
        expect(_body).to.have.property('thumbnails')
        expect(_body).to.have.property('status')
        expect(_body).to.have.property('owner')

        expect(_body).to.have.property('_id')
        expect(_body._id).to.be.eql(id)

    })

})