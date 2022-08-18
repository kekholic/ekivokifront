import React from 'react';
import { useParams } from 'react-router';
import useActivateAccount from '../../../hooks/useActivateAccount';

export default function Activate() {
  const { link } = useParams();

  if (link) {
    const { isActivated, errorMsg } = useActivateAccount(link);

    if (isActivated) {
      return (
        <div>Активация прошла успешно </div>
      );
    }
    return (
      <div>
        Ошибка активации:
        {' '}
        {errorMsg === 'Неккоректная ссылка активации' && 'Неккоректная ссылка активации или ваш аккаунт уже активирован'}
        .
        Если ошибка повторится обратитесь в техническую поддержку.
      </div>
    );
  }

  return (
    <div>
      Отсутствует код активации, запросите его заного.
      Если ошибка повторится обратитесь в техническую поддержку.
    </div>
  );
}
