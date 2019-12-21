import React from 'react'
import { connect } from 'react-redux'
import { List, Typography, CircularProgress, Box } from '@material-ui/core'

import ResultItem from './ResultItem'
import { State, usersSearchSelectors } from 'state'

const { getSearchQuery, getSearchError, getSearchResultIds, isSearchInProgress } = usersSearchSelectors

interface StateProps {
  query?: string
  resultIds: number[]
  inProgress: boolean
  error?: string
}

type SearchUsersResultProps = StateProps

const SearchUsersResult: React.FC<SearchUsersResultProps> = ({ query, resultIds, inProgress, error }) => {
  if (error) {
    return (
      <Box p={4}>
        <Typography variant="subtitle1" color="error" display="block">
          {error}
        </Typography>
      </Box>
    )
  }

  if (inProgress) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  if (resultIds.length) {
    return (
      <Box p={2}>
        <List>
          {resultIds.map(id => (
            <ResultItem key={id} id={id} />
          ))}
        </List>
      </Box>
    )
  }

  if (query) {
    return (
      <Box p={4}>
        <Typography variant="subtitle1" color="error" display="block">
          No results found for query{' '}
          <span
            style={{
              wordSpacing: '.4rem'
            }}
          >
            "{query}"
          </span>
        </Typography>
      </Box>
    )
  }

  return null
}

export default connect<StateProps, {}, {}, State>(state => ({
  query: getSearchQuery(state),
  error: getSearchError(state),
  inProgress: isSearchInProgress(state),
  resultIds: getSearchResultIds(state)
}))(SearchUsersResult)
