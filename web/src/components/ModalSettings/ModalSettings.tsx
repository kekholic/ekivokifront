/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Dispatch } from 'react';
import style from './ModalSettings.module.css';

interface IProps {
  children: any,
  active: boolean,
  setActive: Dispatch<boolean>,
}

export default function ModalSettings({ active, setActive, children }: IProps) {
  return (
    <div className={active ? `${style.modal} ${style.modalActive}` : `${style.modal}`} onClick={() => setActive(false)}>
      <div className={active ? `${style.modalContent} ${style.modalContentActive}` : `${style.modalContent}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
