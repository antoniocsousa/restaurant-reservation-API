import express from 'express';

const routes = (app) => {
    app.route('/').get((_, res) => {
        res.status(200).send({ titulo: 'API de reserva de mesa' });
    });

    app.use(
        express.json(),
    )
}

export default routes;
