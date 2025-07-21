import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Clock, User, Calendar } from 'lucide-react';

import { Call, getCalls, addCall, getAllLeads } from '@/api/callApi';

// Define TypeScript interface for Call
interface Call {
  id: string;
  leadName: string;
  caller: string;
  callType: 'inbound' | 'outbound';
  duration: string;
  outcome: string;
  notes: string;
  nextAction: string;
  nextFollowUp: string;
  date: string;
}

interface Lead {
  id: number;
  companyName: string;
  contactPerson: string;
  assignee: string;
}

const CallHistory = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [filterCaller, setFilterCaller] = useState('all');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const [newCall, setNewCall] = useState({
    leadName: '',
    caller: '',
    callType: 'outbound' as 'inbound' | 'outbound',
    duration: '',
    outcome: '',
    notes: '',
    nextAction: '',
    nextFollowUp: '',
    date: new Date().toISOString().split('T')[0], // Default to 2025-07-20
  });

  // Fetch calls and leads on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callsData, leadsData] = await Promise.all([getCalls(), getAllLeads()]);
        setCalls(callsData);
        setLeads(leadsData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique callers and define possible outcomes and call types
  const callers = Array.from(new Set([...leads.map((lead) => lead.contactPerson), ...leads.map((lead) => lead.assignee), ...calls.map((call) => call.caller)]));
  const outcomes = [
    'interested',
    'not-interested',
    'qualified',
    'follow-up',
    'no-answer',
    'busy',
    'voicemail',
  ];
  const callTypes = ['inbound', 'outbound'];

  // Get badge colors based on outcome
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'interested':
        return 'bg-green-100 text-green-800';
      case 'qualified':
        return 'bg-emerald-100 text-emerald-800';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800';
      case 'not-interested':
        return 'bg-red-100 text-red-800';
      case 'no-answer':
        return 'bg-gray-100 text-gray-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'voicemail':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get badge colors based on call type
  const getCallTypeColor = (type: string) => {
    return type === 'inbound' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  // Filter calls based on search term, outcome, and caller
  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.caller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = filterOutcome === 'all' || call.outcome === filterOutcome;
    const matchesCaller = filterCaller === 'all' || call.caller === filterCaller;
    return matchesSearch && matchesOutcome && matchesCaller;
  });

  // Handle adding a new call
  const handleAddCall = async () => {
    if (!newCall.leadName || !newCall.caller || !newCall.outcome) {
      alert('Please fill in all required fields: Lead/Company Name, Caller, and Call Outcome');
      return;
    }

    try {
      const created = await addCall(newCall);
      setCalls([created, ...calls]);
      setNewCall({
        leadName: '',
        caller: '',
        callType: 'outbound',
        duration: '',
        outcome: '',
        notes: '',
        nextAction: '',
        nextFollowUp: '',
        date: new Date().toISOString().split('T')[0], // Reset to 2025-07-20
      });
      setIsAddDialogOpen(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add call';
      alert(errorMessage);
    }
  };

  // Calculate total duration of all calls
  const getTotalDuration = () => {
    return calls.reduce((total, call) => {
      const [m, s] = call.duration.split(':').map(Number);
      return total + (m * 60) + (s || 0);
    }, 0);
  };

  // Format total duration as hours and minutes
  const formatTotalDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const totalDuration = formatTotalDuration(getTotalDuration());

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 items-center">
              <Phone className="text-blue-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Total Calls</p>
                <p className="text-2xl font-bold">{calls.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 items-center">
              <Clock className="text-green-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Total Duration</p>
                <p className="text-2xl font-bold">{totalDuration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 items-center">
              <User className="text-purple-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Qualified</p>
                <p className="text-2xl font-bold">
                  {calls.filter((c) => c.outcome === 'qualified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 items-center">
              <Calendar className="text-orange-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold">
                  {calls.filter((c) => {
                    const today = new Date().toISOString().split('T')[0];
                    return c.date === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Call Button */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by lead name or caller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterOutcome} onValueChange={setFilterOutcome}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              {outcomes.map((o) => (
                <SelectItem key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCaller} onValueChange={setFilterCaller}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Caller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Callers</SelectItem>
              {callers.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Call Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) setSelectedCallId(null); // Reset on close
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Call Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Call Record</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadName">Lead/Company Name</Label>
                <Select
                  value={newCall.leadName}
                  onValueChange={(value) => setNewCall({ ...newCall, leadName: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.companyName} value={lead.companyName}>
                        {lead.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caller">Caller</Label>
                <Select
                  value={newCall.caller}
                  onValueChange={(value) => setNewCall({ ...newCall, caller: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select caller" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads
                      .filter((lead) => lead.companyName === newCall.leadName)
                      .flatMap((lead) => [
                        <SelectItem key={lead.contactPerson} value={lead.contactPerson}>
                          {lead.contactPerson}
                        </SelectItem>,
                        <SelectItem key={lead.assignee} value={lead.assignee}>
                          {lead.assignee}
                        </SelectItem>,
                      ])}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="callType">Call Type</Label>
                <Select
                  value={newCall.callType}
                  onValueChange={(value) => setNewCall({ ...newCall, callType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {callTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (mm:ss)</Label>
                <Input
                  id="duration"
                  placeholder="15:30"
                  value={newCall.duration}
                  onChange={(e) => setNewCall({ ...newCall, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Call Outcome</Label>
                <Select
                  value={newCall.outcome}
                  onValueChange={(value) => setNewCall({ ...newCall, outcome: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {outcomes.map((outcome) => (
                      <SelectItem key={outcome} value={outcome}>
                        {outcome.charAt(0).toUpperCase() + outcome.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
                <Input
                  id="nextFollowUp"
                  type="date"
                  value={newCall.nextFollowUp}
                  onChange={(e) => setNewCall({ ...newCall, nextFollowUp: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Call Notes</Label>
                <Textarea
                  id="notes"
                  value={newCall.notes}
                  onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nextAction">Next Action Required</Label>
                <Input
                  id="nextAction"
                  value={newCall.nextAction}
                  onChange={(e) => setNewCall({ ...newCall, nextAction: e.target.value })}
                  placeholder="e.g., Send proposal, Schedule demo"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCall} className="bg-blue-600 hover:bg-blue-700">
                Add Call Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Call History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Lead/Company</th>
                  <th className="text-left p-4">Caller</th>
                  <th className="text-left p-4">Type & Duration</th>
                  <th className="text-left p-4">Outcome</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Next Follow-up</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={7} className="text-center p-6 text-red-600">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredCalls.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-6">
                      No calls found
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  filteredCalls.map((call) => (
                    <tr key={call.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{call.leadName || '-'}</td>
                      <td className="p-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {call.caller}
                      </td>
                      <td className="p-4">
                        <Badge className={getCallTypeColor(call.callType)}>
                          {call.callType.charAt(0).toUpperCase() + call.callType.slice(1)}
                        </Badge>
                        <span className="ml-2 flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {call.duration || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={getOutcomeColor(call.outcome)}>
                          {call.outcome.charAt(0).toUpperCase() + call.outcome.slice(1).replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">{call.date}</td>
                      <td className="p-4">{call.nextFollowUp || '-'}</td>
                      <td className="p-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => console.log(`View ${call.id}`)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => console.log(`Follow-up ${call.id}`)}>
                          Follow-up
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallHistory;