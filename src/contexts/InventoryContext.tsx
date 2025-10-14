import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  dateAdded: string;
}

export interface ItemRequest {
  id: string;
  itemId: string;
  itemName: string;
  employeeId: string;
  employeeName: string;
  quantity: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface InventoryContextType {
  items: InventoryItem[];
  requests: ItemRequest[];
  isLoading: boolean;
  addItem: (item: Omit<InventoryItem, 'id' | 'dateAdded'>) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  requestItem: (itemId: string, quantity: number, employeeName: string) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

const dummyItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    sku: 'LAP-DEL-001',
    category: 'Electronics',
    quantity: 15,
    costPrice: 1200,
    sellingPrice: 1500,
    supplier: 'Dell Corporation',
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    name: 'Office Chair Ergonomic',
    sku: 'FUR-CHA-002',
    category: 'Furniture',
    quantity: 8,
    costPrice: 150,
    sellingPrice: 250,
    supplier: 'Office Supplies Inc',
    dateAdded: '2024-02-10',
  },
  {
    id: '3',
    name: 'Wireless Mouse Logitech',
    sku: 'ACC-MOU-003',
    category: 'Accessories',
    quantity: 45,
    costPrice: 20,
    sellingPrice: 35,
    supplier: 'Logitech',
    dateAdded: '2024-01-20',
  },
  {
    id: '4',
    name: 'Monitor 27" LG',
    sku: 'MON-LG-004',
    category: 'Electronics',
    quantity: 5,
    costPrice: 250,
    sellingPrice: 350,
    supplier: 'LG Electronics',
    dateAdded: '2024-02-01',
  },
  {
    id: '5',
    name: 'Desk Lamp LED',
    sku: 'FUR-LAM-005',
    category: 'Furniture',
    quantity: 3,
    costPrice: 30,
    sellingPrice: 50,
    supplier: 'Lighting World',
    dateAdded: '2024-02-15',
  },
];

const dummyRequests: ItemRequest[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'Laptop Dell XPS 15',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    quantity: 1,
    requestDate: '2024-03-01',
    status: 'pending',
  },
  {
    id: '2',
    itemId: '3',
    itemName: 'Wireless Mouse Logitech',
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    quantity: 2,
    requestDate: '2024-03-02',
    status: 'approved',
  },
];

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setItems(dummyItems);
      setRequests(dummyRequests);
      setIsLoading(false);
    }, 500);
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'dateAdded'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem: InventoryItem = {
      ...item,
      id: `item_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    
    setItems(prev => [...prev, newItem]);
    setIsLoading(false);
  };

  const updateItem = async (id: string, updatedData: Partial<InventoryItem>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
    setIsLoading(false);
  };

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prev => prev.filter(item => item.id !== id));
    setIsLoading(false);
  };

  const requestItem = async (itemId: string, quantity: number, employeeName: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const item = items.find(i => i.id === itemId);
    if (!item) {
      setIsLoading(false);
      throw new Error('Item not found');
    }

    const newRequest: ItemRequest = {
      id: `req_${Date.now()}`,
      itemId,
      itemName: item.name,
      employeeId: 'current_user',
      employeeName,
      quantity,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    
    setRequests(prev => [...prev, newRequest]);
    setIsLoading(false);
  };

  const approveRequest = async (requestId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      ));
      
      // Decrease item quantity
      setItems(prev => prev.map(item => 
        item.id === request.itemId 
          ? { ...item, quantity: item.quantity - request.quantity }
          : item
      ));
    }
    setIsLoading(false);
  };

  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
    setIsLoading(false);
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        requests,
        isLoading,
        addItem,
        updateItem,
        deleteItem,
        requestItem,
        approveRequest,
        rejectRequest,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
