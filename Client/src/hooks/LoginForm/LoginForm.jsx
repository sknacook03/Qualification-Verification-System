import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import PasswordInput from "../PasswordInput/PasswordInput";
import Button from "../../components/button/Button";
import "./LoginForm.css";



const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "กรุณากรอกอีเมล*";
    }
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน*";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit({ email, password });
    }
  };
  return (
    <form onSubmit={handleFormSubmit} className="login-form">
      <Input
        label="อีเมล"
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder=" "
        error={errors.email}
      />
      <PasswordInput
        label="รหัสผ่าน"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder=" "
        error={errors.password}
      />
      <Link to="/ForgetPassword" className="forgetPass">
        ลืมรหัสผ่าน?
      </Link>
      <Button type="submit" text="เข้าสู่ระบบ" styleType="primary" />
    </form>
  );
};

export default LoginForm;
