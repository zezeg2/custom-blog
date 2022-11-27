import React, {useCallback, useRef} from 'react'
import {rhythm} from '../../utils/typography'
import './index.scss'
import {Item} from './item'

export const Filter = ({filters, filterName, selectFilter}) => {
  const containerRef = useRef(null)
  
  const scrollToCenter = useCallback(tabRef => {
    const {offsetWidth: tabWidth} = tabRef.current
    const {scrollLeft, offsetWidth: containerWidth} = containerRef.current
    const tabLeft = tabRef.current.getBoundingClientRect().left
    const containerLeft = containerRef.current.getBoundingClientRect().left
    const refineLeft = tabLeft - containerLeft
    const targetScollX = scrollLeft + refineLeft - (containerWidth / 2) + (tabWidth / 2)
    
    containerRef.current.scroll({left: targetScollX, top: 0, behavior: 'smooth'})
  }, [containerRef])
  
  return (
    <ul
      ref={containerRef}
      className="filter-container"
      role="tablist"
      id="category"
      style={{
        margin: `0 -${rhythm(3 / 4)}`,
      }}
    >
      <Item title={'All'} selectedBy={filterName} onClick={selectFilter} scrollToCenter={scrollToCenter}/>
      {filters.map((title, idx) => {
        return(
          <Item
            key={idx}
            title={title}
            selectedBy={filterName}
            onClick={selectFilter}
            scrollToCenter={scrollToCenter}
          />
        )
      })}
    </ul>
  )
}
