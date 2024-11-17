import React, { useState } from 'react';
import Input from '../../components/Input/Input'
import PasswordInput from '../PasswordInput/PasswordInput';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-form">
      <Input 
        label="อีเมล"
        id="email"
        name="email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder=" "
      />
      <PasswordInput 
        label="รหัสผ่าน"
        id="password"
        name="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder=" "
      />
    </div>
  );
};

export default LoginForm;
