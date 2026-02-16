import React from 'react';
import './components.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    label: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, className = '', ...props }) => {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            {...props}
        >
            {label}
        </button>
    );
};
