import React, { useEffect } from 'react'
import { Divider, Box, Typography, CircularProgress, makeStyles, Link, Button } from '@material-ui/core'
import { Group, LocationOn, Bookmark, ArrowBack } from '@material-ui/icons'
import { connect } from 'react-redux'
import { RouteChildrenProps } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import UserCard from './UserCard'
import ReposProgress from './ReposProgress'
import ReposList from './ReposList'
import {
  State,
  getUserData,
  getUserIsFetching,
  getUserError,
  getReposStatus,
  fetchUserRequest,
  fetchReposStart,
  getReposUsername
} from 'state'
import { User } from 'services/api'
import { ReposFetchStatus } from 'services/repos'

interface UserRouteProps extends RouteChildrenProps<{ username: string }> {
  readonly fetchUserRequest: typeof fetchUserRequest
  readonly fetchReposStart: typeof fetchReposStart

  readonly reposFetchStatus: ReposFetchStatus
  readonly reposUsername: string

  readonly isFetching: boolean
  readonly error: Error | null
}

const UserRoute: React.FC<UserRouteProps> = ({
  match,
  isFetching,
  error,
  reposFetchStatus,
  reposUsername,
  fetchUserRequest,
  fetchReposStart
}) => {
  useEffect(() => {
    if (!match) {
      return
    }

    if (!user || user.login !== match.params.username) {
      fetchUserRequest(match.params.username)
    } else if (reposUsername !== match.params.username) {
      fetchReposStart(match.params.username)
    }
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

  if (user && match && user.login === match.params.username) {
    return (
      <>
        <BackButton />
        <UserCard user={user} />
        <Divider />
        {reposFetchStatus === 'IDLE' || reposFetchStatus === 'IN_PROGRESS' ? <ReposProgress /> : <ReposList />}
      </>
    )
  }
  return null
}

export default connect(
  (state: State) => ({
    user: getUserData(state),
    isFetching: getUserIsFetching(state),
    error: getUserError(state),
    reposFetchStatus: getReposStatus(state),
    reposUsername: getReposUsername(state)
  }),
  { fetchUserRequest, fetchReposStart }
)(UserRoute)
