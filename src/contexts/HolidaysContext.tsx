import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
}

interface HolidaysContextType {
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  isLoading: boolean;
}

const HolidaysContext = createContext<HolidaysContextType | undefined>(undefined);

export const useHolidays = () => {
  const context = useContext(HolidaysContext);
  if (!context) {
    throw new Error('useHolidays must be used within a HolidaysProvider');
  }
  return context;
};

// Dummy holidays for 2025
const generateDummyHolidays = (): Holiday[] => {
  return [
    { id: '1', name: "New Year's Day", date: '2025-01-01', description: 'Public Holiday' },
    { id: '2', name: 'Republic Day', date: '2025-01-26', description: 'National Holiday' },
    { id: '3', name: 'Holi', date: '2025-03-14', description: 'Festival of Colors' },
    { id: '4', name: 'Good Friday', date: '2025-04-18', description: 'Christian Holiday' },
    { id: '5', name: 'Independence Day', date: '2025-08-15', description: 'National Holiday' },
    { id: '6', name: 'Gandhi Jayanti', date: '2025-10-02', description: 'National Holiday' },
    { id: '7', name: 'Diwali', date: '2025-10-20', description: 'Festival of Lights' },
    { id: '8', name: 'Christmas', date: '2025-12-25', description: 'Christian Holiday' },
  ];
};

export const HolidaysProvider = ({ children }: { children: ReactNode }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load dummy holidays on mount
    setHolidays(generateDummyHolidays());
  }, []);

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newHoliday: Holiday = {
        id: `holiday_${Date.now()}`,
        ...holiday,
      };
      setHolidays(prev => [...prev, newHoliday].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      setIsLoading(false);
    }, 300);
  };

  const updateHoliday = (id: string, holiday: Partial<Holiday>) => {
    setIsLoading(true);
    setTimeout(() => {
      setHolidays(prev =>
        prev.map(h => (h.id === id ? { ...h, ...holiday } : h))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      setIsLoading(false);
    }, 300);
  };

  const deleteHoliday = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setHolidays(prev => prev.filter(h => h.id !== id));
      setIsLoading(false);
    }, 300);
  };

  return (
    <HolidaysContext.Provider
      value={{
        holidays,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        isLoading,
      }}
    >
      {children}
    </HolidaysContext.Provider>
  );
};
