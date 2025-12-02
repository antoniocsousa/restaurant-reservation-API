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
    jest.restoreAllMocks();
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

afterAll(() => {
    server.close();
});

describe('Testes das rotas GET de tables', () => {
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

    it('/tables/available deve retornar mesas disponiveis para determinada data e status 200', async () => {
        const dateMock = '2026-01-25';

        await request(app)
            .get(`/tables/available?date=${dateMock}`)
            .expect(200);
    });

    it('/tables/available deve retornar status 400 se data não estiver no formato certo', async () => {
        const dateMock = '19/07/2005';

        const response = await request(app)
            .get(`/tables/available?date=${dateMock}`)
            .expect(400);

        expect(response.body).toBe('Invalid date format, expected YYYY-MM-DD');
    });

    it('/tables/available deve retornar status 500 em caso de erro no servidor', async () => {
        jest.spyOn(Table, 'getTables').mockRejectedValue(new Error('Database error'));

        const dateMock = '2026-01-25';

        await request(app)
            .get(`/tables/available?date=${dateMock}`)
            .expect(500);
    });
});

describe('Testes das rotas POST de tables', () => {
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

    it('/tables deve retornar status 400 se seats não for passado (POST)', async () => {
        const tableMock = {
            active: true,
        };

        const response = await request(app)
            .post('/tables')
            .send(tableMock)
            .expect(400);
        
        expect(response.body).toBe('The "seats" field is required.');
    });

    it('/tables deve retornar status 400 se active não for passado (POST)', async () => {
        const tableMock = {
            seats: 4,
        };

        const response = await request(app)
            .post('/tables')
            .send(tableMock)
            .expect(400);
        
        expect(response.body).toBe('The "active" field is required.');
    });

    it.each([
        {seats: '4', active: true},
        {seats: 4, active: 'true'},
    ])('/tables deve retornar status 400 se seats ou active tiverem tipos inválidos', async (tableMock) => {
        const response = await request(app)
            .post('/tables')
            .send(tableMock)
            .expect(400);
        
        expect(response.body).toBe('invalid data');
    })

    it('/tables deve retornar status 500 em caso de erro no servidor (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };

        jest.spyOn(Table.prototype, 'postTable').mockRejectedValue(new Error('DetaBase error'));

        await request(app)
            .post('/tables')
            .send(tableMock)
            .expect(500);
    });
});

describe('Testes das rotas PATCH de tables', () => {
    it('/tables/:id deve atualizar mesa e retornar status 200 (PATCH)', async () => {
        const idMock = 1;

        await request(app)
            .patch(`/tables/${idMock}`)
            .expect(200);
    });

    it('/tables/:id deve retornar status 400 se id não for inteiro (PATCH)', async () => {
        const idMock = 'test';

        const response = await request(app)
            .patch(`/tables/${idMock}`)
            .expect(400);
        
        expect(response.body).toBe('The parameter "id" must be integer');
    });

    it('/tables/:id deve retornar status 500 em caso de erro no servidor (PATCH)', async () => {
        const idMock = 1;

        jest.spyOn(Table, 'patchTable').mockRejectedValue(new Error('DetaBase error'));

        await request(app)
            .patch(`/tables/${idMock}`)
            .expect(500);
    });
});

describe('Testes das rotas DELETE de tables', () => {
    it('/tables/:id deve deletar uma mesa e retornar status 200 (DELETE)', async () => {
        const idMock = 1;

        await request(app)
            .delete(`/tables/${idMock}`)
            .expect(200);
    });

    it('/tables/:id deve retornar status 400 se id não for inteiro (DELETE)', async () => {
        const idMock = 'test';

        const response = await request(app)
            .delete(`/tables/${idMock}`)
            .expect(400);
        
        expect(response.body).toBe('The parameter "id" must be integer')
    });

    it('/tables/:id deve retornar status 500 em caso de erro no servidor (DELETE)', async () => {
        const idMock = 1;

        jest.spyOn(Table, 'deleteTable').mockRejectedValue(new Error('DetaBase error'));

        await request(app)
            .delete(`/tables/${idMock}`)
            .expect(500);
    });
});