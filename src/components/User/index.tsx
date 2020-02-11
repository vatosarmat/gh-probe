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
import ReposView from './ReposView'

const { getUserQuery, getUserData, getUserError, isUserDataFetching } = userSelectors
const { request: requestUserData } = userActions
const { getReposFetchStatus, getReposUsername } = reposSelectors
const { start: requestReposData } = reposActions

interface StateProps {
  userQuery?: string
  userData?: User
  isUserDataFetching: boolean
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
  userQuery,
  userData,
  isUserDataFetching,
  error,
  reposFetchStatus,
  reposUsername,

  requestUserData,
  requestReposData
}) => {
  const { username: paramUsername } = useParams<{ username: string }>()

  const wasUserRequested = userQuery === paramUsername
  const hasUserFetched = wasUserRequested && userData && userData.login === userQuery

  useEffect(() => {
    if (!paramUsername) {
      return
    }

    if (!wasUserRequested) {
      requestUserData(paramUsername)
    } else if (hasUserFetched && reposUsername !== paramUsername) {
      requestReposData(paramUsername)
    }
  }, [paramUsername, reposUsername, wasUserRequested, hasUserFetched, requestUserData, requestReposData])

  let content = null

  if (!paramUsername) {
    content = <ErrorBox error={'No such user'} />
  } else if (error) {
    content = <ErrorBox error={error} />
  } else if (isUserDataFetching) {
    content = <ProgressBox />
  } else if (hasUserFetched) {
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
  state => ({
    userQuery: getUserQuery(state),
    userData: getUserData(state),
    isUserDataFetching: isUserDataFetching(state),
    error: getUserError(state),
    reposFetchStatus: getReposFetchStatus(state),
    reposUsername: getReposUsername(state)
  }),
  { requestUserData, requestReposData }
)(UserRoute)
