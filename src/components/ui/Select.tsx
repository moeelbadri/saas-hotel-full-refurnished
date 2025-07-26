// import React from 'react';
"use client";
import React, { useMemo, useCallback } from 'react';
import chroma from "chroma-js";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";

import { ColourOption, groupedOptions } from "../data";
import { StylesConfig } from "react-select";
import useDarkMode from "@/hooks/useDarkMode";
import SpinnerMini from './SpinnerMini';

const filterColors = (inputValue: string, data: any) => {
    if (data[0].options) {
        return data.map((group: { options: any[] }) => {
            const filteredOptions = group.options.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            // Return a new group object with the filtered options
            return {
                ...group,
                options: filteredOptions,
            };
        });
    } else {
        return data.filter((i: any) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }
};

const loadOptions = (
    inputValue: string,
    data: any,
    callback: (options: any) => void,
    func?: any
) => {
    setTimeout(async () => {
        let dataS;
        if (func) {
            dataS = await func(inputValue);
        } else {
            if (inputValue) {
                if(data.length > 0){
                    dataS = filterColors(inputValue, data);
                }
            } else {
                dataS = data;
            }
        }
        // console.log(inputValue, data, "data after timeout finished");
        callback(dataS as ColourOption[]);
    }, 500);
};

// Memoized style creators to prevent recreation on every render
const createColourStylesCreatable = (isDarkMode?: boolean): StylesConfig<ColourOption, true> => ({
    control: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-grey-0)",
        borderColor:  "var(--color-grey-300)",
        minWidth: "145px",
    }),
    input:(styles)=>({
        ...styles,
        color:isDarkMode?"#FFFFFF":"black"
    }),
    placeholder: (styles) => ({ ...styles, color:isDarkMode? "#FFFFFF":"black" }),
    menu: (styles) => ({ ...styles, backgroundColor: "var(--color-grey-000)",}),
     
    singleValue: (styles,) => ({ ...styles, color: isDarkMode? "#FFFFFF":"black" }),
    multiValue: (styles, { data }) => {
        const color = chroma(isDarkMode ? "white": "black");
        return {
            ...styles,
            color: isDarkMode ? "white": "black",
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles,) => ({
        ...styles,
        color:isDarkMode? "#FFFFFF":"black",
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ":hover": {
            backgroundColor: data.color,
            color: "var(--color-grey-000)",
        },
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = isDarkMode ? "white" : "black";
        return {
            ...styles,
            fontSize: "1.6rem",
            borderColor: "var(--color-grey-300)",
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? "var(--color-grey-100)"
                : isFocused
                ? "var(--color-grey-100)"
                : "var(--color-grey-0)",
            color: isDisabled ? "#ccc" : isSelected ? "black" : color,
            cursor: isDisabled ? "not-allowed" : "default",
            ":active": {
                ...styles[":active"],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? color
                        : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
                              color.slice(3, 5),
                              16
                          )}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`
                    : undefined,
            },
        };
    },
});

const createColourStyles = (isDarkMode?: boolean): StylesConfig<ColourOption, true> => ({
    control: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-grey-0)",
        borderColor: "var(--color-grey-300)",
        minWidth: "145px",
    }),
    noOptionsMessage(base) {
        return {
            ...base,
            background: "var(--color-grey-0)",
            borderColor: "var(--color-grey-300)",
            color: isDarkMode ? "white": "black",
        };
    },
    input:(styles)=>({
        ...styles,
        color:isDarkMode?"#FFFFFF":"black"
    }),
    placeholder: (styles) => ({ ...styles, color: isDarkMode ? "#FFFFFF": "black" }),
    menu: (styles) => ({ ...styles, backgroundColor: "var(--color-grey-0)",zindex: 1000 }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(isDarkMode ? "white": "black")
        return {
            ...styles,
            fontSize: "1.6rem",
            borderColor: "var(--color-grey-300)",
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? isDarkMode
                ? "var(--color-grey-200)"
                : "var(--color-grey-500)"
                : isFocused
                ? "var(--color-grey-300)"
                : "var(--color-grey-000)",
            color: isDisabled
                ? "#ccc"
                : isSelected
                ? chroma.contrast(color, "white") > 2
                    ? "white"
                    : "white"
                : data.color,
            cursor: isDisabled ? "not-allowed" : "default",
            ":active": {
                ...styles[":active"],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    singleValue: (styles, { data }) => ({
         ...styles,
         color: isDarkMode ? "white": "black",
        }),
    multiValue: (styles, { data }) => {
        const color = chroma(isDarkMode ? "white": "black");
        return {
            ...styles,
            color: isDarkMode ? "white": "black",
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: isDarkMode ? "white": "black",
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ":hover": {
            backgroundColor: data.color,
            color: "var(--color-grey-0)",
        },
    }),
});

interface SelectProps {
    data: any;
    onChange?: any;
    menuClose?: boolean;
    isMulti?: boolean;
    onInputChange?: any;
    defaultValue?: any;
    value?: any;
    message?: string;
    loadOptionsOverride?: any;
    func?: any;
    disabled?: boolean;
    isLoading?: boolean;
    selectCreate?: boolean;
    placeholder?: string;
    onBlur?: any;
    isDarkMode?: boolean;
}

const OptimizedSelect: React.FC<SelectProps> = React.memo(({
    data,
    onChange,
    menuClose,
    isMulti,
    onInputChange,
    defaultValue,
    value,
    message,
    loadOptionsOverride,
    func,
    disabled,
    isLoading,
    selectCreate,
    placeholder,
    onBlur,
    isDarkMode,
}) => {
    const isDarkMode1 = useDarkMode();
    const currentIsDarkMode = isDarkMode ?? isDarkMode1.isDarkMode;
    
    // Memoize styles to prevent recreation on every render
    const creatableStyles = useMemo(() => 
        createColourStylesCreatable(currentIsDarkMode), 
        [currentIsDarkMode]
    );
    
    const regularStyles = useMemo(() => 
        createColourStyles(currentIsDarkMode), 
        [currentIsDarkMode]
    );
    
    // Memoize the loadOptions callback to prevent recreation
    const memoizedLoadOptions = useCallback((inputValue: any, callback: any) => {
        const finalLoadOptions = loadOptionsOverride || loadOptions;
        return finalLoadOptions(inputValue, data, callback, func);
    }, [loadOptionsOverride, data, func]);
    const key = data?.map((item: any) => item.label).join('');
    // if(isLoading) return <SpinnerMini />
    if (selectCreate) {
        return (
            <AsyncCreatableSelect
                key={key}
                value={value}
                isDisabled={disabled}
                cacheOptions
                defaultOptions
                defaultValue={defaultValue}
                onInputChange={onInputChange}
                loadOptions={memoizedLoadOptions}
                placeholder={placeholder}
                closeMenuOnSelect={menuClose}
                onBlur={onBlur}
                isMulti={isMulti as true}
                options={data}
                onChange={onChange}
                styles={creatableStyles}
            />
        );
    } else {
        return (
            <AsyncSelect
                key={key}
                cacheOptions
                defaultOptions
                isDisabled={disabled}
                defaultValue={defaultValue}
                value={value}
                onInputChange={onInputChange}
                loadOptions={memoizedLoadOptions}
                isClearable={false}
                noOptionsMessage={() => message}
                placeholder={placeholder}
                closeMenuOnSelect={menuClose}
                onBlur={onBlur}
                isMulti={isMulti as true}
                options={data}
                onChange={onChange}
                styles={regularStyles}
            />
        );
    }
});

OptimizedSelect.displayName = 'OptimizedSelect';

export default OptimizedSelect;