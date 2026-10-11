import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    const root = document.getElementById('root');

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // блокируем прокрутку страницы
    if (root) root.style.pointerEvents = 'none'; // блокируем клики по фону под модалкой

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      if (root) root.style.pointerEvents = '';
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
