/* eslint-disable react/require-default-props */
import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface IProps {
  publicRoutes?: Array<Object>;
  privateRoutes?: Array<Object>;
}

export default function ErrorPage(props: IProps): ReactElement {
  const navigate = useNavigate();
  const { publicRoutes, privateRoutes } = props;
  const isLoading = useAppSelector((store) => store.user.isLoading);

  // // console.log(publicRoutes, privateRoutes);
  const [fiveHundred, setfiveHundred] = useState('Страницы не существует');

  useEffect(() => {
    const findInPublic = publicRoutes?.find(
      (el: any) => el.path === window.location.pathname
    );
    const findInPrivate = privateRoutes?.find(
      (el: any) => el.path === window.location.pathname
    );
    if (findInPublic) {
      // alert('Вы уже авторизованы!');
      navigate('/game/start');
    } else if (findInPrivate) {
      setfiveHundred('Отказано в доступе');
    }
  });
  return <div> {!isLoading && fiveHundred}</div>;
}
