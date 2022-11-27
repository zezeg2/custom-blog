import {graphql} from 'gatsby'
import _ from 'lodash'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Bio} from '../components/bio'
import {Filter} from '../components/filter'
import {Contents} from '../components/contents'
import {Head} from '../components/head'
import {FILTER_TYPE, HOME_TITLE} from '../constants'
import {useFilter} from '../hooks/useFilter'
import {useIntersectionObserver} from '../hooks/useIntersectionObserver'
import {useRenderedCount} from '../hooks/useRenderedCount'
import {useScrollEvent} from '../hooks/useScrollEvent'
import {Layout} from '../layout'
import * as Dom from '../utils/dom'
import * as EventManager from '../utils/event-manager'

const BASE_LINE = 80

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

export default ({ data, location }) => {
  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  const categories = useMemo(
    () => _.uniq(posts.map(({node}) => node.frontmatter.category)),
    []
  )
  const keywords = useMemo(
    () => [... new Set(_.uniq(posts.map(({node}) => node.frontmatter.keywords)).flat().filter((element) => {
      return element !== undefined && element !== null && element !== '';
    }))], [])
  
  const bioRef = useRef(null)
  const [DEST, setDEST] = useState(316)
  const [count, countRef, increaseCount] = useRenderedCount()
  const [filterWord, selectFilter] = useFilter(DEST)
  const [filterType, setFilterType] = useState(FILTER_TYPE.CATEGORY);
  
  useEffect( tabRef => {
    setDEST(!bioRef.current ? 316 : bioRef.current.getBoundingClientRect().bottom + window.pageYOffset + 24 )
  }, [bioRef.current])

  useIntersectionObserver()
  useScrollEvent(() => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(increaseCount, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  })

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio ref={bioRef} />
    
      <div className="inline">
        <input hidden type="checkbox" id="toggleFilter" onChange={event => {
          selectFilter(FILTER_TYPE.ALL)
          if (event.currentTarget.checked) {
            setFilterType(FILTER_TYPE.KEYWORD)
          } else {
            setFilterType(FILTER_TYPE.CATEGORY)
          }
        }}/>
        <label htmlFor="toggleFilter" className="toggleSwitch">
          <span className="toggleButton"></span>
        </label>
      </div>
      
      <div className="inline">
        <h3 className="toggleFilter">Filter By [ {filterType} ]</h3>
      </div>
      {filterType === FILTER_TYPE.CATEGORY && (<Filter
        filters={categories}
        filterName={filterWord}
        selectFilter={selectFilter}
      />)}
      {filterType === FILTER_TYPE.KEYWORD && (<Filter
        filters={keywords}
        filterName={filterWord}
        selectFilter={selectFilter}
      />
      )}
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        filterType={filterType}
        filterWords={filterWord}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            draft
            keywords
          }
        }
      }
    }
  }
`
