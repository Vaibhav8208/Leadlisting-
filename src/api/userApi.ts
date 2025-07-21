import axios from 'axios';

// The User interface remains the same. It correctly matches your backend data.
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
  leadsAssigned: number;
  leadsConverted: number;
}

// The payload for creating a new user also remains the same.
export type NewUserPayload = Omit<User, 'id' | 'joinDate' | 'leadsAssigned' | 'leadsConverted'>;

// Use your actual backend URL
// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'http://localhost:5000/api';

// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all users from your backend.
 * (No changes needed here)
 * @returns A promise that resolves to an array of User objects.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users from the server.');
  }
};

/**
 * Sends a new user's data to be created in the backend.
 * (No changes needed here)
 * @param userData The data for the new user.
 * @returns A promise that resolves to the newly created User object from the backend.
 */
export const addUser = async (userData: NewUserPayload): Promise<User> => {
  try {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add the user on the server.');
  }
};

/**
 * NEW: Sends updated user data to the backend.
 * This will be used for an "Edit User" feature.
 * @param userId The ID of the user to update.
 * @param userData The fields to update. Partial<User> means we can send only the changed fields.
 * @returns A promise that resolves to the updated User object from the backend.
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    // We send a PUT request to the specific user's endpoint, e.g., /users/3
    const response = await apiClient.put<User>(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw new Error('Failed to update the user on the server.');
  }
};

/**
 * NEW: Sends a request to delete a user from the backend.
 * @param userId The ID of the user to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    // We send a DELETE request to the specific user's endpoint, e.g., /users/3
    await apiClient.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw new Error('Failed to delete the user on the server.');
  }
};