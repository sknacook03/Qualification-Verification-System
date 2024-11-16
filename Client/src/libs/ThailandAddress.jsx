import React, { useState } from 'react';
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from 'react-thailand-address-typeahead';

function ThailandAddress() {
  // ใช้ ThailandAddressValue.empty() และตรวจสอบค่าเริ่มต้น
  const [val, setVal] = useState(ThailandAddressValue.empty() || {
    subdistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  return (
    <div>
      <ThailandAddressTypeahead
        value={val}
        onValueChange={(updatedVal) => setVal(updatedVal)} // อัปเดต state เมื่อค่าที่อยู่เปลี่ยน
      >
        <ThailandAddressTypeahead.SubdistrictInput
          style={{ borderRadius: 4, marginBottom: 4, fontSize: 18 }}
          placeholder="ตำบล / แขวง"
        />
        <ThailandAddressTypeahead.DistrictInput
          style={{ borderRadius: 4, marginBottom: 4, fontSize: 18 }}
          placeholder="อำเภอ / เขต"
        />
        <ThailandAddressTypeahead.ProvinceInput
          style={{ borderRadius: 4, marginBottom: 4, fontSize: 18 }}
          placeholder="จังหวัด"
        />
        <ThailandAddressTypeahead.PostalCodeInput
          style={{ borderRadius: 4, marginBottom: 4, fontSize: 18 }}
          placeholder="รหัสไปรษณีย์"
        />
        <ThailandAddressTypeahead.Suggestion
          containerProps={{ style: { border: "1px solid black" } }}
          optionItemProps={{ style: { fontSize: 10, cursor: "pointer" } }}
        />
      </ThailandAddressTypeahead>
      <br />
      <code>{JSON.stringify(val)}</code>
    </div>
  );
}

export default ThailandAddress;
