import React, { useState } from 'react';
import { Modal, Button, Flex } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const showModal = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  return (
    <>
      <Modal
        title="Settings"
        open={isVisible}
        onCancel={handleClose}
        footer={null}
      >
        <Flex gap="middle" wrap>
          <p>Current Theme: {isDark ? 'Dark' : 'Light'}</p>
          <Button type="primary" onClick={toggleTheme}>
            {isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </Button>
        </Flex>
      </Modal>
    </>
  );
};