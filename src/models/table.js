import db from '../db/dbConfig.js';

class Table {
    constructor({seats, active}) {
        this.seats = seats;
        this.active = active;
    }

    static async getTables() {
        return await db.select('*').from('tables');
    }

    static async getTableById(id) {
        const table = await db.select('*').from('tables').where({ id });
        return table[0];
    }

    async postTable() {
        const created = await db('tables').insert(this);
        return await Table.getTableById(created[0]);
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