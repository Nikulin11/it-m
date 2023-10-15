import React from 'react';
import './layout.css';

interface ILayout {
  children: React.ReactNode;
}

export function Layout({children}: ILayout) {
  return (
    <div className='layout'>
      {children}
    </div>
  );
}
