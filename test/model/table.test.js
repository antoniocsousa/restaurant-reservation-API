import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import Table from '../../src/models/table';
import db from '../../src/db/dbConfig';

beforeEach(async () => {
    await db.raw('BEGIN TRANSACTION');
});

afterEach(async () => {
    await db.raw('ROLLBACK');
});

describe('Testanto Table', () => {
    const tableMock = {
        seats: 4,
        active: 1,
    };
    const table = new Table(tableMock);

    it.each([
        {expected: tableMock.seats, received: table.seats},
        {expected: tableMock.active, received: table.active},
    ])('Table deve criar uma instancia corretamente', ({expected, received}) => {
        expect(received).toBe(expected);
    });

    it('Table.getTableById deve retornar a mesa com o ID especificado', async () => {
        const id = 1;
        const table = await Table.getTableById(id);

        expect(table.id).toBe(id);
    });

    it('Table.postTable deve criar uma nova mesa', async () => {
        const created = await table.postTable();

        expect(await db.select('*').from('tables').where({id: created.id})).toBeDefined();
    });

    it('Table.patchTable deve ativar/desativar a mesa', async () => {
        const id = 1
        const result = await Table.patchTable(id);
        const [ updated ] = await db.select('*').from('tables').where({ id })

        expect(result).toStrictEqual(updated);
    });

    it('Table.deleteTable deve apagar mesa do banco de dados', async () => {
        const [ createdId ] = await db('tables').insert(tableMock);

        await Table.deleteTable(createdId);
        const [ deleted ] = await db.select('*').from('tables').where({id: createdId})

        expect(deleted).toBeUndefined();
    });
});