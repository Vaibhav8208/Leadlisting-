import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { statuses, priorities, users } from '@/types/Lead';
import { addLead, updateLead } from '@/api/leadApi';  // <-- import updateLead
import { Lead } from '@/types/Lead'; 
import { toast } from 'sonner';

interface LeadFormProps {
  onClose: () => void;
  onAddLead?: (lead: Lead) => void;
  leadToEdit?: Lead;               // <-- new prop for editing
  onUpdateLead?: (lead: Lead) => void;  // <-- callback after update
}

const LeadForm = ({ onClose, onAddLead, leadToEdit, onUpdateLead }: LeadFormProps) => {
  // Initialize form state either from leadToEdit or empty
  const [newLead, setNewLead] = useState({
    companyName: '',
    email: '',
    contactPerson: '',
    phone:'',
    assignTo: '',
    priority: 'medium',
    status: 'new',
    notes: '',
    nextFollowUp: '',
  });

  // Prefill form when leadToEdit changes
  useEffect(() => {
    if (leadToEdit) {
      setNewLead({
        companyName: leadToEdit.companyName,
        email: leadToEdit.email,
        contactPerson: leadToEdit.contactPerson,
        phone: leadToEdit.phone,
        assignTo: leadToEdit.assignee,
        priority: leadToEdit.priority,
        status: leadToEdit.status,
        notes: leadToEdit.notes || '',
        nextFollowUp: leadToEdit.nextFollowUpDate
          ? new Date(leadToEdit.nextFollowUpDate).toISOString().substring(0, 10)
          : '',
      });
    }
  }, [leadToEdit]);

  // Add new lead handler (unchanged)
  const handleAddLead = async () => {
    try {
      const payload: Omit<Lead, 'id'>= {
        companyName: newLead.companyName,
        email: newLead.email,
        contactPerson: newLead.contactPerson,
        phone:newLead.phone,
        assignee: newLead.assignTo,
        priority: newLead.priority,
        status: newLead.status,
        notes: newLead.notes || undefined,
        nextFollowUpDate: newLead.nextFollowUp
          ? new Date(newLead.nextFollowUp).toISOString()
          : undefined,
      };

      const createdLead: Lead = await addLead(payload);
      toast.success('Lead added successfully ✅');

      if (onAddLead) onAddLead(createdLead);

      resetFormAndClose();
    } catch (error: any) {
      console.error('❌ Failed to add lead:', error);
      if (error?.response?.status === 409) {
        toast.error(error.response.data.message || 'Email already exists ❗');
      } else {
        toast.error('Failed to add lead ❌.');
      }
    }
  };

  // New: Update existing lead handler
  const handleUpdateLead = async () => {
    if (!leadToEdit) return; // safety

    try {
      const payload: Lead = {
        ...leadToEdit,
        companyName: newLead.companyName,
        email: newLead.email,
        contactPerson: newLead.contactPerson,
        assignee: newLead.assignTo,
        priority: newLead.priority,
        status: newLead.status,
        notes: newLead.notes || undefined,
        nextFollowUpDate: newLead.nextFollowUp
          ? new Date(newLead.nextFollowUp).toISOString()
          : undefined,
      };

      const updatedLead: Lead = await updateLead(payload);
      toast.success('Lead updated successfully ✅');

      if (onUpdateLead) onUpdateLead(updatedLead);

      resetFormAndClose();
    } catch (error: any) {
      console.error('❌ Failed to update lead:', error);
      toast.error('Failed to update lead ❌.');
    }
  };

  // Reset form and close dialog
  const resetFormAndClose = () => {
    setNewLead({
      companyName: '',
      email: '',
      contactPerson: '',
      phone:'',
      assignTo: '',
      priority: 'medium',
      status: 'new',
      notes: '',
      nextFollowUp: '',
    });
    onClose();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Same UI as before, no changes here */}

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={newLead.companyName}
          onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          value={newLead.contactPerson}
          onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={newLead.phone}
          onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={newLead.status} onValueChange={(value) => setNewLead({ ...newLead, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={newLead.priority} onValueChange={(value) => setNewLead({ ...newLead, priority: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextFollowUp">Next Follow-up</Label>
        <Input
          id="nextFollowUp"
          type="date"
          value={newLead.nextFollowUp}
          onChange={(e) => setNewLead({ ...newLead, nextFollowUp: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignTo">Assign To</Label>
        <Select value={newLead.assignTo} onValueChange={(value) => setNewLead({ ...newLead, assignTo: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Assignee" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2 space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={newLead.notes}
          onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
        />
      </div>

      <div className="col-span-2 flex justify-end mt-4">
        <Button
          onClick={leadToEdit ? handleUpdateLead : handleAddLead}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {leadToEdit ? 'Update Lead' : 'Add Lead'}
        </Button>
      </div>
    </div>
  );
};

export default LeadForm;
