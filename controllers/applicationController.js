// controllers/applicationController.js
const { Application, Bazar, User, Notification } = require('../models');

// Apply to bazar (UMKM only)
exports.applyToBazar = async (req, res) => {
    try {
        // Validate user role
        if (req.user.role !== 'umkm') {
            return res.status(403).json({ error: 'Only UMKM can apply to bazars' });
        }

        // Validate request body
        if (!req.body.businessName || !req.body.businessDescription) {
            return res.status(400).json({ error: 'Business name and description are required' });
        }

        // Check bazar exists and is open
        const bazar = await Bazar.findByPk(req.params.bazarId);
        if (!bazar) {
            return res.status(404).json({ error: 'Bazar not found' });
        }
        if (bazar.status !== 'open') {
            return res.status(400).json({ error: 'Bazar is not open for applications' });
        }

        // Check for existing application
        const existingApplication = await Application.findOne({
            where: {
                bazarId: req.params.bazarId,
                umkmId: req.user.id
            }
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'Already applied to this bazar' });
        }

        // Create application
        const application = await Application.create({
            bazarId: req.params.bazarId,
            umkmId: req.user.id,
            businessName: req.body.businessName,
            businessDescription: req.body.businessDescription,
            status: 'pending'
        });

        // Create notification for organizer
        await Notification.create({
            userId: bazar.organizerId,
            message: `New application received from ${req.body.businessName}`,
            type: 'new_application'
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Error in applyToBazar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get applications
exports.getApplications = async (req, res) => {
    try {
        let where = {};
        
        if (req.user.role === 'umkm') {
            where.umkmId = req.user.id;
        } else if (req.user.role === 'organizer') {
            const bazar = await Bazar.findByPk(req.params.bazarId);
            if (!bazar || bazar.organizerId !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized' });
            }
            where.bazarId = req.params.bazarId;
        } else {
            return res.status(403).json({ error: 'Invalid user role' });
        }

        const applications = await Application.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                },
                {
                    model: Bazar,
                    attributes: ['name', 'startDate', 'endDate', 'status']
                }
            ]
        });

        res.json(applications);
    } catch (error) {
        console.error('Error in getApplications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
      if (!['accepted', 'rejected'].includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
  
      const application = await Application.findOne({
        where: { id: req.params.applicationId },
        include: [{
          model: Bazar,
          attributes: ['organizerId', 'name']
        }]
      });
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      if (application.Bazar.organizerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
  
      await application.update({ status: req.body.status });
  
      // Create notification for UMKM
      if (application.umkmId) {
        await Notification.create({
          userId: application.umkmId,
          message: `Your application for ${application.Bazar.name} has been ${req.body.status}`,
          type: 'application_status'
        });
      }
  
      res.json({
        message: 'Status updated successfully',
        application
      });
  
    } catch (error) {
      console.error('Error in updateApplicationStatus:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };