import db from '../db/dbConfig.js';

class Table {
    constructor({ seats, active }) {
        this.seats = seats;
        this.active = active;
    }

    static async getTables() {
        return await db.select('*').from('tables');
    }

    static async getTableById(id) {
        const [ table ] = await db.select('*').from('tables').where({ id });
        return table;
    }

    async postTable() {
        const { seats, active } = this;
        const [ created ] = await db('tables').insert({ seats, active }).returning('*');
        return created;
    }

    static async patchTable(id) {
        const [ table ] = await db.select('*').from('tables').where({ id });
        await db('tables').update({
            active: !table.active,
        }).where({ id });
        const [ updated ] = await db.select('*').from('tables').where({ id });
        return updated;
    }

    static async deleteTable(id) {
        const [ deleted ] = await db.select('*').from('tables').where({ id });
        await db('tables')
            .where({ id })
            .del();
        return deleted;
    }
}

export default Table;