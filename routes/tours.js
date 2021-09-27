const express = require('express');
const router = express.Router();
const {nanoid} = require('nanoid');

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *        - destination
 *        - cost
 *       properties:
 *         id:
 *           type: string
 *           description: book id
 *         destination:
 *           type: string
 *           description: The tour destination
 *         hotel:
 *           type: string
 *           description: The tour destination
 *         cost:
 *           type: string
 *           description: The tour cost
 *       example:
 *         id: lskdIdk9
 *         destination: Moskow
 *         cost: 2400
 *         hotel: 3
 *
 */

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: The tours API
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Returns the list of all the tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: The list of tours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tour'
 *
 *
 */
router.get('/', (req, res) => {
    const tours = req.app.db.get('tours');

    res.send(tours);
});

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get by id
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tour id
 *     responses:
 *       200:
 *         description: The Tour description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: The Tour was not found
 */

router.get('/:id', (req, res) => {
    const tour = req.app.db.get('tours').find({id: req.params.id}).value()

    if (!tour) {
        res.sendStatus(404);
    }
    res.send(tour);
});

/**
 * @swagger
 * /tours:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: The Tour is successfully created
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: The Tour was not created
 */
router.post('/', (req, res) => {
    try {
        const tour = {
            id: nanoid(idLength),
            ...req.body
        };
        req.app.db.get('tours').push(tour).write();

        res.send(tour);
    } catch (error) {
        res.status(500).send(error);
    }
})

/**
 * @swagger
 * /tours/{id}:
 *   put:
 *     summary: Update a tour by id
 *     tags: [Tours]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Tour id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: The Tour is successfully updated
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: The Tour was not found
 *       500:
 *         description: Server error
 */
router.put('/:id', (req, res) => {
    try {
        req.app.db.get('tours').find({id: req.params.id}).assign(req.body).write()

        res.send(req.app.db.get('tours').find({id: req.params.id}));
    } catch (error) {
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Remove a tour by id
 *     tags: [Tours]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Tour id
 *     responses:
 *       200:
 *         description: The Tour is successfully removed
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: The Tour was not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', (req, res) => {
    try {
        req.app.db.get('tours').remove({id: req.params.id}).write();

        res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error);
    }
})

module.exports = router;
