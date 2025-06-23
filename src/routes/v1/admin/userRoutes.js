const express = require('express');
const UserController = require('../../../controllers/UserController');
const UserRepository = require('../../../repositories/userRepository');
const UserService = require('../../../services/userService');
const { validate, createUserSchema, validateParams, getByPkSchema } = require('../../../validators/userValidator');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: List of users
 */

router.get('/', userController.getAll);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */

router.get('/:id', validateParams(getByPkSchema), userController.getById);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Created successfully
 */

router.post('/', validate(createUserSchema), userController.create);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: User not found
 */

router.put('/:id', validateParams(getByPkSchema), userController.update);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: User not found
 */

router.delete('/:id', validateParams(getByPkSchema), userController.delete);

module.exports = router;