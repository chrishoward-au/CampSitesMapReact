import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export const LoginPrompt: React.FC = () => {
  const { showLoginModal } = useAuth();

  return (
    <div className="flex flex-row items-center justify-center h-full p-6 bg-gray-50">
      <Card title="Welcome to CampSites Map" style={{ width: 300 }}>
      <Space direction="vertical" align="center" size="large">
        <Text>Please sign in to access your personalized map settings and saved locations.</Text>
        <Button type="primary" size="large" onClick={showLoginModal}>
          Sign In
        </Button>
      </Space>
</Card>
    </div>
  );
};
