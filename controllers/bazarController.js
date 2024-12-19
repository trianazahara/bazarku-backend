// controllers/bazarController.js
const { Bazar, Application } = require('../models');

// Create Bazar (Organizer only)
exports.createBazar = async (req, res) => {
    try {
      if (req.user.role !== 'organizer') {
        return res.status(403).json({ error: 'Only organizers can create bazars' });
      }
  
      const bazar = await Bazar.create({
        ...req.body,
        organizerId: req.user.id
      });
  
      res.status(201).json(bazar);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get all bazars with filters
  exports.getBazars = async (req, res) => {
    try {
      const { status } = req.query;
      const where = {};
      
      if (status) {
        where.status = status;
      }
  
      // If user is organizer, show only their bazars
      if (req.user.role === 'organizer') {
        where.organizerId = req.user.id;
      }
  
      const bazars = await Bazar.findAll({
        where,
        include: [{
          model: User,
          attributes: ['name', 'email']
        }]
      });
  
      res.json(bazars);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Update Bazar (Organizer only)
  exports.updateBazar = async (req, res) => {
    try {
      const bazar = await Bazar.findByPk(req.params.id);
      
      if (!bazar) {
        return res.status(404).json({ error: 'Bazar not found' });
      }
  
      if (bazar.organizerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
  
      await bazar.update(req.body);
      res.json(bazar);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Delete Bazar (Organizer only)
  exports.deleteBazar = async (req, res) => {
    try {
      const bazar = await Bazar.findByPk(req.params.id);
      
      if (!bazar) {
        return res.status(404).json({ error: 'Bazar not found' });
      }
  
      if (bazar.organizerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
  
      await bazar.destroy();
      res.json({ message: 'Bazar deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
