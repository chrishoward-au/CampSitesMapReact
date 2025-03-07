import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout, Menu, Spin } from 'antd';
import type {MenuProps } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Footer } = Layout;

const layoutStyle = {
  height: '100vh',
  width: '100vw',
};


const contentStyle = {
  height: 'calc(100vh - 40px)',
  width: '100vw',
};

const footerStyle = {
  height: '40px',
  width: '100vw',
  backgroundColor: '#333',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

// Menu click handlers moved to onClick handler in AppContent

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: '',
    key: 'login',
    icon: <UserOutlined />,
  },
  {
    label: '',
    key: 'settings',
    icon: <SettingOutlined />,
  },
];

// Wrapper component that conditionally renders content based on auth state
const AppContent = () => {
  const { loading } = useAuth();
  const [current, setCurrent] = useState('login');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  if (loading) {
    return <Flex justify="center" align="center" style={{ height: '100vh', width: '100vw' }}><Spin size="large" /></Flex>;
  }

  return (
    <MapProvider>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Content style={contentStyle}><MapView /></Content>
          <Footer style={footerStyle}>
            <Flex gap="middle" wrap>
              <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
            </Flex>
          </Footer>
        </Layout>
      </Flex>
    </MapProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;