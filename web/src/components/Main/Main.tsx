/* eslint-disable no-empty-pattern */
import React from 'react';
import { useAppDispatch } from '../../hooks/redux';

type Props = {};

export default function Main({ }: Props) {
  const dispatch = useAppDispatch();
  return <div>Main</div>;
}
