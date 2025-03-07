import React from 'react';
import { Button, Typography, Space, Card, Flex } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Text } = Typography;

export const LoginPrompt: React.FC = () => {
  const { showLoginModal } = useAuth();

  return (
    <Flex justify="center" align="center" style={{ height: 'calc(100vh * 0.5)', width: '100vw' }}>
      <Card title="Welcome to CampSites Map" style={{ width: 300 }}>
      <Space direction="vertical" align="center" size="large">
        <Text>Please sign in to access your personalized map settings and saved locations.</Text>
        <Button type="primary" size="large" onClick={showLoginModal}>
          Sign In
        </Button>
      </Space>
      </Card>
    </Flex>
  );
};
