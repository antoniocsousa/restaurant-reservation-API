import Table from '../models/table.js';

class TablesService {
    static async listTables() {
        try {
            const tables = await Table.getTables();
            return tables;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    static async listTablesById(id) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const table = await Table.getTableById(id);
            return table;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    static async createTable(body) {
        try {
            if (body.seats === undefined) {
                throw new Error('The "seats" field is required.');
            } else if (body.active === undefined) {
                throw new Error('The "active" field is required.');
            }
            
            const table = new Table(body);
            const response = await table.postTable();

            return {message: 'Table created', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateTable(id) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const response = await Table.patchTable(id);

            return {message: 'Table updated', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteTable(id) {
        try {
            if (!Number.isInteger(id)) {
                throw new Error('The parameter "id" must be integer');
            }

            const response = await Table.deleteTable(id);

            return {message: 'Table deleted', content: response};
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default TablesService;