import db from "../db/dbConfig.js";

class Reservation {
    constructor({table_id, costumer_name, date_time}) {
        this.table_id = table_id;
        this.costumer_name = costumer_name;
        this.date_time = date_time;
    }

    static async getReservations() {
        return await db.select('*').from('reservations');
    }

    static async getReservationById(id) {
        const [ reservation ] = await db.select('*').from('reservations').where({ id });
        return reservation;
    }

    static async getReservationsByDate(date) {
        const reservations = await db.select('*').from('reservations').where('date_time', 'like', `${date}%`);
        return reservations;
    }

    static async findByTableAndDateTime(table_id, date_time) {
        const [ reservation ] = await db.select('*').from('reservations').where({ table_id, date_time });
        return reservation;
    }

    async postReservation() {
        const { table_id, costumer_name, date_time } = this;
        const [ created ] = await db('reservations').insert({ table_id, costumer_name, date_time });
        const [ reservation ] = await db.select('*').from('reservations').where({ id: created });
        return reservation;
    }

    static async putReservation(id, reservation) {
        await db('reservations')
            .update({...reservation})
            .where({ id });
        const [ updated ] = await db.select('*').from('reservations').where({ id });
        return updated;
    }

    static async deleteReservation(id) {
        const [ deleted ] = await db.select('*').from('reservations').where({ id });
        await db('reservations')
            .where({ id })
            .del();
        return deleted;
    }
}

export default Reservation;