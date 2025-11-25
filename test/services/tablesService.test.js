import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import TablesService from '../../src/services/tablesService.js';
import Table from '../../src/models/table.js';
import db from '../../src/db/dbConfig.js';

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

describe('Testando tablesService', () => {
    it('listTables deve retornar erro se a busca falhar', async () => {
        jest.spyOn(Table, 'getTables').mockRejectedValue(new Error());

        await expect(TablesService.listTables())
            .rejects
            .toThrow(Error());
    });

    it('listTablesById deve retornar erro se id não for passado', async () => {
        const idMock = 'test';

        await expect(TablesService.listTablesById(idMock))
            .rejects
            .toThrow(Error('The parameter "id" must be integer'));
    });

    it('createTable deve retornar mensagem de sucesso ao criar mesa', async () => {
        const tableMock = {
            seats: 4,
            active: true,
        };

        const response = await TablesService.createTable(tableMock);

        expect(response).toEqual(expect.objectContaining({message: 'Table created'}));
    });

    it('createTable deve retornar erro se "seats" não for passado', async () => {
        const tableMock = {
            active: true,
        };

        await expect(TablesService.createTable(tableMock))
            .rejects
            .toThrow(Error('The "seats" field is required.'));
    });

    it('createTable deve retornar erro se "active" não for passado', async () => {
        const tableMock = {
            seats: 4,
        };

        await expect(TablesService.createTable(tableMock))
            .rejects
            .toThrow(Error('The "active" field is required.'));
    });

    it('updateTable deve retornar erro se a atualização falhar', async () => {
        jest.spyOn(Table, 'patchTable').mockRejectedValue(new Error());
        const idMock = 1;

        await expect(TablesService.updateTable(idMock))
            .rejects
            .toThrow(Error());
    });

    it('deleteTable deve retornar erro se falhar', async () => {
        jest.spyOn(Table, 'deleteTable').mockRejectedValue(new Error());
        const idMock = 1;

        await expect(TablesService.deleteTable(idMock))
            .rejects
            .toThrow(Error());
    });
});