import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Mail, MessageSquare, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Notifications() {
  const { user } = useAuth();
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAsUnread, 
    filterNotifications,
    isLoading 
  } = useNotifications();
  const { toast } = useToast();

  const [filterType, setFilterType] = useState<string>('All');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'System' as const,
    message: '',
    sender: user?.email || '',
    receiverEmail: ''
  });

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const displayNotifications = isAdmin 
    ? filterType === 'All' ? notifications : notifications.filter(n => n.type === filterType)
    : filterNotifications(user.email, filterType);

  const notificationTypes = ['All', 'System', 'Task', 'Leave', 'Expense', 'Inventory', 'Email', 'WhatsApp'];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="h-5 w-5" />;
      case 'WhatsApp':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleCreateNotification = () => {
    if (!newNotification.message || !newNotification.receiverEmail) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    addNotification({
      type: newNotification.type,
      message: newNotification.message,
      sender: user.email,
      receiverEmail: newNotification.receiverEmail
    });

    toast({
      title: 'Success',
      description: 'Notification sent successfully'
    });

    setIsCreateDialogOpen(false);
    setNewNotification({
      type: 'System',
      message: '',
      sender: user.email,
      receiverEmail: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage all notifications' : 'Your notifications and alerts'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Test Notification</DialogTitle>
                <DialogDescription>
                  Send a test notification to a specific user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value: any) => 
                      setNewNotification(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.filter(t => t !== 'All').map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver">Receiver Email</Label>
                  <Input
                    id="receiver"
                    placeholder="user@company.com"
                    value={newNotification.receiverEmail}
                    onChange={(e) => 
                      setNewNotification(prev => ({ ...prev, receiverEmail: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter notification message..."
                    value={newNotification.message}
                    onChange={(e) => 
                      setNewNotification(prev => ({ ...prev, message: e.target.value }))
                    }
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Notifications</CardTitle>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {displayNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                {filterType !== 'All' 
                  ? `No ${filterType} notifications found`
                  : 'You have no notifications at this time'}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all ${!notification.isRead ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                            {notification.type}
                          </Badge>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="font-medium">{notification.message}</p>
                      </div>
                      <div className="flex gap-1">
                        {notification.isRead ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsUnread(notification.id)}
                            title="Mark as unread"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <p>From: <span className="font-medium">{notification.sender}</span></p>
                        {isAdmin && (
                          <p>To: <span className="font-medium">{notification.receiverEmail}</span></p>
                        )}
                      </div>
                      <p>
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
