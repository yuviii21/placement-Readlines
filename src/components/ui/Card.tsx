import React from 'react';
import './components.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {children}
        </div>
    );
};
