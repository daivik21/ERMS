import React, { useState } from 'react';
import LoginPage from '../LoginPage/Login.tsx';
import RegisterPage from '../RegisterPage/RegisterPage.tsx';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [showRegister, setShowRegister] = useState(false);

  return showRegister ? (
    <RegisterPage
      onRegisterSuccess={() => setShowRegister(false)}
      onShowLogin={() => setShowRegister(false)}
    />
  ) : (
    <LoginPage
      onLoginSuccess={onLoginSuccess}
      onShowRegister={() => setShowRegister(true)}
    />
  );
};

export default AuthPage;