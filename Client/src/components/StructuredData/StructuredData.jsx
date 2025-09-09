import React from 'react';

export const OrganizationSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา',
        alternateName: 'มทร.อีสาน นครราชสีมา',
        url: 'https://cpermuti.com/eduverify/',
        logo: 'https://cpermuti.com/eduverify/Cassia-flowers-rmuti.png',
        description: 'ระบบตรวจสอบคุณวุฒิมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา สำหรับตรวจสอบสถานะการสำเร็จการศึกษาของนักศึกษา',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'นครราชสีมา',
          addressRegion: 'นครราชสีมา',
          addressCountry: 'TH'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+66-44-233-000',
          contactType: 'customer service',
          availableLanguage: 'Thai'
        },
        sameAs: [
          'https://www.rmuti.ac.th/',
        ]
      })
    }}
  />
);

export const WebApplicationSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ระบบตรวจสอบข้อมูลบัณฑิต',
        description: 'ระบบตรวจสอบข้อมูลบัณฑิตและสถานะการสำเร็จการศึกษา มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา',
        url: 'https://cpermuti.com/eduverify/',
        applicationCategory: 'EducationApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'THB'
        },
        featureList: [
          'ตรวจสอบคุณวุฒิ',
          'ตรวจสอบข้อมูลบัณฑิต',
          'ตรวจสอบสถานะการสำเร็จการศึกษา',
          'จัดการข้อมูลหน่วยงาน',
          'สถิติการใช้งานระบบ'
        ]
      })
    }}
  />
);

export const BreadcrumbSchema = ({ items }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      })
    }}
  />
);

export const ServiceSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'บริการตรวจสอบข้อมูลบัณฑิต',
        description: 'บริการตรวจสอบข้อมูลบัณฑิตและสถานะการสำเร็จการศึกษาออนไลน์ สำหรับหน่วยงานที่ต้องการยืนยันคุณวุฒิของบุคลากร',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา'
        },
        serviceType: 'Graduate Information Verification Service',
        areaServed: {
          '@type': 'Country',
          name: 'Thailand'
        }
      })
    }}
  />
);
