import React from 'react';
import styles from './PasswordStrengthIndicator.module.css';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { label: 'อย่างน้อย 8 ตัวอักษร', test: (pwd) => pwd.length >= 8 },
    { label: 'มีตัวอักษรพิมพ์ใหญ่', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'มีตัวอักษรพิมพ์เล็ก', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'มีตัวเลข', test: (pwd) => /\d/.test(pwd) },
    { label: 'มีอักขระพิเศษ (!@#$%^&*)', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) }
  ];

  const getPasswordStrength = () => {
    const satisfiedRequirements = requirements.filter(req => req.test(password)).length;
    
    if (satisfiedRequirements === 0) return { level: 0, text: '', color: '' };
    if (satisfiedRequirements <= 2) return { level: 1, text: 'อ่อน', color: '#ff4757' };
    if (satisfiedRequirements <= 3) return { level: 2, text: 'ปานกลาง', color: '#ffa502' };
    if (satisfiedRequirements <= 4) return { level: 3, text: 'ดี', color: '#2ed573' };
    return { level: 4, text: 'แข็งแกร่งมาก', color: '#05c46b' };
  };

  const strength = getPasswordStrength();

  if (!password) return null;

  return (
    <div className={styles.container}>
      <div className={styles.strengthMeter}>
        <div className={styles.strengthBars}>
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`${styles.bar} ${
                level <= strength.level ? styles.active : ''
              }`}
              style={{
                backgroundColor: level <= strength.level ? strength.color : '#e1e5e9'
              }}
            />
          ))}
        </div>
        {strength.text && (
          <span 
            className={styles.strengthText}
            style={{ color: strength.color }}
          >
            ความแข็งแกร่ง: {strength.text}
          </span>
        )}
      </div>
      
      <div className={styles.requirements}>
        {requirements.map((req, index) => (
          <div
            key={index}
            className={`${styles.requirement} ${
              req.test(password) ? styles.satisfied : styles.unsatisfied
            }`}
          >
            <span className={styles.icon}>
              {req.test(password) ? '✓' : '✗'}
            </span>
            <span className={styles.text}>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
