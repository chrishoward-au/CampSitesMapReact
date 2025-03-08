import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout, Spin } from 'antd';
import { ButtonGroup } from './components/ButtonGroup';
import { Button } from 'antd';
import { UserOutlined, SettingFilled, SunFilled, MoonFilled } from '@ant-design/icons';
import { useTheme } from './contexts/ThemeContext';
import { SettingsModal } from './components/SettingsModal';

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

const showSettingsModal = () => {
  SettingsModal.show = true;
  SettingsModal.onClose = () => {
    SettingsModal.show = false;
  };
};

// Wrapper component that conditionally renders content based on auth state
const AppContent = () => {
  const { loading, showLoginModal } = useAuth();

  const { isDark, toggleTheme } = useTheme();
  const ThemeIcon = isDark ? <MoonFilled /> : <SunFilled />;

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
                <ButtonGroup>
                  <Button type="text" icon={<UserOutlined />} onClick={showLoginModal} />
                  <Button type="text" icon={<SettingFilled />} onClick={showSettingsModal} />
                  <Button type="text" onClick={toggleTheme} icon={ThemeIcon} />
                </ButtonGroup>
              </Flex>

            </Footer>
          </Layout>
        </Flex>
      </MapProvider >
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