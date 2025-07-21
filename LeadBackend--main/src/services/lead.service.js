import prisma from '../prisma.js';

export const createLead = async (leadData) => {
  const newLead = await prisma.lead.create({
    data: {
      companyName: leadData.companyName,
      email: leadData.email,
      contactPerson: leadData.contactPerson,
      phone: leadData.phone,
      assignee: leadData.assignee, 
      priority: leadData.priority,
      status: leadData.status,
      notes: leadData.notes,
      nextFollowUpDate: leadData.nextFollowUpDate
        ? new Date(leadData.nextFollowUpDate) // ✅ Convert string to Date
        : null,
    },
  });
  return newLead;
};

// ✅ Add this in lead.service.js

export const getAllLeads = async () => {
  return prisma.lead.findMany({
    orderBy: { id: 'desc' }, // optional: shows latest first
  });
};


export const updateLead = async (id, leadData) => {
  return await prisma.lead.update({
    where: { id },
    data: {
      companyName: leadData.companyName,
      email: leadData.email,
      contactPerson: leadData.contactPerson,
      phone:leadData.phone,
      assignee: leadData.assignee,
      priority: leadData.priority,
      status: leadData.status,
      notes: leadData.notes,
      nextFollowUpDate: leadData.nextFollowUpDate
        ? new Date(leadData.nextFollowUpDate)
        : null,
    },
  });
};
