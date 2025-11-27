import Menu from '../models/menu.model.js'
import { generateMenuAI } from "../services/gemini.service.js";

// CREATE - POST /menu
const createMenu = async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const saved = await newMenu.save();
    res.status(201).json({
      message: 'Menu created successfully',
      data: saved,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create menu',
      error: error.message,
    });
  }
};

// READ ALL - GET /menu
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({
      data: menus,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch menus',
      error: error.message,
    });
  }
};

// SEARCH - GET /menu/search
const searchMenus = async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const skip = (page - 1) * perPage;

    const searchRegex = new RegExp(query, 'i');
    const results = await Menu.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    })
      .skip(skip)
      .limit(perPage);

    const total = await Menu.countDocuments({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    });

    res.status(200).json({
      data: results,
      pagination: {
        total,
        page,
        per_page: perPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to search menus',
      error: error.message,
    });
  }
};

// GROUP BY CATEGORY - GET /menu/group-by-category
const groupByCategory = async (req, res) => {
  try {
    const mode = req.query.mode;
    const perCategory = parseInt(req.query.per_category) || 10;

    if (mode === 'count') {
      const grouped = await Menu.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const data = {};
      grouped.forEach((item) => {
        data[item._id] = item.count;
      });

      res.status(200).json({ data });
    } else if (mode === 'list') {
      const menus = await Menu.find().sort({ category: 1 });

      const data = {};
      menus.forEach((menu) => {
        if (!data[menu.category]) {
          data[menu.category] = [];
        }
        if (data[menu.category].length < perCategory) {
          data[menu.category].push(menu);
        }
      });

      res.status(200).json({ data });
    } else {
      res.status(400).json({
        message: 'Invalid mode parameter. Use "count" or "list"',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to group menus by category',
      error: error.message,
    });
  }
};

// READ ONE - GET /menu/:id
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({
        message: 'Menu not found',
      });
    }
    res.status(200).json({
      data: menu,
    });
  } catch (error) {

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Menu not found',
      });
    }
    res.status(500).json({
      message: 'Failed to fetch menu',
      error: error.message,
    });
  }
};

// UPDATE - PUT /menu/:id
const updateMenu = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        message: 'Menu not found',
      });
    }
    res.status(200).json({
      message: 'Menu updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update menu',
      error: error.message,
    });
  }
};

// DELETE - DELETE /menu/:id
const deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        message: 'Menu not found',
      });
    }
    res.status(200).json({
      message: 'Menu deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete menu',
      error: error.message,
    });
  }
};

const generateMenuAIController = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category required" });
    }

    const aiMenu = await generateMenuAI(category);

    return res.json({ data: aiMenu });
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ 
      error: "AI generation failed",
      details: err.message 
    });
  }
};

export { createMenu, getAllMenus, searchMenus, groupByCategory, getMenuById, updateMenu, deleteMenu, generateMenuAIController };