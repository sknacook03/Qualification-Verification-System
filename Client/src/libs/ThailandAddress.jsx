import React, { useState } from 'react';
import {
  ThailandAddressTypeahead,
  ThailandAddressValue
} from 'react-thailand-address-typeahead';

function ThailandAddress() {
  // สร้าง state สำหรับเก็บค่าที่อยู่
  const [val, setVal] = useState(ThailandAddressValue.empty());

  return (
    <div className="App">
      {/* Component หลัก */}
      <ThailandAddressTypeahead
        value={val}
        onValueChange={(updatedVal) => {
          setVal({ ...updatedVal }); // อัปเดตค่าที่อยู่
        }}
      >
        {/* Input สำหรับตำบล */}
        <ThailandAddressTypeahead.SubdistrictInput placeholder="Tumbon" />

        {/* Input สำหรับอำเภอ */}
        <ThailandAddressTypeahead.DistrictInput placeholder="Amphoe" />

        <div>
          {/* Input สำหรับจังหวัด */}
          <ThailandAddressTypeahead.ProvinceInput placeholder="Province" />

          {/* Input สำหรับรหัสไปรษณีย์ */}
          <ThailandAddressTypeahead.PostalCodeInput placeholder="Postal Code" />
        </div>
      </ThailandAddressTypeahead>
    </div>
  );
}

export default ThailandAddress;
