import prisma from '../prisma.js';

export const createCall = async (callData) => {
  if (!callData.leadName || !callData.caller || !callData.outcome) {
    throw new Error('Missing required fields: leadName, caller, or outcome');
  }

  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const defaultTime = now.toISOString().split('T')[1].slice(0, 8); // HH:MM:SS

  const newCall = await prisma.callHistory.create({
    data: {
      leadName: callData.leadName,
      caller: callData.caller,
      callType: callData.callType || 'outbound',
      duration: callData.duration || '',
      outcome: callData.outcome,
      date: callData.date || defaultDate,
      time: callData.time || defaultTime,
      notes: callData.notes || '',
      nextAction: callData.nextAction || '',
      nextFollowUp: callData.nextFollowUp ? new Date(callData.nextFollowUp) : null,
    },
  });

  return newCall;
};

export const getAllCalls = async () => {
  return await prisma.callHistory.findMany({
    orderBy: { date: 'desc' },
  });
};

export const getCallById = async (id) => {
  return await prisma.callHistory.findUnique({
    where: { id: id },
  });
};

export const updateCall = async (id, updateData) => {
  return await prisma.callHistory.update({
    where: { id: id },
    data: updateData,
  });
};

export const deleteCall = async (id) => {
  await prisma.callHistory.delete({
    where: { id: id },
  });
  return true;
};

export const getAllLeads = async () => {
  return await prisma.lead.findMany({
    select: { id: true, companyName: true, contactPerson: true, assignee: true },
  });
};

export default { createCall, getAllCalls, getCallById, updateCall, deleteCall, getAllLeads };