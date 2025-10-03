import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import {
  User,
  Mail,
  Tag,
  Shield,
  Settings,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { ref, set, get } from 'firebase/database';
import { realtimeDb } from '@/lib/firebase';
import { useIssuesStore } from '@/store/issues';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [profileStats, setProfileStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const { issues } = useIssuesStore();

  if (!user) return null;

  // Only show department if user is a department head
  const isDepartmentHead = user.role !== "admin" && !!user.department;

  // Fetch department head's issues and activity
  useEffect(() => {
    if (!isDepartmentHead) return;

    // Filter issues for this department head
    const deptIssues = issues.filter(
      issue => issue.category === user.department
    );

    // Stats
    const managed = deptIssues.length;
    const active = deptIssues.filter(i => i.status && i.status.toLowerCase() !== 'resolved').length;
    const resolved = deptIssues.filter(i => i.status && i.status.toLowerCase() === 'resolved').length;
    const successRate = managed ? Math.round((resolved / managed) * 100) : 0;

    setProfileStats([
      { label: 'Issues Managed', value: managed, icon: CheckCircle, color: 'text-green-500' },
      { label: 'Active Cases', value: active, icon: Clock, color: 'text-yellow-500' },
      { label: 'Success Rate', value: `${successRate}%`, icon: CheckCircle, color: 'text-green-500' }
    ]);

    // Recent activity (last 5 issues, sorted by date)
    const sorted = [...deptIssues]
      .filter(i => i.dateTime)
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      .slice(0, 5);

    setRecentActivity(sorted.map(issue => ({
      action: `Issue #${issue.complaintId || issue.id} - ${issue.status}`,
      time: issue.dateTime ? new Date(issue.dateTime).toLocaleString() : '',
      type: issue.status && issue.status.toLowerCase() === 'resolved'
        ? 'resolution'
        : issue.status && issue.status.toLowerCase() === 'assigned'
        ? 'assignment'
        : issue.status && issue.status.toLowerCase() === 'created'
        ? 'creation'
        : 'update'
    })));
  }, [issues, user, isDepartmentHead]);

  // Refetch user data after password update
  const refetchUserData = async () => {
    if (!user?.department || !user?.headId) return;
    const headRef = ref(realtimeDb, `department_heads/${user.department}/${user.headId}`);
    const snap = await get(headRef);
    if (snap.exists()) {
      setUser(snap.val()); // Update user in auth store
    }
  };

  // Update password in Firebase with current password check
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    // Check current password
    if (currentPassword !== user.password) {
      setEditError("Current password is incorrect.");
      setEditLoading(false);
      return;
    }
    // Check new password match
    if (newPassword !== repeatPassword) {
      setEditError("New passwords do not match.");
      setEditLoading(false);
      return;
    }

    try {
      const deptNode = user.department;
      const headId = user.headId;
      if (!deptNode || !headId) {
        setEditError("Department or Head ID missing.");
        setEditLoading(false);
        return;
      }
      const headRef = ref(realtimeDb, `department_heads/${deptNode}/${headId}/password`);
      await set(headRef, newPassword);
      setEditSuccess("Password updated successfully!");
      await refetchUserData(); // Refetch user data after update
      setEditLoading(false);
      setEditOpen(false);
    } catch (err) {
      setEditError("Failed to update password.");
      setEditLoading(false);
    }
  };

  const permissionColor = (granted) => granted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-sidebar min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Profile & Account Settings</h3>
          {isDepartmentHead && (
            <Button
              variant="outline"
              className="rounded-full px-5 py-2 shadow hover:shadow-md transition"
              onClick={() => setEditOpen(true)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Edit Profile Modal */}
        {editOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
              <div className="mb-6 space-y-2 text-gray-700 text-base">
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-semibold">Department:</span> {user.department}
                </div>
                <div>
                  <span className="font-semibold">Head ID:</span> {user.headId}
                </div>
              </div>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500"
                      onClick={() => setShowCurrent((v) => !v)}
                      tabIndex={-1}
                    >
                      {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500"
                      onClick={() => setShowNew((v) => !v)}
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Repeat Password</label>
                  <div className="relative">
                    <input
                      type={showRepeat ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10"
                      value={repeatPassword}
                      onChange={e => setRepeatPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500"
                      onClick={() => setShowRepeat((v) => !v)}
                      tabIndex={-1}
                    >
                      {showRepeat ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {/* Show only one warning at a time */}
                {editError ? (
                  <div className="text-red-600 text-sm">{editError}</div>
                ) : currentPassword && currentPassword !== user.password ? (
                  <div className="text-red-600 text-xs mt-1">Current password is incorrect.</div>
                ) : newPassword && repeatPassword && newPassword !== repeatPassword ? (
                  <div className="text-red-600 text-xs mt-1">New password and repeat password do not match.</div>
                ) : null}
                {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      editLoading ||
                      (currentPassword && currentPassword !== user.password) ||
                      (newPassword && repeatPassword && newPassword !== repeatPassword)
                    }
                  >
                    {editLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all border-0 bg-[#f6f6f6]">
            <CardHeader className="flex flex-col items-center pt-8 pb-4">
              <Avatar className="h-28 w-28 mb-4 shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name || "User"} />
                <AvatarFallback className="text-3xl">
                  {(user.name && user.name.charAt(0)) || (user.email && user.email.charAt(0)) || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold text-gray-900">{user.name || user.email || "User"}</CardTitle>
              {user.role === "admin" ? (
                <Badge variant="secondary" className="mt-2 px-3 py-1 rounded-full text-base">
                  <Shield className="h-4 w-4 mr-1" />
                  Administrator
                </Badge>
              ) : (
                <Badge variant="secondary" className="mt-2 px-3 py-1 rounded-full text-base">
                  <Shield className="h-4 w-4 mr-1" />
                  {user.department} Department Head
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-8">
              <div className="flex items-center gap-3 text-base text-gray-700">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>{user.email}</span>
              </div>
              {isDepartmentHead && (
                <div className="flex items-center gap-3 text-base text-gray-700">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Department: {user.department}</span>
                </div>
              )}
              {isDepartmentHead && (
                <div className="flex items-center gap-3 text-base text-gray-700">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <span>Head ID: {user.headId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="rounded-2xl shadow-lg border-0 bg-[#f6f6f6]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Performance Metrics</CardTitle>
              <CardDescription className="text-base text-gray-500">Your recent activity summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {profileStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-gray-800">{stat.value}</span>
                    <span className="block text-sm text-gray-500">{stat.label}</span>
                  </div>
                  {stat.label === 'Success Rate' && (
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: stat.value }} />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Access Permissions */}
          <Card className="rounded-2xl shadow-lg border-0 bg-[#f6f6f6]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Access Permissions</CardTitle>
              <CardDescription className="text-base text-gray-500">Your current system permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[ 
                  { label: 'View All Issues', granted: true },
                  { label: 'Assign Workers', granted: true },
                  { label: 'Update Issue Status', granted: true },
                  { label: 'View Analytics', granted: true },
                  { label: 'Manage Users', granted: true },
                  { label: 'System Configuration', granted: true }
                ].map((perm, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-3 rounded-xl shadow-sm ${permissionColor(perm.granted)}`}>
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">{perm.label}</span>
                    <Badge variant="outline" className={`ml-auto text-xs ${perm.granted ? 'border-green-500 text-green-700' : 'border-gray-400 text-gray-500'}`}>
                      {perm.granted ? 'Granted' : 'Denied'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        <Card className="rounded-2xl shadow-lg border-0 bg-[#f6f6f6] mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-base text-gray-500">Your latest actions and system interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full"></div>
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 mb-8 relative">
                  <div className="absolute left-0 top-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shadow">
                      {activity.type === 'resolution' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.type === 'assignment' && <User className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'update' && <Settings className="h-4 w-4 text-yellow-600" />}
                      {activity.type === 'creation' && <Calendar className="h-4 w-4 text-purple-600" />}
                    </div>
                  </div>
                  <div className="ml-8">
                    <p className="text-base font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}