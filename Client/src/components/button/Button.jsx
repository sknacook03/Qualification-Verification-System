import React from 'react';

const Button = ({ text, onClick, styleType }) => {
  const styles = {
    primary: {
      backgroundColor: '#ff6a00', // สีพื้นหลังสำหรับปุ่ม "สมัครสมาชิก"
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '16px',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#333',
      border: '1px solid #ccc', // กรอบสีเทาสำหรับปุ่มอื่นๆ
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '16px',
    },
  };

  return (
    <button onClick={onClick} style={styles[styleType]}>
      {text}
    </button>
  );
};

export default Button;
