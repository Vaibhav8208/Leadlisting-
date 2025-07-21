import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Mail, Phone, Shield, Users } from 'lucide-react';

// Import everything from your new API file
import { User, NewUserPayload, getUsers, addUser } from '@/api/userApi';

const UserManagement = () => {
  // State for data, loading, and errors
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state for adding a new user
  const [newUser, setNewUser] = useState<NewUserPayload>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Sales',
    status: 'active'
  });

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getUsers();
        setUsers(data);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUsers();
  }, []); // The empty dependency array means this effect runs only once on mount

  const roles = ['Sales Executive', 'Senior Sales Executive', 'Team Lead', 'Sales Manager', 'Admin'];
  const departments = ['Sales', 'Marketing', 'Support', 'Admin'];
  const statuses = ['active', 'inactive', 'on-leave'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Sales Manager': return 'bg-blue-100 text-blue-800';
      case 'Team Lead': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Updated to be async and call the API
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill in required fields: Name, Email, and Role.');
      return;
    }
    try {
      const addedUser = await addUser(newUser);
      setUsers(prevUsers => [...prevUsers, addedUser]); // Add user returned from API to state
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: 'Sales',
        status: 'active'
      });
      setIsAddDialogOpen(false);
    } catch (apiError: any) {
      console.error("Failed to add user:", apiError);
      alert(apiError.message || "Could not add user. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Team Leads</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'Team Lead').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Sales Executives</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role.includes('Sales Executive')).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>{roles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(status => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Performance</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="text-center p-8 text-gray-500">Loading users...</td></tr>
                )}
                {error && (
                   <tr><td colSpan={7} className="text-center p-8 text-red-600 font-medium">{error}</td></tr>
                )}
                {!loading && !error && filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">Joined: {user.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{user.email}</div>
                        <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{user.phone}</div>
                      </div>
                    </td>
                    <td className="p-4"><Badge className={`${getRoleColor(user.role)}`}>{user.role}</Badge></td>
                    <td className="p-4">{user.department}</td>
                    <td className="p-4"><Badge className={`${getStatusColor(user.status)}`}>{user.status}</Badge></td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm"><span className="font-medium">{user.leadsAssigned}</span> leads assigned</div>
                        <div className="text-sm"><span className="font-medium text-green-600">{user.leadsConverted}</span> converted</div>
                        <div className="text-xs text-gray-500">
                          {user.leadsAssigned > 0 ? Math.round((user.leadsConverted / user.leadsAssigned) * 100) : 0}% conversion rate
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline"><Shield className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>User Details - {selectedUser.name}</DialogTitle></DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><Label className="text-sm font-medium text-gray-500">Email</Label><p>{selectedUser.email}</p></div>
                  <div><Label className="text-sm font-medium text-gray-500">Phone</Label><p>{selectedUser.phone}</p></div>
                  <div><Label className="text-sm font-medium text-gray-500">Department</Label><p>{selectedUser.department}</p></div>
                </div>
                <div className="space-y-4">
                  <div><Label className="text-sm font-medium text-gray-500">Status</Label><div className="mt-1"><Badge className={`${getStatusColor(selectedUser.status)}`}>{selectedUser.status}</Badge></div></div>
                  <div><Label className="text-sm font-medium text-gray-500">Join Date</Label><p>{selectedUser.joinDate}</p></div>
                  <div><Label className="text-sm font-medium text-gray-500">Role</Label><div className="mt-1"><Badge className={`${getRoleColor(selectedUser.role)}`}>{selectedUser.role}</Badge></div></div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedUser.leadsAssigned}</p>
                    <p className="text-sm text-gray-500">Leads Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedUser.leadsConverted}</p>
                    <p className="text-sm text-gray-500">Leads Converted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedUser.leadsAssigned > 0 ? Math.round((selectedUser.leadsConverted / selectedUser.leadsAssigned) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;