import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { FILTER_TYPE } from '../../constants'

export const Contents = ({ posts, countOfInitialPost, count, filterType, filterWords }) => {
  const refinedPosts = useMemo(() => { const result = posts
    .filter(
      ({node}) => {
        if (filterWords === FILTER_TYPE.ALL) {
          return node
        } else {
          if (filterType === FILTER_TYPE.CATEGORY) {
            return node.frontmatter.category === filterWords
          }
          if (filterType === FILTER_TYPE.KEYWORD) {
            return node.frontmatter.keywords.includes(filterWords)
          }
        }
      }
    )
    .slice(0, count * countOfInitialPost)
    return result
  }
  
  )

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  )
}
