import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import { Content } from 'antd/es/layout/layout';
import { Flex, Layout,  Spin } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dock } from './components/Dock';

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
  
  if (loading) {
    return <Flex justify="center" align="center" style={{ height: '100vh', width: '100vw' }}><Spin size="large" /></Flex>;
  }

  return (
    <ThemeProvider> 
      <MapProvider>
        <Flex gap="middle" wrap>
          <Layout style={layoutStyle}>
            <Content style={contentStyle}><MapView /></Content>
            <Footer style={footerStyle}>
              <Dock />
            </Footer>
          </Layout>
        </Flex>
      </MapProvider >
    </ThemeProvider>
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