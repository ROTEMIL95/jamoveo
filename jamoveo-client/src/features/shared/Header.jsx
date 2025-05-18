import React from 'react';

function Header({ children }) {
  return (
    <header
      style={{
        width: '100%',
        height: '64px',
        borderBottomRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        borderBottomWidth: '1.5px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        paddingRight: '48px',
        paddingBottom: '12px',
        paddingLeft: '48px',
        background: 'rgba(13, 4, 2, 1)',
        position: 'relative',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </header>
  );
}

export default Header; 