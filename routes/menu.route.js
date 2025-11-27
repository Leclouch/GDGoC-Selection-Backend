// routes/menuRoutes.js
import express from 'express';
const router = express.Router();
import {createMenu, getAllMenus, getMenuById, updateMenu, deleteMenu, groupByCategory, searchMenus, generateMenuAIController} from '../controllers/menuController.js';

// POST /menu - Create a new menu
router.post('/', createMenu);

router.get('/search', searchMenus)

router.get('/group-by-category', groupByCategory);

// GET /menu - Get all menus
router.get('/', getAllMenus);

// GET /menu/:id - Get one menu by ID
router.get('/:id', getMenuById);

// PUT /menu/:id - Update a menu
router.put('/:id', updateMenu);

// DELETE /menu/:id - Delete a menu
router.delete('/:id', deleteMenu);

// POST /menu/generate-ai - Generate menu using AI
router.post("/generate-ai", generateMenuAIController);



export default router;