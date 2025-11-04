import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'System' | 'Task' | 'Leave' | 'Expense' | 'Inventory' | 'Email' | 'WhatsApp';
  message: string;
  sender: string;
  receiverEmail: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  getNotificationsByUser: (email: string) => Notification[];
  getLatestNotifications: (email: string, limit: number) => Notification[];
  filterNotifications: (email: string, type?: string) => Notification[];
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

// Generate dummy notifications
const generateDummyNotifications = (): Notification[] => {
  const types: Notification['type'][] = ['System', 'Task', 'Leave', 'Expense', 'Inventory', 'Email', 'WhatsApp'];
  const messages = {
    System: ['System maintenance scheduled for tonight', 'New security update available', 'Password policy updated'],
    Task: ['New task assigned: Complete Q4 Report', 'Task deadline approaching: Client Presentation', 'Task completed: Monthly Review'],
    Leave: ['Your leave request has been approved', 'Leave request rejected: Insufficient balance', 'New leave request from John Doe'],
    Expense: ['Expense report submitted successfully', 'Expense claim approved: $250', 'Low budget alert for Marketing'],
    Inventory: ['Low stock alert: Office Supplies', 'New inventory item added', 'Item request approved'],
    Email: ['New email notification', 'Email campaign sent successfully', 'Email bounced: Update contact'],
    WhatsApp: ['New WhatsApp message received', 'WhatsApp group notification', 'WhatsApp reminder sent']
  };
  
  const users = ['john@company.com', 'jane@company.com', 'admin@company.com'];
  const senders = ['System', 'Admin', 'Manager', 'HR Department', 'Finance Team'];
  
  const notifications: Notification[] = [];
  
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const messageList = messages[type];
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    const receiverEmail = users[Math.floor(Math.random() * users.length)];
    const sender = senders[Math.floor(Math.random() * senders.length)];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    
    notifications.push({
      id: `notif-${i + 1}`,
      type,
      message,
      sender,
      receiverEmail,
      timestamp: date.toISOString(),
      isRead: Math.random() > 0.5
    });
  }
  
  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(generateDummyNotifications());
      setIsLoading(false);
    }, 500);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: false } : notif)
    );
  };

  const getNotificationsByUser = (email: string) => {
    return notifications.filter(notif => notif.receiverEmail === email);
  };

  const getLatestNotifications = (email: string, limit: number) => {
    return getNotificationsByUser(email).slice(0, limit);
  };

  const filterNotifications = (email: string, type?: string) => {
    const userNotifications = getNotificationsByUser(email);
    if (!type || type === 'All') {
      return userNotifications;
    }
    return userNotifications.filter(notif => notif.type === type);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAsUnread,
        getNotificationsByUser,
        getLatestNotifications,
        filterNotifications,
        isLoading
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
