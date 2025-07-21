import axios from 'axios';

// Interface that matches the backend call object
export interface Call {
  id: string; // Matches cuid()
  leadName: string;
  caller: string;
  callType: string;
  duration: string;       // Format: mm:ss
  outcome: string;
  date: string;           // e.g., 2025-06-25 (now date-only)
  time: string;           // e.g., 14:30 (now time-only)
  notes: string;
  nextAction: string;
  nextFollowUp: string;   // Format: yyyy-mm-dd
}

// Interface for Lead data
export interface Lead {
  id: number;
  companyName: string;
  contactPerson: string;
  assignee: string;
}

// Payload to create a new call: omit backend-generated fields
export type NewCallPayload = Omit<Call, 'id' | 'date' | 'time'>;

const API_BASE_URL = 'http://localhost:5000/api'; // Matches your server

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all call records from the backend
 */
export const getCalls = async (): Promise<Call[]> => {
  try {
    const response = await apiClient.get<Call[]>('/calls');
    return response.data;
  } catch (error) {
    console.error('Error fetching calls:', error);
    throw new Error('Failed to fetch call records.');
  }
};

/**
 * Add a new call record to the backend
 */
export const addCall = async (callData: NewCallPayload): Promise<Call> => {
  try {
    const response = await apiClient.post<Call>('/calls', callData);
    return response.data;
  } catch (error) {
    console.error('Error adding call:', error);
    throw new Error('Failed to add call.');
  }
};

/**
 * Update a specific call record by ID
 */
export const updateCall = async (callId: string, callData: Partial<Call>): Promise<Call> => {
  try {
    const response = await apiClient.put<Call>(`/calls/${callId}`, callData);
    return response.data;
  } catch (error) {
    console.error(`Error updating call ${callId}:`, error);
    throw new Error('Failed to update call.');
  }
};

/**
 * Delete a specific call record by ID
 */
export const deleteCall = async (callId: string): Promise<void> => {
  try {
    await apiClient.delete(`/calls/${callId}`);
  } catch (error) {
    console.error(`Error deleting call ${callId}:`, error);
    throw new Error('Failed to delete call.');
  }
};

/**
 * Get all leads from the backend
 */
export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<Lead[]>('/leads');
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads.');
  }
};

export default { getCalls, addCall, updateCall, deleteCall, getAllLeads };