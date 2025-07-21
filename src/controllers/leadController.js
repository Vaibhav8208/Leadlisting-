import * as LeadServices from '../services/lead.service.js';

// Controller to create a new user
export const createUser = async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData.companyName || !leadData.email ) {
      return res.status(400).json({ message: 'companyName, email are required' });
    }

    const newLead = await LeadServices.createLead(leadData);
    res.status(201).json(newLead);

  } catch (error) {
    console.error('Error creating Lead:', error);
    res.status(500).json({ message: 'Server error while creating Lead' });
  }
};

// ✅ Add this in lead.controller.js

export const getAllLeads = async (req, res) => {
  try {
    const leads = await LeadServices.getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error while fetching leads' });
  }
};



export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const leadData = req.body;
    const updated = await LeadServices.updateLead(Number(id), leadData);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
};

