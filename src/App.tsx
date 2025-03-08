import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout,  Spin, ConfigProvider, theme, Button } from 'antd';
import { UserOutlined, SettingFilled, SunFilled, MoonFilled } from '@ant-design/icons';
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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};



// Wrapper component that conditionally renders content based on auth state
const AppContent = () => {
  const { loading } = useAuth();

  const [isDark, setIsDark] = useState(false);

  const ThemeIcon = isDark ? <MoonFilled /> : <SunFilled />;
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (loading) {
    return <Flex justify="center" align="center" style={{ height: '100vh', width: '100vw' }}><Spin size="large" /></Flex>;
  }
  const { showLoginModal, showSettingsModal } = useAuth();

  return (
    <ConfigProvider
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
      >
      <MapProvider>

        <Flex gap="middle" wrap>
          <Layout style={layoutStyle}>
            <Content style={contentStyle}><MapView /></Content>
            <Footer style={footerStyle}>
              <Flex gap="middle" wrap>
                <Button type="text" icon={<UserOutlined />} onClick={showLoginModal} />
                <Button type="text" icon={<SettingFilled />} onClick={showSettingsModal} />
                <Button type="text" onClick={toggleTheme} icon={ThemeIcon} />
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