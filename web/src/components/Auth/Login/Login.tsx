import React, { ReactElement } from 'react';
import Form from '../../Form/Form';

export default function Login(): ReactElement {
  return (
    <Form auth={false} />
  );
}
