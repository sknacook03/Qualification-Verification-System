import React, { useState } from 'react';
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from 'react-thailand-address-typeahead';
import './ThailandAddress.css'; 

function ThailandAddress() {
  const [val, setVal] = useState(ThailandAddressValue.empty() || {
    subdistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  return (
    <div className="address-container">
      <ThailandAddressTypeahead
        value={val}
        onValueChange={(updatedVal) => setVal(updatedVal)}
      >
        <div>
          <ThailandAddressTypeahead.SubdistrictInput
            placeholder="ตำบล / แขวง"
            className="address-input"
          />
        </div>
        <div>
          <ThailandAddressTypeahead.DistrictInput
            placeholder="อำเภอ / เขต"
            className="address-input"
          />
        </div>
        <div>
          <ThailandAddressTypeahead.ProvinceInput
            placeholder="จังหวัด"
            className="address-input"
          />
        </div>
        <div>
          <ThailandAddressTypeahead.PostalCodeInput
            placeholder="รหัสไปรษณีย์"
            className="address-input"
          />
        </div>
        <ThailandAddressTypeahead.Suggestion
          containerProps={{
            className: "suggestions-container" 
          }}
          optionItemProps={{
            className: "suggestion-item" 
          }}
        />
      </ThailandAddressTypeahead>
    </div>
  );
}

export default ThailandAddress;
