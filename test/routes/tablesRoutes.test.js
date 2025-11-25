import request from 'supertest';
import { afterAll, beforeAll, beforeEach, afterEach, describe, expect, it, jest } from '@jest/globals';
import app from '../../src/app.js';
import Table from '../../src/models/table.js';
import db from '../../src/db/dbConfig.js';

let server;
beforeAll(() => {
    server = app.listen(4000);
});

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

afterAll(() => {
    server.close();
});

describe('Testando as rotas GET de tables', () => {
    it('/tables deve retornar uma lista de mesas (GET)', async () => {
        await request(app)
            .get('/tables')
            .expect(200);
    });

    it('/tables/:id deve retornar uma mesa com o id passado (GET)', async () => {
        const idMock = 1;

        const response = await request(app)
            .get(`/tables/${idMock}`)
            .expect(200);
        
        expect(response.body.id).toBe(idMock);
    });

    it('/tables deve retornar status 500 em caso de erro no servidor', async () => {
        jest.spyOn(Table, 'getTables').mockRejectedValue(new Error('DataBase error'));

        await request(app)
            .get('/tables')
            .expect(500);
    });

    it.each([
        {value: 3.5},
        {value: 'a'},
    ])('/tables/:id deve retornar status 400 para id $value (GET)', async (value) => {
        await request(app)
            .get(`/tables/${value}`)
            .expect(400);
    });

    it('/tables/:id deve retornar status 500 em caso de erro no servidor (GET)', async () => {
        jest.spyOn(Table, 'getTableById').mockRejectedValue(new Error('DetaBase error'));

        await request(app)
            .get('/tables/1')
            .expect(500);
    });
});

describe('Testando as rotas POST de tables', () => {
    it('/tables deve criar nova mesa e retornar status 201 (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };

        await request(app)
            .post('/tables')
            .send(tableMock)
            .expect(201);
    });
});