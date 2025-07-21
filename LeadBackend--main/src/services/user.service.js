import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Get all users with optional filtering
export const getAllUsers = async (filters) => {
  const where = {};

  if (filters.role) {
    where.role = filters.role;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: 'desc' // Make sure `createdAt` exists in your model
    },
  });

  return users;
};

// ✅ Get a user by ID
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

// ✅ Create a user
export const createUser = async (userData) => {
  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      department: userData.department || 'General',
      status: userData.status || 'active',   // ✅ Include status
    },
  });
};


// ✅ Update user by ID
export const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
};


// ✅ Delete user by ID
export const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  return true;
};
