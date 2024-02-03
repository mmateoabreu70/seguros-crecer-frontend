"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Select(props){
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  
  const { 
    label, 
    name, 
    defaultOpt = "Seleccione", 
    url, 
    dependence,
    onSelectChange, 
    ...rest 
  } = props;

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      const { data } = await axios.get(url);
      const results = []
      // Store results in the results array
      data.forEach((value) => {
        results.push({
          key: value.name,
          value: value.id,
        });
      });

      // Update the options state
      setOptions([
        { key: defaultOpt, value: 0, selected: true }, 
        ...results
      ])
    }

    if (dependence && dependence === 0) {
      return;
    }

    // Trigger the fetch
    fetchData();
  }, [url, defaultOpt, dependence]);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    
    setSelectedValue(newValue);
    onSelectChange(newValue);
  }

  return (
    <div className='col-4'>
      <label htmlFor={name} className='col-form-label'>{label}</label>
      <select 
        className='form-select' 
        id={name} 
        value={selectedValue} 
        onChange={handleSelectChange} 
        {...rest}
      >
        {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.key}
              </option>
            );
          })}
      </select>
    </div>
  );
}

export default Select;