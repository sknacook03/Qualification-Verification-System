import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Input from "../../components/Input/Input";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import "./LoginForm.css";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      }, {
        withCredentials:true
      });

      console.log(response.data);
      if (response.status === 200) {
        alert("ล็อคอินสำเร็จ!");
        navigate("/ForgetPassword");
      } else {
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก: " + response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          "เกิดข้อผิดพลาด: " +
            (error.response.data.message || "ไม่สามารถเข้าสู่ระบบได้")
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("เกิดข้อผิดพลาด: ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
      } else {
        console.error("Error:", error.message);
        alert("เกิดข้อผิดพลาด: " + error.message);
      }
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
      <Link to="/ForgetPassword" className="forgetPass">
        ลืมรหัสผ่าน?
      </Link>
      <Button type="submit" text="เข้าสู่ระบบ" styleType="primary" />
    </form>
  );
};

export default LoginForm;
