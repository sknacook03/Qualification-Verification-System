import React, { useState, useEffect } from 'react';
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from 'react-thailand-address-typeahead';
import './ThailandAddress.css'; 

function ThailandAddress({ onAddressChange, error = {}, value }) {
  const [val, setVal] = useState(ThailandAddressValue.empty() || {
    subdistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  useEffect(() => {
    if (value) {
      setVal(value);
    }
  }, [value]);

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
            className={`address-input ${error.subdistrict ? 'input-error' : ''}`}
          />
          {error.subdistrict && <div className="error-message">{error.subdistrict}</div>}
        </div>
        <div>
        <label className="input-label">อำเภอ / เขต*</label>
          <ThailandAddressTypeahead.DistrictInput
            placeholder=""
            className={`address-input ${error.district ? 'input-error' : ''}`}
          />
          {error.district && <div className="error-message">{error.district}</div>}
        </div>
        <div>
        <label className="input-label">จังหวัด*</label>
          <ThailandAddressTypeahead.ProvinceInput
            placeholder=""
            className={`address-input ${error.province ? 'input-error' : ''}`}
          />
          {error.province && <div className="error-message">{error.province}</div>}
        </div>
        <div>
        <label className="input-label">รหัสไปรษณีย์*</label>
          <ThailandAddressTypeahead.PostalCodeInput
            placeholder=""
            className={`address-input ${error.postalCode ? 'input-error' : ''}`}
          />
          {error.postalCode && <div className="error-message">{error.postalCode}</div>}
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
