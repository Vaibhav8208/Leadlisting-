import axios from 'axios';
import { Lead,NewLead } from '@/types/Lead'; // ✅ Use shared type from types folder

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addLead = async (leadData: Omit<Lead, 'id'>): Promise<Lead> => {
  try {
    const response = await apiClient.post<Lead>('/leads', leadData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding lead:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to add lead.');
  }
};

export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<Lead[]>('/leads');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads');
  }
};
// api/leadApi.ts
export async function updateLead(lead: Lead): Promise<Lead> {
  const response = await fetch(`http://localhost:5000/api/leads/${lead.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error('Failed to update lead');
  return await response.json();
}

