import React from 'react'; 
import { ReactNode } from 'react';
import { Flex,  Row, Col } from 'antd';

interface ButtonGroupProps {
  children: ReactNode[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children }) => {

  return (
    <Flex gap="middle" wrap>
      <Row>
        {children.map((child, index) => (
          <Col key={index}>{child}</Col>
        ))}
      </Row>
    </Flex>
  );
};

