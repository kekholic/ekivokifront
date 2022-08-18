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
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
`;

function Canvas({ children }) {
  return { children };
}

Canvas.Container = function CanvasContainer({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>;
};

Canvas.Content = function CanvasContent({ CANVAS_REF, ...restProps }) {
  return <Content ref={CANVAS_REF} {...restProps} />;
};

export default function CanvasContainer({ ...restProps }) {
  return (
    <Canvas.Container>
      <Canvas.Content {...restProps} />
    </Canvas.Container>
  );
}
