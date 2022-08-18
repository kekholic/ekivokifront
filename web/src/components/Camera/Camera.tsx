import React from 'react';

interface IProps {
  children: any;
}

export default function Camera(props: IProps) {
  return (
    <div>{props.children}</div>
  );
}
