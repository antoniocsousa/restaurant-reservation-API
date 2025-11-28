import express from 'express';
import ReservationsController from '../controllers/reservationsController.js';

const router = express.Router();

router
    .get('/reservations', ReservationsController.getReservations)
    .get('/reservations/:id', ReservationsController.getReservationById)
    .post('/reservations', ReservationsController.postReservation)
    .put('/reservations/:id', ReservationsController.putReservation)
    .delete('/reservations/:id', ReservationsController.deleteReservation);

export default router;
