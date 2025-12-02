import Reservation from '../models/reservation.js';
import Table from '../models/table.js';

class ReservationsService {
    static async listReservations() {
        try {
            const reservations = await Reservation.getReservations();
            return reservations
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async listReservationById(id) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const reservation = await Reservation.getReservationById(id);
            return reservation;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async listReservationsByDate(date) {
        try {
            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                throw new Error('Invalid date format, expected YYYY-MM-DD');
            }

            const reservations = await Reservation.getReservationsByDate(date);
            return reservations;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async createReservation(body) {
        try {
            const tables = await Table.getTables();
            const [ table ] = tables.filter(table => table.id === body.table_id);

            if (!body.table_id) {
                throw new Error('The parameter "table_id" is required.');
            } else if (!body.costumer_name) {
                throw new Error('The parameter "costumer_name" is required.');
            } else if (!body.date_time) {
                throw new Error('The parameter "date_time" is required.');
            }

            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
            if (!isoRegex.test(body.date_time)) {
                throw new Error('The date_time must be in ISO 8601 UTC format.');
            }

            if (table === undefined) {
                throw new Error('Table does not exists');
            } else if (!table.active) {
                throw new Error('Table is inactive');
            }

            const reservationExists = await Reservation.findByTableAndDateTime(body.table_id, body.date_time);
            if (reservationExists) {
                throw new Error('There is already a reservation for that time slot');
            }

            const reservation = new Reservation(body);
            const response = await reservation.postReservation();

            return {message: 'Reservation created', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateReservation(id, body) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const response = await Reservation.putReservation(id, body);

            return {message: 'Reservation updated', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteReservation(id) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const response = await Reservation.deleteReservation(id);

            return {message: 'Reservation deleted', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ReservationsService;