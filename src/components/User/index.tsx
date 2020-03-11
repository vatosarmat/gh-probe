import React, { useEffect } from 'react'
import { Divider } from '@material-ui/core'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

import { ErrorBox, ProgressBox } from 'components/common'
import { User } from 'services/api'
import { State, ReposFetchStatus, reposSelectors, reposActions } from 'state'

import BackButton from './BackButton'
import UserCard from './UserCard'
import ReposProgress from './ReposProgress'
import ReposView from './ReposView'

const {
  getRequestedUserLogin,
  getReposUserData,
  isUserDataFetching,
  getUserDataFetchError,
  getReposFetchStatus
} = reposSelectors
const { start: requestUserAndReposData, stop: stopReposDataLoading } = reposActions

interface StateProps {
  requestedUserLogin?: string
  userData?: User
  isUserDataFetching: boolean
  error?: string
  reposFetchStatus: ReposFetchStatus
}

interface DispatchProps {
  requestUserAndReposData: typeof requestUserAndReposData
  stopReposDataLoading: typeof stopReposDataLoading
}

type UserRouteProps = StateProps & DispatchProps

const UserRoute: React.FC<UserRouteProps> = ({
  requestedUserLogin,
  userData,
  isUserDataFetching,
  error,
  reposFetchStatus,

  requestUserAndReposData,
  stopReposDataLoading
}) => {
  const { login: routeParamLogin } = useParams<{ login: string }>()
  const wasUserDataRequested = requestedUserLogin === routeParamLogin
  const wasUserDataFetched = wasUserDataRequested && userData

  useEffect(() => {
    if (!routeParamLogin) {
      return
    }

    if (!wasUserDataRequested) {
      requestUserAndReposData(routeParamLogin)
    }
  }, [routeParamLogin, wasUserDataRequested, requestUserAndReposData])

  useEffect(
    () => () => {
      stopReposDataLoading()
    },
    [stopReposDataLoading]
  )

  let content = null

  if (!routeParamLogin) {
    content = <ErrorBox error={'No such user'} />
  } else if (error) {
    content = <ErrorBox error={error} />
  } else if (isUserDataFetching) {
    content = <ProgressBox />
  } else if (wasUserDataFetched) {
    content = (
      <>
        <UserCard user={userData} />
        <Divider />
        {reposFetchStatus === 'IDLE' || reposFetchStatus === 'IN_PROGRESS' ? <ReposProgress /> : <ReposView />}
      </>
    )
  }

  return content ? (
    <>
      <BackButton />
      {content}
    </>
  ) : null
}

export default connect<StateProps, DispatchProps, {}, State>(
  (state: State) => ({
    requestedUserLogin: getRequestedUserLogin(state),
    userData: getReposUserData(state),
    isUserDataFetching: isUserDataFetching(state),
    error: getUserDataFetchError(state),
    reposFetchStatus: getReposFetchStatus(state)
  }),
  { requestUserAndReposData, stopReposDataLoading }
)(UserRoute)
