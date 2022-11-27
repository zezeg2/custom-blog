import { useEffect, useState, useCallback } from 'react'
import qs from 'query-string'
import { FILTER_TYPE } from '../constants'
import * as ScrollManager from '../utils/scroll'

let DEST_POS

export function useFilter(DEST) {
  const [filterName, setFilterName] = useState(FILTER_TYPE.ALL)
  DEST_POS = DEST
  const adjustScroll = () => {
    if (window.scrollY > DEST_POS) {
      ScrollManager.go(DEST_POS)
    }
  }
  const selectFilter = useCallback(filter => {
    setFilterName(filter)
    adjustScroll()
    window.history.pushState(
      { filter },
      '',
      `${window.location.pathname}?${qs.stringify({ filter })}`
    )
  }, [])
  const changeFilter = useCallback((withScroll = true) => {
    const { filter } = qs.parse(location.search)
    const target = filter == null ? FILTER_TYPE.ALL : filter

    setFilterName(target)
    if (withScroll) {
      adjustScroll()
    }
  }, [])

  useEffect(() => {
    ScrollManager.init()
    return () => {
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', changeFilter)

    return () => {
      window.removeEventListener('popstate', changeFilter)
    }
  }, [])

  useEffect(() => {
    changeFilter(false)
  }, [])

  return [filterName, selectFilter]
}
