import React, { useState, useEffect, useRef } from 'react';

const AutocompleteInput = ({ name, value, onChange, placeholder, data, disabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Bahar click karne par suggestions band karne ke liye
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(e); // Parent component ka state update karein

        if (inputValue.length > 0) {
            const filteredSuggestions = data.filter(item =>
                item.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // Synthetic event banayein taaki parent ka handleChange function kaam kare
        const event = { target: { name, value: suggestion } };
        onChange(event);
        setSuggestions([]);
        setIsFocused(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
                disabled={disabled}
                autoComplete="off"
            />
            {isFocused && (value.length > 0 || suggestions.length > 0) && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                            >
                                {suggestion}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
