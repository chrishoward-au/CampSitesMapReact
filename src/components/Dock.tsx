import React from 'react';
import { Flex, Button } from 'antd';
import { UserOutlined, SettingFilled, SunFilled, MoonFilled } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ButtonGroup } from './ButtonGroup';


const { showLoginModal, showSettingsModal } = useAuth();
const { isDark, toggleTheme } = useTheme();

const ThemeIcon = isDark ? <MoonFilled /> : <SunFilled />;

export const Dock: React.FC = () => {
    
  return (
    <Flex gap="middle" wrap>
      <ButtonGroup>
        <Button type="text" icon={<UserOutlined />} onClick={showLoginModal} />
        <Button type="text" icon={<SettingFilled />} onClick={showSettingsModal} />
        <Button type="text" onClick={toggleTheme} icon={ThemeIcon} />
      </ButtonGroup>
    </Flex>
  );
};

