import React from 'react'

const TextInput = ({label, id, type="text", onChange}) => {
  return (
    <div className='space-y-1'>
        <label htmlFor={id} className='text-sm text-slate-600'>{label}</label>
        <input id={id} name={id} type={type} className='input' onChange={onChange} />
    </div>
  )
}

export default TextInput



