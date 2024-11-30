import React, { useState } from 'react';
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from 'react-thailand-address-typeahead';
import './ThailandAddress.css'; 

function ThailandAddress({ onAddressChange }) {
  const [val, setVal] = useState(ThailandAddressValue.empty() || {
    subdistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  const handleValueChange = (updatedVal) => {
    setVal(updatedVal);
    if (onAddressChange) {
      onAddressChange(updatedVal); 
    }
  };

  return (
    <div className="address-container">
      <ThailandAddressTypeahead
        value={val}
        onValueChange={handleValueChange}
      >
        <div>
          <label className="input-label">ตำบล / แขวง*</label>
          <ThailandAddressTypeahead.SubdistrictInput
            placeholder=""
            className="address-input"
          />
        </div>
        <div>
        <label className="input-label">อำเภอ / เขต*</label>
          <ThailandAddressTypeahead.DistrictInput
            placeholder=""
            className="address-input"
          />
        </div>
        <div>
        <label className="input-label">จังหวัด*</label>
          <ThailandAddressTypeahead.ProvinceInput
            placeholder=""
            className="address-input"
          />
        </div>
        <div>
        <label className="input-label">รหัสไปรษณีย์*</label>
          <ThailandAddressTypeahead.PostalCodeInput
            placeholder=""
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
