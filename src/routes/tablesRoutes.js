import express from 'express';
import TablesController from "../controllers/tablesController.js";

const router = express.Router();

router
    .get('/tables', TablesController.listTables)
    .get('/tables/:id', TablesController.listTablesById)
    .post('/tables', TablesController.createTable)
    .patch('/tables/:id', TablesController.updateTable)
    .delete('/tables/:id', TablesController.deleteTable);

export default router;