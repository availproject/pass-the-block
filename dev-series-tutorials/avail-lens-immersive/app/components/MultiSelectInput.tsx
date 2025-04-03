import React, { useState, useEffect, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { ActionMeta, InputActionMeta, SingleValue, StylesConfig } from 'react-select';
import { lensHandleOptions, OptionType } from '../data/selectOptions';
import { useWeb3 } from './Providers';

const animatedComponents = makeAnimated();

const customStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    height: "48px", // Exactly h-12 (3rem)
    minHeight: "48px",
    minWidth: 0,
    borderRadius: "0.75rem",
    borderColor: "rgba(75, 85, 99, 0.5)",
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    fontSize: "1rem",
    paddingLeft: "0.25rem",
    lineHeight: "1.25rem",
    boxShadow: "none",
    ':hover': {
      borderColor: "rgb(107, 114, 128)",
      backgroundColor: "rgba(31, 41, 55, 0.7)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '6px 12px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    whiteSpace: 'pre-wrap',
    color: 'white'
  }),
  option: (base) => ({
    ...base,
    backgroundColor: `#121212`,
    ':hover': {
        backgroundColor: `#3999b9`,
    },
    ':active': {
        ...base[':active'],
        backgroundColor: `#3999b9`,
    },
    height: '100%',
    whiteSpace: 'pre-wrap',
    color: 'white'
  }),
  menu: (base) => ({
    ...base,
    whiteSpace: 'pre-wrap',
    backgroundColor: '#121212',
    zIndex: 9999,
    position: 'absolute',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '300px',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'rgba(107, 114, 128, 0.5)',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'rgba(156, 163, 175, 0.7)',
    ':hover': {
      color: 'white',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    display: 'flex', // Show the clear indicator (x)
    color: 'rgba(156, 163, 175, 0.7)',
    ':hover': {
      color: 'white',
    },
  }),
};

type MultiSelectInputProps = {
  title?: string;
  optionType: 'fruit' | 'color' | 'animal' | 'lens';
  selectedValue: OptionType | null;
  onChange: (selected: OptionType | null) => void;
  placeholder?: string;
  extra?: string;
};

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ 
  title, 
  optionType, 
  selectedValue, 
  onChange, 
  placeholder = "Enter or select a Lens handle...",
  extra 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editingValue, setEditingValue] = useState('');
    const [directInputValue, setDirectInputValue] = useState('');
    const { lensAccount } = useWeb3();
    
    // Get options based on the selected option type and user's lens handle if available
    const options = useMemo(() => {
      const baseOptions = lensHandleOptions;
      
      if (lensAccount?.handle?.fullHandle && optionType === 'lens') {
        const userHandle = lensAccount.handle.fullHandle;
        
        // Check if the user's handle already exists in the options
        const handleExists = baseOptions.some(opt => opt.value === userHandle);
        
        if (!handleExists) {
          // Add the user's handle to the top of the options
          return [
            { value: userHandle, label: userHandle },
            ...baseOptions
          ];
        }
      }
      
      return baseOptions;
    }, [lensAccount, optionType]);

    // Update direct input value when selected value changes
    useEffect(() => {
      if (selectedValue) {
        setDirectInputValue(selectedValue.value);
      } else {
        setDirectInputValue('');
      }
    }, [selectedValue]);

    // Handle typed input
    const handleInputChange = (inputValue: string, action: InputActionMeta) => {
        if (action.action !== 'input-blur' && action.action !== 'menu-close') {
            // Remove lens/ prefix if present
            const cleanedInput = inputValue.replace('lens/', '');
            setEditingValue(cleanedInput);
            
            // If we're directly editing, update the direct input value
            if (!isMenuOpen) {
                setDirectInputValue(cleanedInput);
                
                // If input is empty, clear the selection
                if (!cleanedInput.trim()) {
                    onChange(null);
                } else {
                    // Create a temporary option for what's being typed
                    onChange({
                        value: cleanedInput,
                        label: cleanedInput
                    });
                }
            }
        }
    };

    // Handle selection from dropdown
    const handleChange = (
      newValue: SingleValue<OptionType>,
      actionMeta: ActionMeta<OptionType>
    ) => {
      setIsMenuOpen(false);
      
      // Clear editing value when a selection is made or cleared
      if (actionMeta.action === 'clear') {
        setEditingValue('');
        setDirectInputValue('');
      }
      
      onChange(newValue);
    };

    const handleMenuOpen = () => {
      setIsMenuOpen(true);
    };

    const handleMenuClose = () => {
      setIsMenuOpen(false);
    };

    return (
      <div className={extra}>
          {title && <h3 className="mb-2 text-white">{title}</h3>}
          <CreatableSelect<OptionType, false>
            aria-labelledby="aria-label"
            components={animatedComponents}
            options={options}
            value={selectedValue}
            className="basic-select h-12"
            classNamePrefix="select"
            onChange={handleChange}
            onInputChange={handleInputChange}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            menuIsOpen={isMenuOpen}
            noOptionsMessage={({ inputValue }) => 
                inputValue ? `Press Enter to use "${inputValue}"` : "Type to search or create..."
            }
            isClearable={true}
            styles={customStyles}
            inputValue={editingValue}
            placeholder={placeholder}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
            backspaceRemovesValue={true}
            formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
          />
      </div>
    );
};

export default MultiSelectInput;