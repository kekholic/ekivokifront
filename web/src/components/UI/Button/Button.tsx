import React from 'react';
import './Button.module.css';

interface Props {
  text: string;
}

export default function Button(props: Props) {
  const { text } = props;
  return (
    <button type="submit">{text}</button>
  );
}
