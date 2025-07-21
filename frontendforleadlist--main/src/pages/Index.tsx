
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Phone, Calendar, TrendingUp, Bell } from 'lucide-react';
import LeadManagement from '@/components/LeadManagement';
import UserManagement from '@/components/UserManagement';
import CallHistory from '@/components/CallHistory';
import FollowUpManager from '@/components/FollowUpManager';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for dashboard stats
  const stats = {
    totalLeads: 156,
    newLeads: 23,
    todayFollowUps: 8,
    activeCalls: 12,
    conversionRate: 24.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lead Manager Pro</h1>
                <p className="text-sm text-gray-500">IT Company Lead Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {stats.todayFollowUps} Follow-ups Today
              </Badge>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call History
            </TabsTrigger>
            <TabsTrigger value="followups" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-ups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="calls">
            <CallHistory />
          </TabsContent>

          <TabsContent value="followups">
            <FollowUpManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
