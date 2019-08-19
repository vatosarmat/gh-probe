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

import { State, getSearchUsersResult, getSearchUsersInProgress, getSearchUsersError } from 'state'
import { UserBrief } from 'concepts/api'

interface UsersListProps {
  readonly items: UserBrief[]
}

const UsersList: React.FC<UsersListProps> = ({ items }) => {
  return (
    <List>
      {items.map(({ login, type, avatar_url }) => {
        return (
          <ListItem key={login} button>
            <ListItemAvatar>
              <Avatar alt={login} src={avatar_url} />
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
  readonly result: UserBrief[]
  readonly inProgress: boolean
  readonly error: Error | null
}

const SearchUsersResult: React.FC<SearchUsersResultProps> = ({ result, inProgress, error }) => {
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

  if (result) {
    return (
      <Box p={2}>
        <UsersList items={result} />
      </Box>
    )
  }

  return null
}

export default connect((state: State) => ({
  result: getSearchUsersResult(state),
  inProgress: getSearchUsersInProgress(state),
  error: getSearchUsersError(state)
}))(SearchUsersResult)
