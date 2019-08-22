import React, { useEffect } from 'react'
import { Divider, Box, Typography, CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'

import ReposList from './ReposList'
import { State, getUserData, getUserIsFetching, getUserError, fetchUserRequest } from 'state'
import { User } from 'concepts/api'

interface UserCardProps {
  readonly user: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { login, type, name, bio, avatar_url, location, company, blog } = user

  return (
    <Box p={6}>
      <img src={avatar_url} alt={name} />
      <Typography variant="h5" />
    </Box>
  )
}

interface UserRouteProps {
  readonly username: string

  readonly fetchUserRequest: typeof fetchUserRequest

  readonly user: User | null
  readonly isFetching: boolean
  readonly error: Error | null
}

const UserRoute: React.FC<UserRouteProps> = ({
  username,
  user,
  isFetching,
  error,
  fetchUserRequest
}) => {
  useEffect(() => {
    fetchUserRequest(username)
  })

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

  if (isFetching) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <UserCard />
      <Divider />
      <ReposList />
    </>
  )
}

export default connect(
  (state: State) => ({
    user: getUserData(state),
    isFetching: getUserIsFetching(state),
    error: getUserError(state)
  }),
  { fetchUserRequest }
)(UserRoute)
