import React from 'react'
import { connect } from 'react-redux'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  ListItemSecondaryAction
} from '@material-ui/core'
import { Group, Person } from '@material-ui/icons'
import { Link } from 'react-router-dom'

import {
  State,
  getSearchUsersQuery,
  getSearchUsersResult,
  getSearchUsersInProgress,
  getSearchUsersError
} from 'state'
import { UserBrief } from 'concepts/api'

interface UsersListProps {
  readonly items: UserBrief[]
}

const UsersList: React.FC<UsersListProps> = ({ items }) => {
  return (
    <List>
      {items.map(({ login, type, avatar_url }) => {
        return (
          <ListItem key={login} button component={Link} to={`/users/${login}`}>
            <ListItemAvatar>
              <Avatar alt="" src={avatar_url} />
            </ListItemAvatar>
            <ListItemText primary={login} />
            <ListItemSecondaryAction>
              {type === 'User' ? <Person /> : <Group />}
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  )
}

interface SearchUsersResultProps {
  readonly query: string
  readonly result: UserBrief[] | null
  readonly inProgress: boolean
  readonly error: Error | null
}

const SearchUsersResult: React.FC<SearchUsersResultProps> = ({
  query,
  result,
  inProgress,
  error
}) => {
  if (error) {
    return (
      <Box p={4}>
        <Typography variant="subtitle1" color="error" display="block">
          {error.toString()}
          <br />
          {error.message}
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

  if (result) {
    if (result.length) {
      return (
        <Box p={2}>
          <UsersList items={result} />
        </Box>
      )
    }

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

export default connect((state: State) => ({
  query: getSearchUsersQuery(state),
  result: getSearchUsersResult(state),
  inProgress: getSearchUsersInProgress(state),
  error: getSearchUsersError(state)
}))(SearchUsersResult)
