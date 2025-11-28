import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import Reservation from "../../src/models/reservation.js";
import db from '../../src/db/dbConfig.js';

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

describe('Testando Reservation', () => {
    const reservationMock = {
        table_id: 2,
        costumer_name: 'Antonio',
        date_time: new Date().toISOString(),
    }
    const reservation = new Reservation(reservationMock);

    it.each([
        {expected: reservationMock.table_id, received: reservation.table_id},
        {expected: reservationMock.costumer_name, received: reservation.costumer_name},
        {expected: reservationMock.date_time, received: reservation.date_time},
    ])('Reservation deve criar uma instância corretamente', ({expected, received}) => {
        expect(received).toBe(expected);
    });

    it('Reservation.getReservationById deve retornar a reserva com o ID especificado', async () => {
        const [ idMock ] = await db('reservations').insert(reservationMock);
        const response = await Reservation.getReservationById(idMock);

        expect(response.id).toBe(idMock);
    });

    it('Reservation.postReservation deve criar uma nova reserva', async () => {
        const created = await reservation.postReservation();

        expect(await db.select('*').from('reservations').where({ id: created.id })).toBeDefined();
    });

    it('Reservation.putReservation deve atualizar uma reserva', async () => {
        const [ createdId ] = await db('reservations').insert(reservationMock);

        const updated = await Reservation.putReservation(createdId, { costumer_name: 'duda' });

        expect(updated.costumer_name).not.toBe(reservationMock.costumer_name);
    });

    it('Reservation.deleteReservation deve apagar uma reserva', async () => {
        const [ createdId ] = await db('reservations').insert(reservationMock);

        await Reservation.deleteReservation(createdId);
        const [ deleted ] = await db.select('*').from('reservations').where({id: createdId})

        expect(deleted).toBeUndefined();
    });
});