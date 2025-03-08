import React from 'react'; 
import { ReactNode } from 'react';
import { Flex,  Row, Col } from 'antd';

interface ButtonGroupProps {
  children: ReactNode[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children }) => {

  return (
    <Flex gap="middle" align="center" justify="space-evenly" style={{ width: '100%' }}>
        {children.map((child, index) => (
          <Col key={index}>{child}</Col>
        ))}
    </Flex>
  );
};

