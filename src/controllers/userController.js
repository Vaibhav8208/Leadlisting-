// backend/src/controllers/userController.js
import * as UserService from '../services/user.service.js';

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = await UserService.getAllUsers(filters);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Controller to get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to create a new user
export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.name || !userData.email || !userData.role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    const newUser = await UserService.createUser(userData);
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// Controller to update a user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await UserService.updateUser(userId, updateData);

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Controller to delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const success = await UserService.deleteUser(userId);

    if (success) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
