import React, { useState } from 'react';
import Input from '../Input/Input'
import PasswordInput from '../PasswordInput/PasswordInput';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-form">
      <Input 
        label="อีเมล" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <PasswordInput 
        label="รหัสผ่าน" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
    </div>
  );
};

export default LoginForm;
