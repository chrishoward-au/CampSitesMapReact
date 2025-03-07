import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPrompt } from './components/LoginPrompt';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout, Menu } from 'antd';
import type {MenuProps } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Header, Footer } = Layout;

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

const showLoginModal = () => {
  const { showLoginModal } = useAuth();
  showLoginModal();
};

const showSettingsModal = () => {
  const { showSettingsModal } = useAuth();
  showSettingsModal();
};

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
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const [current, setCurrent] = useState('login');

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