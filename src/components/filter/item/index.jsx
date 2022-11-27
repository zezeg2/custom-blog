import React, { useRef, useCallback, useEffect } from 'react'

export const Item = ({ title, selectedBy, onClick, scrollToCenter }) => {
  const tabRef = useRef(null)
  const handleClick = useCallback(() => {
    scrollToCenter(tabRef)
    onClick(title)
  }, [tabRef])

  useEffect(() => {
    if (selectedBy === title) {
      scrollToCenter(tabRef)
    }
  }, [selectedBy, tabRef])

  return (
    <li
      ref={tabRef}
      className="item"
      role="tab"
      aria-selected={selectedBy === title ? 'true' : 'false'}
    >
      <div onClick={handleClick}>{title}</div>
    </li>
  )
}
