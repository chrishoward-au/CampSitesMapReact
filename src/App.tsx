import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout, Menu, Spin, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, SunOutlined } from '@ant-design/icons';
import { useState } from 'react';
import  theme  from './theme'

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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const menuStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',

}

// Menu click handlers moved to onClick handler in AppContent

type MenuItem = Required<MenuProps>['items'][number];


// Wrapper component that conditionally renders content based on auth state
const AppContent = () => {
  const { loading } = useAuth();
  const [current, setCurrent] = useState('login');

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
    {
      label: '',
      key: 'mode',
      icon: <SunOutlined />,
      onClick: () => {
        toggleTheme();
      }
    },
  ];
  
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (loading) {
    return <Flex justify="center" align="center" style={{ height: '100vh', width: '100vw' }}><Spin size="large" /></Flex>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDark ? theme.dark.primaryColor : theme.light.primaryColor,
          colorBgBase: isDark ? theme.dark.backgroundColor : theme.light.backgroundColor,
          colorTextBase: isDark ? theme.dark.textColor : theme.light.textColor,
        },
      }}
    >
      <MapProvider>

        <Flex gap="middle" wrap>
          <Layout style={layoutStyle}>
            <Content style={contentStyle}><MapView /></Content>
            <Footer style={footerStyle}>
              <Flex gap="middle" wrap>
                <Menu style={menuStyle} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
              </Flex>
            </Footer>
          </Layout>
        </Flex>
      </MapProvider >
    </ConfigProvider>
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