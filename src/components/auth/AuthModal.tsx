import { useState } from 'react';
import { Modal } from '@/modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      isDismissable={true}
      showCloseButton={true}
    >
      <div className="py-6">
        {view === 'login' ? (
          <LoginForm onSuccess={onClose} onSwitchToRegister={() => setView('register')} />
        ) : (
          <RegisterForm onSuccess={onClose} onSwitchToLogin={() => setView('login')} />
        )}
      </div>
    </Modal>
  );
};
