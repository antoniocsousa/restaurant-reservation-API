import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll, jest, beforeEach, afterEach } from '@jest/globals';
import app from '../../src/app.js';
import Reservation from '../../src/models/reservation.js';
import db from '../../src/db/dbConfig.js';

let server;
beforeAll(() => {
    server = app.listen(5000);
});

afterAll(() => {
    server.close();
});

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

describe('Testes das rotas GET de reservations', () => {
    const reservationMock = {
        table_id: 2,
        costumer_name: 'duda',
        date_time: new Date().toISOString(),
    };   

    it('/reservations deve retornar uma lista de reservas (GET)', async () => {
        await request(app)
            .get('/reservations')
            .expect(200);
    });

    it('/reservations/:id deve retornar a reserva com o id passado (GET)', async () => {
        const [ idMock ] = await db('reservations').insert(reservationMock);

        const response = await request(app)
            .get(`/reservations/${idMock}`)
            .expect(200);
        
        expect(response.body.id).toBe(idMock);
    });

    it('/reservations deve retornar status 500 em caso de erro no servidor (GET)', async () => {
        jest.spyOn(Reservation, 'getReservations').mockRejectedValue(new Error('DataBase error'));

        await request(app)
            .get('/reservations')
            .expect(500);
    });

    it.each([
        {value: 'a'},
        {value: 3.14},
    ])('/reservations/:id deve retornar status 400 em caso de id $value (GET)', async (value) => {
        await request(app)
            .get(`/reservations/${value}`)
            .expect(400);
    });

    it('/reservations/:id deve retornar status 500 em caso de erro no servidor', async () => {
        jest.spyOn(Reservation, 'getReservationById').mockRejectedValue(new Error('DataBase error'));

        await request(app)
            .get('/reservations/1')
            .expect(500);
    });
});

describe('Testes das rotas POST de reservations', () => {
    it('/reservations cria nova reserva e retorna status 201 (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };

        await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(201);
    });

    it('/reservations deve retornar status 404 se mesa da reserva não existir (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        await db('tables').where({ id: table_id }).del();
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(404);
        
        expect(response.body).toBe('Table does not exists');
    });

    it('/reservations deve retornar status 409 se mesa estiver inativa (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: false,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(409);
        
        expect(response.body).toBe('Table is inactive');
    });

    it('/reservations deve retornar status 500 em caso de erro no servidor', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };

        jest.spyOn(Reservation.prototype, 'postReservation').mockRejectedValue(new Error('Database error'));

        await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(500);
    });
});