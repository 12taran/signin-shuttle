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
import { Users, CalendarCheck, Clock, Calendar, FileText, Plus, Trash2, TrendingUp } from 'lucide-react';
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
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome back, <span className="font-medium text-foreground">{user?.email}</span></p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          <>
            <DashboardCard title="System Overview" description="Quick statistics" icon={Users}>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Total Employees</span>
                  <span className="text-2xl font-bold text-foreground">24</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Present Today</span>
                  <span className="text-2xl font-bold text-green-600">20</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Pending Leaves</span>
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Attendance Summary" description="Today's attendance" icon={CalendarCheck}>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">On Time</span>
                  <span className="text-2xl font-bold text-green-600">18</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Late</span>
                  <span className="text-2xl font-bold text-amber-600">2</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-muted-foreground">Absent</span>
                  <span className="text-2xl font-bold text-destructive">4</span>
                </div>
              </div>
            </DashboardCard>
          </>
        ) : (
          <DashboardCard title="Leave Balance" description="Your annual leave status" icon={Calendar}>
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground">Total Leaves</span>
                <span className="text-2xl font-bold text-foreground">{leaveBalance}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground">Used</span>
                <span className="text-2xl font-bold text-amber-600">{usedLeaves}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-2xl font-bold text-green-600">{remainingLeaves}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mt-4">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(usedLeaves / leaveBalance) * 100}%` }} 
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                {((usedLeaves / leaveBalance) * 100).toFixed(0)}% utilized
              </p>
            </div>
          </DashboardCard>
        )}

        <DashboardCard title="Your Profile" description="Account information" icon={Users}>
          <div className="space-y-3 mt-2">
            <div className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Email</span>
              <span className="font-medium text-sm text-foreground break-all">{user?.email}</span>
            </div>
            <div className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Role</span>
              <span className="font-semibold capitalize text-foreground">{user?.role}</span>
            </div>
            <div className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                Active
              </Badge>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Holidays Section */}
      <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Company Holidays 2025</CardTitle>
                <CardDescription className="mt-1">Upcoming company holidays for the year</CardDescription>
              </div>
            </div>
            {isAdmin && (
              <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Add New Holiday</DialogTitle>
                    <DialogDescription>Add a new company holiday to the calendar</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="holiday-name" className="text-sm font-medium">Holiday Name</Label>
                      <Input 
                        id="holiday-name" 
                        value={newHoliday.name} 
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} 
                        placeholder="e.g., Christmas" 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holiday-date" className="text-sm font-medium">Date</Label>
                      <Input 
                        id="holiday-date" 
                        type="date" 
                        value={newHoliday.date} 
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holiday-description" className="text-sm font-medium">Description (optional)</Label>
                      <Input 
                        id="holiday-description" 
                        value={newHoliday.description} 
                        onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })} 
                        placeholder="Holiday description" 
                        className="h-11"
                      />
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {holidays.map((holiday) => (
              <div 
                key={holiday.id} 
                className="group relative p-4 border-2 rounded-xl bg-gradient-to-br from-card to-muted/20 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-foreground text-base leading-tight">{holiday.name}</p>
                    <p className="text-sm font-medium text-primary">
                      {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {holiday.description && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{holiday.description}</p>
                    )}
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => deleteHoliday(holiday.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog Section */}
      <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Company Blog</CardTitle>
                <CardDescription className="mt-1">Latest updates and announcements</CardDescription>
              </div>
            </div>
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New Post</DialogTitle>
                  <DialogDescription>Share your thoughts with the team</DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title" className="text-sm font-medium">Title</Label>
                    <Input 
                      id="post-title" 
                      value={newPost.title} 
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                      placeholder="Post title" 
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-content" className="text-sm font-medium">Content</Label>
                    <Textarea 
                      id="post-content" 
                      value={newPost.content} 
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
                      placeholder="Write your post here..." 
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPost}>Publish</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div 
                key={post.id} 
                className="group relative p-5 border-2 rounded-xl bg-gradient-to-br from-card to-muted/20 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg text-foreground leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">{post.author[0].toUpperCase()}</span>
                        </div>
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {(isAdmin || post.authorEmail === user?.email) && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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