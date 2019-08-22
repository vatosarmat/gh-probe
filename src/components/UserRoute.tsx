import React, { useEffect } from 'react'
import { Divider, Box, Typography, CircularProgress, makeStyles, Link } from '@material-ui/core'
import { Group, LocationOn, Bookmark } from '@material-ui/icons'
import { connect } from 'react-redux'
import { RouteChildrenProps } from 'react-router'

import ReposList from './ReposList'
import { State, getUserData, getUserIsFetching, getUserError, fetchUserRequest } from 'state'
import { User } from 'concepts/api'

const useStyles = makeStyles(theme => ({
  img: {
    flexBasis: '25%',
    flexShrink: 0,
    borderRadius: theme.shape.borderRadius
  },
  repoInfoIcon: {
    marginRight: theme.spacing(1)
  },

  repoInfoCaption: {
    marginRight: theme.spacing(3)
  }
}))

interface IconWithCaptionProps {
  readonly icon: React.ComponentType<any>
  readonly caption: string
  readonly link?: true
}

const IconWithCaption: React.FC<IconWithCaptionProps> = ({ icon: Icon, caption, link }) => {
  const styles = useStyles()

  return (
    <Box display="flex" flexWrap="nowrap" py={0.5}>
      <Icon className={styles.repoInfoIcon} htmlColor="gray" />
      {link ? (
        <Link className={styles.repoInfoCaption} href={caption} target="_blank">
          {caption}
        </Link>
      ) : (
        <Typography className={styles.repoInfoCaption} variant="body2">
          {caption}
        </Typography>
      )}
    </Box>
  )
}

interface UserCardProps {
  readonly user: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const styles = useStyles()
  let { login, name, bio, avatar_url, location, company, blog } = user

  name = name || login

  return (
    <Box p={4}>
      <Box display="flex" mb={2} alignItems="start">
        <img src={avatar_url} alt={name} className={styles.img} />
        <Box px={2}>
          <Typography variant="h5">{name}</Typography>
          {name === login || (
            <Typography variant="subtitle1" color="textSecondary">
              {login}
            </Typography>
          )}
          <Box display="flex" flexWrap="wrap">
            {company && <IconWithCaption icon={Group} caption={company} />}
            {location && <IconWithCaption icon={LocationOn} caption={location} />}
            {blog && <IconWithCaption icon={Bookmark} caption={blog} link />}
          </Box>
        </Box>
      </Box>
      {bio && <Typography>{bio}</Typography>}
    </Box>
  )
}

interface UserRouteProps extends RouteChildrenProps<{ username: string }> {
  readonly fetchUserRequest: typeof fetchUserRequest

  readonly user: User | null
  readonly isFetching: boolean
  readonly error: Error | null
}

const UserRoute: React.FC<UserRouteProps> = ({
  match,
  user,
  isFetching,
  error,
  fetchUserRequest
}) => {
  useEffect(() => {
    if (match && (!user || user.login !== match.params.username)) {
      fetchUserRequest(match.params.username)
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
        <UserCard user={user} />
        <Divider />
        <ReposList />
      </>
    )
  }
  return null
}

export default connect(
  (state: State) => ({
    user: getUserData(state),
    isFetching: getUserIsFetching(state),
    error: getUserError(state)
  }),
  { fetchUserRequest }
)(UserRoute)
