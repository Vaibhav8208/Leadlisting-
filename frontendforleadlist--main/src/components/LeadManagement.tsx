import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { Lead, statuses } from '@/types/Lead';
import { getAllLeads } from '@/api/leadApi';
import { filterLeads } from '@/utils/leadUtils';
import LeadForm from '@/components/LeadForm';
import LeadTable from '@/components/LeadTable';
import LeadDetailsDialog from '@/components/LeadDetailsDialog';
import CallDialog from '@/components/CallDialog'; // Import CallDialog

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // State for call dialog
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callLeadData, setCallLeadData] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getAllLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = filterLeads(leads, searchTerm, filterStatus);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setIsEditDialogOpen(false);
    setEditingLead(null);
  };

  // Open call dialog on Call button click
  const handleCallLead = (lead: Lead) => {
    setCallLeadData(lead);
    setIsCallDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Lead Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <LeadForm
              onClose={() => setIsAddDialogOpen(false)}
              onAddLead={(lead) => setLeads((prev) => [lead, ...prev])}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Table */}
      <LeadTable
        leads={filteredLeads}
        onViewLead={setSelectedLead}
        onEditLead={handleEditLead}
        onCallLead={handleCallLead} // Pass call handler here
      />

      {/* View Lead Dialog */}
      <LeadDetailsDialog
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            leadToEdit={editingLead}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingLead(null);
            }}
            onUpdateLead={handleUpdateLead}
          />
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <CallDialog
        lead={callLeadData}
        isOpen={isCallDialogOpen}
        onClose={() => {
          setIsCallDialogOpen(false);
          setCallLeadData(null);
        }}
      />
    </div>
  );
};

export default LeadManagement;
