import React, { useEffect } from 'react'
import { Divider } from '@material-ui/core'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

import { ErrorBox, ProgressBox } from 'components/common'
import { User } from 'services/api'
import { State, ReposFetchStatus, userSelectors, userActions, reposSelectors, reposActions } from 'state'

import BackButton from './BackButton'
import UserCard from './UserCard'
import ReposProgress from './ReposProgress'
import ReposList from './ReposList'

const { getUserData, getUserError, isUserDataFetching } = userSelectors
const { request: requestUserData } = userActions
const { getReposFetchStatus, getReposUsername } = reposSelectors
const { start: requestReposData } = reposActions

interface StateProps {
  user?: User
  isUserFetching: boolean
  error?: string

  reposFetchStatus: ReposFetchStatus
  reposUsername?: string
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
  reposUsername,

  requestUserData,
  requestReposData
}) => {
  const { username: paramUsername } = useParams<{ username: string }>()

  const hasUserFetched = user && user.login === paramUsername

  useEffect(() => {
    if (paramUsername) {
      if (!hasUserFetched) {
        requestUserData(paramUsername)
      } else if (reposUsername !== paramUsername) {
        requestReposData(paramUsername)
      }
    }
  }, [paramUsername, hasUserFetched, reposUsername, requestUserData, requestReposData])

  if (!paramUsername) {
    return <ErrorBox error={'No such user'} />
  }

  if (error) {
    return <ErrorBox error={error} />
  }

  if (isUserFetching) {
    return <ProgressBox />
  }

  if (hasUserFetched) {
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

export default connect<StateProps, DispatchProps, {}, State>(
  state => ({
    user: getUserData(state),
    isUserFetching: isUserDataFetching(state),
    error: getUserError(state),
    reposFetchStatus: getReposFetchStatus(state),
    reposUsername: getReposUsername(state)
  }),
  { requestUserData, requestReposData }
)(UserRoute)
