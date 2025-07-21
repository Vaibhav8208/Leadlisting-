
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Lead } from '@/types/Lead';
import { getStatusColor, getPriorityColor } from '@/utils/leadUtils';

interface LeadDetailsDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailsDialog = ({ lead, isOpen, onClose }: LeadDetailsDialogProps) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lead Details - {lead.companyName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Company Name</Label>
              <p className="text-lg">{lead.companyName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
              <p>{lead.contactPerson}</p>
            </div>

             <div>
              <Label className="text-sm font-medium text-gray-500">Phone</Label>
              <p>{lead.phone}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p>{lead.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div className="mt-1">
                <Badge className={`${getStatusColor(lead.status)}`}>
                  {lead.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Priority</Label>
              <div className="mt-1">
                <Badge className={`${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Assigned to</Label>
              <p>{lead.assignee}</p>
            </div>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-gray-500">Notes</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg">{lead.notes}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
