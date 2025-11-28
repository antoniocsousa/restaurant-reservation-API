import ReservationsService from '../services/reservationsService.js';

class ReservationsController {
    static getReservations = async (req, res) => {
        try {
            const result = await ReservationsService.listReservations()

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static getReservationById = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await ReservationsService.listReservationById(id);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'The parameter "id" must be integer') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static postReservation = async (req, res) => {
        try {
            const { body } = req;

            const result = await ReservationsService.createReservation(body);

            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Table does not exists') {
                res.status(404).json(error.message);
            } else if (error.message === 'Table is inactive') {
                res.status(409).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static putReservation = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { body } = req;

            const result = await ReservationsService.updateReservation(id, body);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'The parameter "id" must be integer') {
                res.status(400).json(error.message);
            } else {
                res.status(500).json(error.message);
            }
        }
    }

    static deleteReservation = async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const result = await ReservationsService.deleteReservation(id);

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

export default ReservationsController;