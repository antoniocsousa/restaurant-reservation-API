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

    it('/reservations deve retornar uma lista de reservas filtrada por data (GET)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'daniel',
            date_time: new Date().toISOString(),
        }; 
        await db('reservations').insert(reservationMock);
        const date = reservationMock.date_time.split('T')[0];

        await request(app)
            .get(`/reservations?date=${date}`)
            .expect(200);
    });

    it('/reservations/:id deve retornar a reserva com o id passado (GET)', async () => {
        const [ idMock ] = await db('reservations').insert(reservationMock);

        const response = await request(app)
            .get(`/reservations/${idMock}`)
            .expect(200);
        
        expect(response.body.id).toBe(idMock);
    });

    it('/reservations deve retornar status 400 se data estiver no formato errado', async () => {
        const dateMock = '19/07/2005';

        const response = await request(app)
            .get(`/reservations?date=${dateMock}`)
            .expect(400);
        
        expect(response.body).toBe('Invalid date format, expected YYYY-MM-DD');
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

    it('/reservations deve retornar status 400 se table_id não for passado (POST)', async () => {
        const reservationMock = {
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };   
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(400);
        
        expect(response.body).toBe('The parameter "table_id" is required.');
    });

    it('/reservations deve retornar status 400 se costumer_name não for passado (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            date_time: new Date().toISOString(),
        };   
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(400);
        
        expect(response.body).toBe('The parameter "costumer_name" is required.');
    });

    it('/reservations deve retornar status 400 se date_time não for passado (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
        };   
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(400);
        
        expect(response.body).toBe('The parameter "date_time" is required.');
    });

    it('/reservations deve retornar status 400 se date_time não estiver no formato ISO (POST)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'duda',
            date_time: '19/07/2025 19:00',
        };   
        
        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(400);
        
        expect(response.body).toBe('The date_time must be in ISO 8601 UTC format.');
    });

    it('/reservations deve retornar status 400 se data e hora coincidir com reserva ja existente', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'daniel',
            date_time: new Date().toISOString(),
        }; 
        await db('reservations').insert(reservationMock);

        const response = await request(app)
            .post('/reservations')
            .send(reservationMock)
            .expect(400);
        
        expect(response.body).toBe('There is already a reservation for that time slot');
    });

    it('/reservations deve retornar status 500 em caso de erro no servidor (POST)', async () => {
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

describe('Testes das rotas PUT de reservations', () => {
    it('/reservations/:id atualiza uma reserva e retorna status 200 (PUT)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'daniel',
            date_time: new Date().toISOString(),
        }; 

        const [ id ] = await db('reservations').insert(reservationMock);
        const reservationUpdatedMock = {
            table_id: table_id,
            costumer_name: 'antonio',
            date_time: new Date().toISOString(),
        }; 

        await request(app)
            .put(`/reservations/${id}`)
            .send(reservationUpdatedMock)
            .expect(200);
    });

    it('/reservations/:id deve retornar status 400 se id não for inteiro (PUT)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationUpdatedMock = {
            table_id: table_id,
            costumer_name: 'antonio',
            date_time: new Date().toISOString(),
        }; 
        const idMock = 'test';

        const response = await request(app)
            .put(`/reservations/${idMock}`)
            .send(reservationUpdatedMock)
            .expect(400);
        
        expect(response.body).toBe('The parameter "id" must be integer');
    });

    it('/reservations/:id deve retornar status 500 em caso de erro no servidor (PUT)', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table_id ] = await db('tables').insert(tableMock);
        const reservationMock = {
            table_id: table_id,
            costumer_name: 'carlos',
            date_time: new Date().toISOString(),
        }; 

        const [ id ] = await db('reservations').insert(reservationMock);
        const reservationUpdatedMock = {
            table_id: table_id,
            costumer_name: 'antonio',
            date_time: new Date().toISOString(),
        }; 

        jest.spyOn(Reservation, 'putReservation').mockRejectedValue(new Error('Database error'));

        await request(app)
            .put(`/reservations/${id}`)
            .send(reservationUpdatedMock)
            .expect(500);
    });
});

describe('Testes das rotas DELETE de reservations', () => {
    it('/reservations/:id deleta reserva e retorna status 200 (DELETE)', async () => {
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
        const [ id ] = await db('reservations').insert(reservationMock);

        await request(app)
        .delete(`/reservations/${id}`)
        .expect(200);
    });

    it('/reservations/:id deve retornar status 400 se id não for inteiro', async () => {
        const idMock = 'teste';

        const response = await request(app)
            .delete(`/reservations/${idMock}`)
            .expect(400);

        expect(response.body).toBe('The parameter "id" must be integer')
    });

    it('/reservations/:id deve retornar status 500 em caso de erro no servidor', async () => {
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
        const [ id ] = await db('reservations').insert(reservationMock);

        jest.spyOn(Reservation, 'deleteReservation').mockRejectedValue(new Error('Database error'));

        await request(app)
            .delete(`/reservations/${id}`)
            .expect(500);
    });
});
