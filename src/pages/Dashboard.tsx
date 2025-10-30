import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useHolidays } from '@/contexts/HolidaysContext';
import { useBlog } from '@/contexts/BlogContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, CalendarCheck, Clock, Calendar, FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveBalance } = useAttendance();
  const { holidays, addHoliday, deleteHoliday } = useHolidays();
  const { posts, addPost, deletePost } = useBlog();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', description: '' });
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const userLeaves = leaveRequests.filter(req => req.userId === user?.id);
  const approvedLeaves = userLeaves.filter(req => req.status === 'approved');
  const usedLeaves = approvedLeaves.reduce((acc, req) => {
    const from = new Date(req.fromDate);
    const to = new Date(req.toDate);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return acc + days;
  }, 0);
  const remainingLeaves = leaveBalance - usedLeaves;

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    addHoliday(newHoliday);
    setNewHoliday({ name: '', date: '', description: '' });
    setIsHolidayDialogOpen(false);
    toast({ title: 'Success', description: 'Holiday added successfully' });
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    addPost({ ...newPost, author: user?.email?.split('@')[0] || 'User', authorEmail: user?.email || '' });
    setNewPost({ title: '', content: '' });
    setIsPostDialogOpen(false);
    toast({ title: 'Success', description: 'Post published successfully' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          <>
            <DashboardCard title="System Overview" description="Quick statistics" icon={Users}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Employees:</span>
                  <span className="font-bold text-foreground">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Present Today:</span>
                  <span className="font-bold text-green-600">20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Leaves:</span>
                  <span className="font-bold text-primary">3</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Attendance Summary" description="Today's attendance" icon={CalendarCheck}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On Time:</span>
                  <span className="font-bold text-green-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Late:</span>
                  <span className="font-bold text-amber-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Absent:</span>
                  <span className="font-bold text-destructive">4</span>
                </div>
              </div>
            </DashboardCard>
          </>
        ) : (
          <DashboardCard title="Leave Balance" description="Your annual leave status" icon={Calendar}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Leaves:</span>
                <span className="font-bold text-foreground">{leaveBalance} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Used:</span>
                <span className="font-bold text-amber-600">{usedLeaves} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-bold text-green-600">{remainingLeaves} days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(usedLeaves / leaveBalance) * 100}%` }} />
              </div>
            </div>
          </DashboardCard>
        )}

        <DashboardCard title="Your Profile" description="Account information" icon={Users}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Holidays Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Company Holidays 2025</CardTitle>
            </div>
            {isAdmin && (
              <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Holiday</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Holiday</DialogTitle>
                    <DialogDescription>Add a new company holiday to the calendar</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="holiday-name">Holiday Name</Label>
                      <Input id="holiday-name" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} placeholder="e.g., Christmas" />
                    </div>
                    <div>
                      <Label htmlFor="holiday-date">Date</Label>
                      <Input id="holiday-date" type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="holiday-description">Description (optional)</Label>
                      <Input id="holiday-description" value={newHoliday.description} onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })} placeholder="Holiday description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddHoliday}>Add Holiday</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>Upcoming company holidays for the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="p-3 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{holiday.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    {holiday.description && <p className="text-xs text-muted-foreground mt-1">{holiday.description}</p>}
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteHoliday(holiday.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Company Blog</CardTitle>
            </div>
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Share your thoughts with the team</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="post-title">Title</Label>
                    <Input id="post-title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="Post title" />
                  </div>
                  <div>
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea id="post-content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} placeholder="Write your post here..." rows={5} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPost}>Publish</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Latest updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {(isAdmin || post.authorEmail === user?.email) && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deletePost(post.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
