import Select, { Props as SelectProps } from 'react-select';

interface SpkSelectProps {
  /* required */
  option: SelectProps['options'];

  /* most-used extras */
  onChange?     : SelectProps['onChange'];   // ✅ NEW – idiomatic name
  onfunchange?  : SelectProps['onChange'];   // ⬅️  keep so old code still works
  defaultvalue? : SelectProps['value'];
  mainClass?    : string;

  /* all the rest remain unchanged */
  disabled?     : boolean;
  getValue?     : SelectProps['value'];
  clearable?    : boolean;
  multi?        : boolean;
  searchable?   : boolean;
  placeholder?  : string;
  autofocus?    : boolean;
  noOptionsmessage?: SelectProps['noOptionsMessage'];
  name?         : string;
  menuplacement?: SelectProps['menuPlacement'];
  classNameprefix?: string;
  id?: string;
}

const SpkSelect: React.FC<SpkSelectProps> = ({
  option,
  onChange,
  onfunchange,
  menuplacement,
  id,
  autofocus,
  noOptionsmessage,
  classNameprefix,
  defaultvalue,
  mainClass,
  disabled,
  name,
  getValue,
  clearable,
  multi,
  searchable,
  placeholder,
  ...rest
}) => (
  <Select
    name={name}
    options={option}
    className={mainClass}
    id={id}
    /* prefer `onChange`; fall back to legacy prop */
    onChange={onChange ?? onfunchange}
    isDisabled={disabled}
    isMulti={multi}
    menuPlacement={menuplacement}
    classNamePrefix={classNameprefix}
    defaultValue={defaultvalue}
    value={getValue}
    isClearable={clearable}
    isSearchable={searchable}
    placeholder={placeholder}
    autoFocus={autofocus}
    noOptionsMessage={noOptionsmessage}
    {...rest}
  />
);

export default SpkSelect;
