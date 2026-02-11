import React from 'react'

const Button = ({children, variant="primary", fullWidth, onClick}) => {
    const base = 'btn'
    const styles = variant === 'primary'? 'btn-primary': 'btn-secondary';
    const width = fullWidth? "w-full": ""
  return (
    <button type='submit' className={`${base} ${styles} ${width}`}>{children}</button>
  )
}

export default Button

