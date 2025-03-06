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
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          Modal.info({
            title: 'Email Verification Required',
            content: (
              <div>
                <p>Your email address has not been verified.</p>
                <p>Please check your inbox for a verification email.</p>
              </div>
            ),
          });
        } else if (error.message.includes('Invalid login credentials')) {
          message.error('Invalid email or password. Please try again.');
        } else {
          throw error;
        }
        return;
      }

      setUser(data.user);
      setIsLoginModalVisible(false);
      message.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      message.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign up with:', email);
      
      // First check if the user already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password,
      }).catch(() => ({ data: null })); // Ignore errors here
      
      // If user exists and can sign in, use that account
      if (existingUser?.user) {
        console.log('User already exists and credentials are valid');
        setUser(existingUser.user);
        setIsLoginModalVisible(false);
        message.success('Successfully signed in with existing account!');
        return;
      }
      
      // Try to create a new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email: email,
            full_name: email.split('@')[0], // Default name from email
          },
        }
      });

      console.log('Signup response:', data);

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user returned from signup');
        message.error('Failed to create user account. Please try again.');
        return;
      }

      // If we have a session, the user is automatically signed in
      if (data.session) {
        console.log('User created and automatically signed in');
        setUser(data.user);
        setIsLoginModalVisible(false);
        message.success('Account created and signed in successfully!');
        return;
      }
      
      // If we have a user but no session, try to sign in manually
      if (data.user.id) {
        try {
          // Wait a moment for the user to be fully created in Supabase
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            console.log('Manual sign-in failed:', signInError);
            
            // Show a user-friendly message based on the error
            if (signInError.message.includes('Email not confirmed')) {
              Modal.info({
                title: 'Email Verification Required',
                content: (
                  <div>
                    <p>Your account has been created, but email verification is required.</p>
                    <p>Please check your email for a verification link.</p>
                  </div>
                ),
              });
            } else {
              // Generic message for other errors
              Modal.info({
                title: 'Account Created',
                content: (
                  <div>
                    <p>Your account has been created successfully!</p>
                    <p>Please try signing in with your credentials.</p>
                  </div>
                ),
              });
            }
          } else if (signInData.user) {
            // Successfully signed in
            setUser(signInData.user);
            setIsLoginModalVisible(false);
            message.success('Account created and signed in successfully!');
            return;
          }
        } catch (signInError) {
          console.error('Error during manual sign-in:', signInError);
        }
        
        // If we couldn't sign in automatically, show success and switch to login view
        message.success('Account created successfully! Please sign in.');
        setIsLoginView(true); // Switch back to login view
      } else {
        message.error('Failed to create user account. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      if (error.message.includes('User already registered')) {
        message.info('This email is already registered. Trying to sign in...');
        
        // Try to sign in with the provided credentials
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            message.error('Could not sign in with provided credentials. Please reset your password if needed.');
          } else if (data.user) {
            setUser(data.user);
            setIsLoginModalVisible(false);
            message.success('Successfully signed in!');
          }
        } catch (signInError) {
          message.error('Failed to sign in with existing account. Please try the login option.');
        }
      } else {
        message.error(error.message || 'Failed to sign up');
      }
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
