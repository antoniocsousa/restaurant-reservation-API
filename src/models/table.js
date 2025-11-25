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
        const [ created ] = await db('tables').insert({ seats, active });
        const [ table ] = await db.select('*').from('tables').where({ id: created });
        return table;
    }

    static async patchTable(id) {
        const table = await Table.getTableById(id);
        await db('tables').update({
            active: !table.active,
        }).where({ id });
        return await Table.getTableById(id);
    }

    static async deleteTable(id) {
        const deleted = Table.getTableById(id);
        await db('tables')
            .where({ id })
            .del();
        return deleted;
    }
}

export default Table;