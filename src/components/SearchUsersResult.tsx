import React from 'react'
import { connect } from 'react-redux'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress
} from '@material-ui/core'

import { State, getSearchUsersResult, getSearchUsersInProgress, getSearchUsersError } from 'state'
import { UserBrief } from 'concepts/api'

interface UsersListProps {
  readonly items: UserBrief[]
}

const UsersList: React.FC<UsersListProps> = ({ items }) => {
  return (
    <List>
      {items.map(({ login, avatar_url }) => {
        return (
          <ListItem key={login} button>
            <ListItemAvatar>
              <Avatar alt={login} src={avatar_url} />
            </ListItemAvatar>
            <ListItemText primary={login} />
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
      <Typography variant="subtitle1" color="error" display="block">
        {error}
      </Typography>
    )
  }

  if (inProgress) {
    return <CircularProgress />
  }

  if (result.length) {
    return <UsersList items={result} />
  }

  return null
}

export default connect((state: State) => ({
  result: getSearchUsersResult(state),
  inProgress: getSearchUsersInProgress(state),
  error: getSearchUsersError(state)
}))(SearchUsersResult)
