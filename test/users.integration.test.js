import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('https://entregable.up.railway.app')

describe('Pruebas de integracios modulo de usuarios', ()=>{
    let cookie

    it('Debemos loguear al usuario y retornar una cookie', async () => {
        const credentialsMock = {
            email: 'admin',
            password: 'admin'
        };

        const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken');
        expect(cookie.value).to.be.ok;
    });

})