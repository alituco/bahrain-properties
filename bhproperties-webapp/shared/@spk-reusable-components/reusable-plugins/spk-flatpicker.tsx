import React from 'react';
import Flatpickr from 'react-flatpickr';

interface SpkFlatpickrProps {
  value?: Date | string;
  onfunChange: any;
  options?: any;
  inputClass?: string;
  placeholder?: string | any;
  dataEnableTime?: boolean;
  disable?: boolean
}

const SpkFlatpickr: React.FC<SpkFlatpickrProps> = ({ value, onfunChange, inputClass, placeholder, dataEnableTime = false, disable = false, options }) => {
  return (
    <Flatpickr className={inputClass} value={value} onChange={onfunChange} disabled={disable} options={options} placeholder={placeholder} data-enable-time={dataEnableTime} />
  );
};

export default SpkFlatpickr;
