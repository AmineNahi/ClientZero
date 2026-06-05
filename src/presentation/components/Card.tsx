import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'md',
  glass = true,
  className = '', 
  ...props 
}) => {
  const classes = [
    styles.card,
    styles[`pad-${padding}`],
    glass ? 'glass-panel' : styles.solid,
    className
  ].join(' ').trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
