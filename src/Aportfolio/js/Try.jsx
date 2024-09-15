import React, { useState, useEffect } from 'react';

const IncrementingNumber = () => {
  const [number, setNumber] = useState(1);
  const maxNumber = 10;
  const interval = 200; // Interval in milliseconds

  useEffect(() => {
    let timer;
    if (number < maxNumber) {
      timer = setInterval(() => {
        setNumber(prev => prev + 1);
      }, interval);
    }
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [number]);

  return (
    <div style={styles.container}>
      <h1 style={styles.number}>{number}</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1e272e',
    color: '#dfe6e9',
    fontFamily: "'Courier New', Courier, monospace",
  },
  number: {
    fontSize: '5rem',
    fontWeight: '700',
    transition: 'opacity 0.5s ease-in-out', // Smooth transition for fade-in effect
  }
};

export default IncrementingNumber;
