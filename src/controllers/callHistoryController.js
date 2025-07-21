// src/controllers/callHistoryController.js
import * as CallService from '../services/callHistory.service.js';

// ✅ Get all call records
export const getAllCalls = async (req, res) => {
  try {
    const filters = req.query;
    const calls = await CallService.getAllCalls(filters);
    res.status(200).json(calls);
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ message: 'Server error while fetching calls' });
  }
};

// ✅ Get call by ID
export const getCallById = async (req, res) => {
  try {
    const call = await CallService.getCallById(req.params.id);
    if (call) {
      res.status(200).json(call);
    } else {
      res.status(404).json({ message: 'Call record not found' });
    }
  } catch (error) {
    console.error('Error fetching call by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create new call
export const createCall = async (req, res) => {
  try {
    const callData = req.body;
    const now = new Date();

    // Add default date and time if not provided
    const newCallData = {
      ...callData,
      date: now.toISOString().split('T')[0], // yyyy-mm-dd
      time: now.toISOString().split('T')[1].split('.')[0], // hh:mm:ss
    };

    const created = await CallService.createCall(newCallData);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating call:', error);
    res.status(500).json({ message: 'Server error while creating call' });
  }
};

// ✅ Update call
export const updateCall = async (req, res) => {
  try {
    const callId = req.params.id;
    const updateData = req.body;
    const updatedCall = await CallService.updateCall(callId, updateData);

    if (updatedCall) {
      res.status(200).json(updatedCall);
    } else {
      res.status(404).json({ message: 'Call record not found' });
    }
  } catch (error) {
    console.error('Error updating call:', error);
    res.status(500).json({ message: 'Server error while updating call' });
  }
};

// ✅ Delete call
export const deleteCall = async (req, res) => {
  try {
    const callId = req.params.id;
    const success = await CallService.deleteCall(callId);

    if (success) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'Call record not found' });
    }
  } catch (error) {
    console.error('Error deleting call:', error);
    res.status(500).json({ message: 'Server error while deleting call' });
  }
};
