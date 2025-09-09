import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "ระบบตรวจสอบคุณวุฒิมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน | มทร.อีสาน",
  description = "ระบบตรวจสอบคุณวุฒิการศึกษาออนไลน์ สำหรับหน่วยงานราชการและเอกชน",
  keywords = "ตรวจสอบคุณวุฒิ, ตรวจคุณวุฒิ, ยืนยันคุณวุฒิ, ตรวจสอบใบปริญญา, ราชมงคลโคราช, ราชมงคลนครราชสีมา, มทร.อีสาน, มทรอีสาน, โคราช, นครราชสีมา, ราชมงคลอีสาน, RMUTI, ข้อมูลบัณฑิต, ตรวจสอบบัณฑิต, สถานะการศึกษา, ตรวจคุณวุฒิราชมงคลโคราช, ตรวจสอบคุณวุฒิโคราช, ยืนยันใบปริญญาราชมงคล, ระบบตรวจสอบคุณวุฒิมทร, ตรวจสอบคุณวุฒิออนไลน์",
  image = "https://cpermuti.com/eduverify/Cassia-flowers-rmuti.png",
  url = "https://cpermuti.com/eduverify/",
  type = "website",
  noindex = false
}) => {
  const fullTitle = title.includes("ระบบตรวจสอบคุณวุฒิ") 
    ? title 
    : `${title} | ระบบตรวจสอบคุณวุฒิ`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ระบบตรวจสอบคุณวุฒิ" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
