import React, { useState } from "react";
import Input from "../../components/Input/Input";
import PasswordInput from "../PasswordInput/PasswordInput";
import Button from "../../components/button/Button";
import "./LoginForm.css";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <Button type="submit" text="เข้าสู่ระบบ" styleType="primary" />
    </form>
  );
};

export default LoginForm;
