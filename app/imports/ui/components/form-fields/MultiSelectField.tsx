import React from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
import Select from 'react-select';

/* eslint react/prop-types: 0 */

const renderDropdown = ({ allowedValues, disabled, placeholder, onChange, transform, value, id }) => {
  const options = allowedValues.map((val) => ({
    label: transform ? transform(val) : val,
    value: val,
  }));

  return (
    <Select
      isMulti
      isDisabled={disabled}
      placeholder={placeholder}
      options={options}
      id={id}
      onChange={(selectedOptions) => onChange(selectedOptions.map(option => option.value))}
      value={options.filter(option => value.includes(option.value))}
    />
  );
};

const MultiSelect = ({
                       allowedValues,
                       className,
                       disabled,
                       error,
                       errorMessage,
                       id,
                       label,
                       onChange,
                       placeholder,
                       required,
                       showInlineError,
                       transform,
                       value,
                       ...props
                     }) => (
  <div className={classnames({ disabled, error, required }, className, 'field')} {...filterDOMProps(props)}>
    {label && <label htmlFor={`${id}-label`}>{label}</label>}
    {renderDropdown({
      allowedValues,
      disabled,
      placeholder,
      onChange,
      transform,
      value,
      id,
    })}
    {!!(error && showInlineError) && <div className="text-danger">{errorMessage}</div>}
  </div>
);

export default connectField(MultiSelect);
