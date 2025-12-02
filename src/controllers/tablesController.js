import TablesService from "../services/tablesService.js";

class TablesController {
    static listTables = async (_, res) => {
        try {
            const result = await TablesService.listTables();

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static listTablesById = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await TablesService.listTablesById(id);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'The parameter "id" must be integer') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static listAvailableTables = async (req, res) => {
        try {
            const { date } = req.query;
            const result = await TablesService.listAvailableTables(date);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Invalid date format, expected YYYY-MM-DD') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static createTable = async (req, res) => {
        try {
            const { body } = req;
            const { seats, active } = body;

            const result = await TablesService.createTable({ seats, active });

            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'The "seats" field is required.' || error.message === 'The "active" field is required.' || error.message === 'invalid data') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static updateTable = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await TablesService.updateTable(id);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'The parameter "id" must be integer') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static deleteTable = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await TablesService.deleteTable(id);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'The parameter "id" must be integer') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }
}

export default TablesController;