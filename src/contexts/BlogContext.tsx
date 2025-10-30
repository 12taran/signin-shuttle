import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt?: string;
}

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  isLoading: boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

// Dummy blog posts
const generateDummyPosts = (): BlogPost[] => {
  return [
    {
      id: '1',
      title: 'Welcome to Our Company Blog',
      content: 'We are excited to launch our internal blog where everyone can share their thoughts, experiences, and updates.',
      author: 'Admin',
      authorEmail: 'admin@company.com',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: '2',
      title: 'Team Building Event Success',
      content: 'Last week\'s team building event was a huge success! Thanks to everyone who participated and made it memorable.',
      author: 'Employee',
      authorEmail: 'employee1@company.com',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: '3',
      title: 'New Office Guidelines',
      content: 'Please review the updated office guidelines in the employee handbook. Let us know if you have any questions.',
      author: 'Admin',
      authorEmail: 'admin@company.com',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load dummy posts on mount
    setPosts(generateDummyPosts());
  }, []);

  const addPost = (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newPost: BlogPost = {
        id: `post_${Date.now()}`,
        ...post,
        createdAt: new Date().toISOString(),
      };
      setPosts(prev => [newPost, ...prev]);
      setIsLoading(false);
    }, 300);
  };

  const updatePost = (id: string, post: Partial<BlogPost>) => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...post, updatedAt: new Date().toISOString() } : p))
      );
      setIsLoading(false);
    }, 300);
  };

  const deletePost = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== id));
      setIsLoading(false);
    }, 300);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        isLoading,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
