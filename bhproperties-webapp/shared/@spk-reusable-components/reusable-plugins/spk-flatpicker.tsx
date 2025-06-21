// shared/@spk-reusable-components/reusable-plugins/spk-flatpicker.tsx
import React from 'react';
import Flatpickr from 'react-flatpickr';

interface SpkFlatpickrProps {
  value?: Date | string;
  onfunChange?: any;          // keep legacy name
  options?: any;
  inputClass?: string;
  placeholder?: string;
  dataEnableTime?: boolean;
  disable?: boolean;
  required?: boolean;         // ← NEW
  /* allow any additional native‐input attrs */
  [key: string]: any;         //  e.g. name, id, min, max …
}

const SpkFlatpickr: React.FC<SpkFlatpickrProps> = ({
  value,
  onfunChange,
  inputClass,
  placeholder,
  dataEnableTime = false,
  disable = false,
  options,
  required,                   // pick up the new prop
  ...rest                     // catch everything else
}) => (
  <Flatpickr
    className={inputClass}
    value={value}
    onChange={onfunChange}
    disabled={disable}
    options={options}
    placeholder={placeholder}
    data-enable-time={dataEnableTime}
    required={required}       // forward to underlying <input>
    {...rest}                 // forward the rest
  />
);

export default SpkFlatpickr;
