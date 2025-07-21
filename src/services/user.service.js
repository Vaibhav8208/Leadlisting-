// src/services/user.service.js
import prisma from '../prisma.js';


// Get all users (with optional filters)
export const getAllUsers = async (filters = {}) => {
  const where = {};

  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: 'insensitive' } },
      { email: { contains: filters.searchTerm, mode: 'insensitive' } }
    ];
  }

  if (filters.role && filters.role !== 'all') {
    where.role = filters.role;
  }

  return await prisma.user.findMany({
    where,
    orderBy: { id: 'asc' },
  });
};

// Get a single user by ID
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

// Create a new user
export const createUser = async (userData) => {
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      department: userData.department,
      status: userData.status,
      leadsAssigned: 0,
      leadsConverted: 0,
    },
  });
  return newUser;
};

// Update user
export const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
};

// Delete user
export const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  return true;
};

// Get summary stats (if needed on dashboard)
export const getUserStats = async () => {
  const [totalUsers, activeUsers, teamLeads, salesExecutives] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'active' } }),
    prisma.user.count({ where: { role: 'Team Lead' } }),
    prisma.user.count({ where: { role: { contains: 'Sales Executive' } } }),
  ]);

  return { totalUsers, activeUsers, teamLeads, salesExecutives };
};
