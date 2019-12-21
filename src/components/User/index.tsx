import React, { useEffect } from 'react'
import { Divider } from '@material-ui/core'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import { ErrorBox, ProgressBox } from 'components/common'
import { User } from 'services/api'
import { State, ReposFetchStatus, userSelectors, userActions, reposSelectors, reposActions } from 'state'

import UserCard from './UserCard'
import ReposProgress from './ReposProgress'
import ReposList from './ReposList'

const { getUserData, getUserError, isUserDataFetching } = userSelectors
const { request: requestUserData } = userActions
const { getReposFetchStatus } = reposSelectors
const { start: requestReposData } = reposActions

interface StateProps {
  user?: User
  isUserFetching: boolean
  error?: string

  reposFetchStatus: ReposFetchStatus
}

interface DispatchProps {
  requestUserData: typeof requestUserData
  requestReposData: typeof requestReposData
}

type UserRouteProps = StateProps & DispatchProps

const UserRoute: React.FC<UserRouteProps> = ({
  user,
  isUserFetching,
  error,
  reposFetchStatus,

  requestUserData,
  requestReposData
}) => {
  const { username } = useParams<{ username: string }>()

  useEffect(() => {
    if (username) {
      if (!user || user.login !== username) {
        requestUserData(username)
      } else if (reposUsername !== match.params.username) {
        fetchReposStart(match.params.username)
      }
    }
  }, [username, user])

  if (!username) {
    return <ErrorBox error={'No such user'} />
  }

  if (error) {
    return <ErrorBox error={error} />
  }

  if (isFetching) {
    return <ProgressBox />
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
