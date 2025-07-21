
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Calendar, Clock, CheckCircle, AlertTriangle, Bell, Phone, Mail, Video } from 'lucide-react';

interface FollowUp {
  id: number;
  leadId: number;
  leadName: string;
  assignee: string;
  type: string;
  priority: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  notes: string;
  createdDate: string;
  completedDate?: string;
}

const FollowUpManager = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    {
      id: 1,
      leadId: 1,
      leadName: 'Acme Corp',
      assignee: 'Rahul Sharma',
      type: 'call',
      priority: 'high',
      status: 'pending',
      scheduledDate: '2024-01-18',
      scheduledTime: '10:00',
      description: 'Follow-up call to discuss proposal feedback',
      notes: 'Client requested custom pricing options',
      createdDate: '2024-01-16'
    },
    {
      id: 2,
      leadId: 2,
      leadName: 'Tech Solutions',
      assignee: 'Priya Patel',
      type: 'email',
      priority: 'medium',
      status: 'pending',
      scheduledDate: '2024-01-19',
      scheduledTime: '14:00',
      description: 'Send detailed service comparison document',
      notes: 'Include pricing for different service tiers',
      createdDate: '2024-01-17'
    },
    {
      id: 3,
      leadId: 3,
      leadName: 'Digital Dynamics',
      assignee: 'Amit Kumar',
      type: 'meeting',
      priority: 'high',
      status: 'completed',
      scheduledDate: '2024-01-17',
      scheduledTime: '16:00',
      description: 'Product demo and requirements discussion',
      notes: 'Demo went well, proceeding to contract phase',
      createdDate: '2024-01-15',
      completedDate: '2024-01-17'
    },
    {
      id: 4,
      leadId: 1,
      leadName: 'Acme Corp',
      assignee: 'Rahul Sharma',
      type: 'call',
      priority: 'medium',
      status: 'overdue',
      scheduledDate: '2024-01-16',
      scheduledTime: '11:00',
      description: 'Initial follow-up after first contact',
      notes: 'Client was interested but needed time to review',
      createdDate: '2024-01-15'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  
  const [newFollowUp, setNewFollowUp] = useState({
    leadName: '',
    assignee: '',
    type: 'call',
    priority: 'medium',
    scheduledDate: '',
    scheduledTime: '',
    description: '',
    notes: ''
  });

  const assignees = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
  const types = ['call', 'email', 'meeting', 'demo'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'completed', 'overdue', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'demo': return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = followUp.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || followUp.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || followUp.assignee === filterAssignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleAddFollowUp = () => {
    const followUp: FollowUp = {
      id: followUps.length + 1,
      leadId: Math.floor(Math.random() * 100),
      ...newFollowUp,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    // Auto-mark as overdue if scheduled date is in the past
    if (isOverdue(followUp.scheduledDate)) {
      followUp.status = 'overdue';
    }
    
    setFollowUps([followUp, ...followUps]);
    setNewFollowUp({
      leadName: '',
      assignee: '',
      type: 'call',
      priority: 'medium',
      scheduledDate: '',
      scheduledTime: '',
      description: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const markAsCompleted = (id: number) => {
    setFollowUps(followUps.map(f => 
      f.id === id 
        ? { ...f, status: 'completed', completedDate: new Date().toISOString().split('T')[0] }
        : f
    ));
  };

  const todayFollowUps = followUps.filter(f => isToday(f.scheduledDate) && f.status === 'pending').length;
  const overdueFollowUps = followUps.filter(f => f.status === 'overdue').length;
  const pendingFollowUps = followUps.filter(f => f.status === 'pending').length;
  const completedThisWeek = followUps.filter(f => {
    if (!f.completedDate) return false;
    const completedDate = new Date(f.completedDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Today's Follow-ups</p>
                <p className="text-2xl font-bold">{todayFollowUps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold">{overdueFollowUps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{pendingFollowUps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Completed (7 days)</p>
                <p className="text-2xl font-bold">{completedThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search follow-ups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {assignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Follow-up</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadName">Lead/Company Name</Label>
                <Input
                  id="leadName"
                  value={newFollowUp.leadName}
                  onChange={(e) => setNewFollowUp({...newFollowUp, leadName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign to</Label>
                <Select value={newFollowUp.assignee} onValueChange={(value) => setNewFollowUp({...newFollowUp, assignee: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map(assignee => (
                      <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Follow-up Type</Label>
                <Select value={newFollowUp.type} onValueChange={(value) => setNewFollowUp({...newFollowUp, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newFollowUp.priority} onValueChange={(value) => setNewFollowUp({...newFollowUp, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newFollowUp.scheduledDate}
                  onChange={(e) => setNewFollowUp({...newFollowUp, scheduledDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={newFollowUp.scheduledTime}
                  onChange={(e) => setNewFollowUp({...newFollowUp, scheduledTime: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newFollowUp.description}
                  onChange={(e) => setNewFollowUp({...newFollowUp, description: e.target.value})}
                  placeholder="What needs to be done in this follow-up?"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                  rows={3}
                  placeholder="Additional context or reminders..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFollowUp} className="bg-blue-600 hover:bg-blue-700">
                Schedule Follow-up
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Follow-ups Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Lead/Company</th>
                  <th className="text-left p-4 font-medium">Type & Description</th>
                  <th className="text-left p-4 font-medium">Assignee</th>
                  <th className="text-left p-4 font-medium">Scheduled</th>
                  <th className="text-left p-4 font-medium">Priority</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFollowUps.map((followUp) => (
                  <tr key={followUp.id} className={`border-b hover:bg-gray-50 ${isToday(followUp.scheduledDate) && followUp.status === 'pending' ? 'bg-blue-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-medium">{followUp.leadName}</div>
                      {isToday(followUp.scheduledDate) && followUp.status === 'pending' && (
                        <Badge variant="outline" className="text-xs mt-1 bg-blue-100 text-blue-800">
                          Due Today
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(followUp.type)}
                          <span className="font-medium text-sm">{followUp.type.charAt(0).toUpperCase() + followUp.type.slice(1)}</span>
                        </div>
                        <div className="text-sm text-gray-600">{followUp.description}</div>
                      </div>
                    </td>
                    <td className="p-4">{followUp.assignee}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {followUp.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {followUp.scheduledTime}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getPriorityColor(followUp.priority)}`}>
                        {followUp.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(followUp.status)}`}>
                        {followUp.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {followUp.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsCompleted(followUp.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
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

export default FollowUpManager;
