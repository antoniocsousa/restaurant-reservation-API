import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll, jest } from '@jest/globals';
import app from '../../src/app.js';
import Reservation from '../../src/models/reservation.js';

let server;
beforeAll(() => {
    server = app.listen(5000);
});

afterAll(() => {
    server.close();
});

describe('Testando as rotas de reservations', () => {
    it('/reservations deve retornar uma lista de reservas (GET)', async () => {
        await request(app)
            .get('/reservations')
            .expect(200);
    });

    it('/reservations/:id deve retornar a reserva com o id passado (GET)', async () => {
        const idMock = 1;

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