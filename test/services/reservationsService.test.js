import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import ReservationsService from '../../src/services/reservationsService';
import Reservation from '../../src/models/reservation';
import db from '../../src/db/dbConfig';

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

describe('Testando ReservationsService', () => {
    it('ReservationsService.listReservations deve retornar erro se a busca falhar', async () => {
        jest.spyOn(Reservation, 'getReservations').mockRejectedValue(new Error());

        await expect(ReservationsService.listReservations())
            .rejects
            .toThrow(Error());
    });

    it('ReservationsService.listReservationById deve retornar erro se id não for passado', async () => {
        const idMock = 'test';

        expect(ReservationsService.listReservationById(idMock))
            .rejects
            .toThrow(Error('The parameter "id" must be integer'));
    });

    it('ReservationsService.listReservationsByDate deve retornar erro se data não for passada ou estiver no formato errado', async () => {
        await expect(ReservationsService.listReservationsByDate('19/07/2005'))
            .rejects
            .toThrow(Error('Invalid date format, expected YYYY-MM-DD')); 
    });

    it('ReservationService.createReservation deve retornar mensagem de sucesso ao criar reserva', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };

        const response = await ReservationsService.createReservation(reservationMock);

        expect(response).toEqual(expect.objectContaining({message: 'Reservation created'}));
    });

    it('ReservationService.createReservation deve retornar erro se mesa não existir', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        await db('tables').where({id: table.id}).del();
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        }; 
        
        await expect(ReservationsService.createReservation(reservationMock))
            .rejects
            .toThrow(Error('Table does not exists'));
    });

    it('ReservationService.createReservation deve retornar erro se mesa estiver inativa', async () => {
        const tableMock = {
            seats: 4,
            active: false,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };    
        
        await expect(ReservationsService.createReservation(reservationMock))
            .rejects
            .toThrow(Error('Table is inactive'));
    });

    it('ReservationService.createReservation deve retornar erro se date_time não estiver no formato ISO', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: "12/07/2025 19:00",
        };
        
        await expect(ReservationsService.createReservation(reservationMock))
            .rejects
            .toThrow(Error('The date_time must be in ISO 8601 UTC format.'));
    });

    it('ReservationService.createReservation deve retornar erro se data e hora coincidir com outra reserva', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        };
        
        await ReservationsService.createReservation(reservationMock);

        await expect(ReservationsService.createReservation(reservationMock))
            .rejects
            .toThrow(Error('There is already a reservation for that time slot'));
    });

    it('ReservationService.updateReservation deve retornar mensagem de sucesso ao atualizar reserva', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        }; 

        const [ reservation ] = await db('reservations').insert(reservationMock).returning('*');
        const reservationUpdatedMock = {
            table_id: table.id,
            costumer_name: 'antonio',
            date_time: new Date().toISOString(),
        }; 

        const response = await ReservationsService.updateReservation(reservation.id, reservationUpdatedMock)

        expect(response).toEqual(expect.objectContaining({message: 'Reservation updated'}))
    });

    it('ReservationService.updateReservation deve retornar erro se id não for inteiro', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');;
        const reservationUpdatedMock = {
            table_id: table.id,
            costumer_name: 'antonio',
            date_time: new Date().toISOString(),
        }; 
        const idMock = 'test';

        await expect(ReservationsService.updateReservation(idMock, reservationUpdatedMock))
            .rejects
            .toThrow(Error('The parameter "id" must be integer'));
    });

    it('ReservationService.deleteReservation deve retornar mensagem de sucesso ao deletar reserva', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };
        const [ table ] = await db('tables').insert(tableMock).returning('*');
        const reservationMock = {
            table_id: table.id,
            costumer_name: 'duda',
            date_time: new Date().toISOString(),
        }; 
        const [ reservation ] = await db('reservations').insert(reservationMock).returning('*');

        const response = await ReservationsService.deleteReservation(reservation.id);

        expect(response).toEqual(expect.objectContaining({message: 'Reservation deleted'}));
    });

    it('ReservationService.deleteReservation deve retornar erro se id não for inteiro', async () => {
        const idMock = 'test';

        await expect(ReservationsService.deleteReservation(idMock))
            .rejects
            .toThrow(Error('The parameter "id" must be integer'));
    });
});