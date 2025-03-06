import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { supabase } from '../utils/supabase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  showLoginModal: () => void;
  isLoginModalVisible: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      setIsLoginModalVisible(false);
      message.success('Successfully signed in!');
    } catch (error: any) {
      message.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      message.success('Registration successful! Please check your email for verification.');
      setIsLoginView(true); // Switch back to login view after successful signup
    } catch (error: any) {
      message.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      message.success('Successfully signed out!');
    } catch (error: any) {
      message.error(error.message || 'Failed to sign out');
    }
  };

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleLoginCancel = () => {
    setIsLoginModalVisible(false);
    form.resetFields();
    // Reset to login view when closing the modal
    setIsLoginView(true);
  };

  const handleFormSubmit = async (values: { email: string; password: string }) => {
    try {
      if (isLoginView) {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
      }
    } catch (error) {
      // Error is already handled in signIn/signUp functions
    }
  };

  const toggleAuthView = () => {
    setIsLoginView(!isLoginView);
    form.resetFields();
  };

  const AuthModal = () => (
    <Modal
      title={isLoginView ? "Login" : "Sign Up"}
      open={isLoginModalVisible}
      onCancel={handleLoginCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        {!isLoginView && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isLoginView ? 'Sign In' : 'Sign Up'}
          </Button>
        </Form.Item>
        <div className="text-center">
          <Button type="link" onClick={toggleAuthView}>
            {isLoginView ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </Button>
        </div>
      </Form>
    </Modal>
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        showLoginModal,
        isLoginModalVisible
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
