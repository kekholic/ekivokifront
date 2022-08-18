/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */

import styled from 'styled-components';
import React from 'react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0;
`;

const Content = styled.canvas`
  border: 4px solid #206eb0;
  background-color: white;
  cursor: pointer;
  border-radius: 12px;
`;

function Canvas({ children }: any) {
  return { children };
}

Canvas.Container = function CanvasContainer({ children, ...restProps }: any) {
  return <Container style={{ margin: '20px 0px 0px 0px' }} {...restProps}>{children}</Container>;
};

Canvas.Content = function CanvasContent({ CANVAS_REF, ...restProps }: any) {
  return <Content ref={CANVAS_REF} {...restProps} />;
};

export default function CanvasContainer({ ...restProps }) {
  return (
    <Canvas.Container>
      <Canvas.Content {...restProps} />
    </Canvas.Container>
  );
}
