import React from 'react'
import { Typography, makeStyles, useTheme, useMediaQuery } from '@material-ui/core'
import { Group, LocationOn, Bookmark } from '@material-ui/icons'

import IconWithText from './IconWithText'
import { User } from 'services/api'
import { appConfig } from 'config'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(appConfig.padding.userCard)
  },

  content: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 0
  },

  textContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },

  info: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(2)
    }
  },

  img: {
    width: '100%',
    borderRadius: theme.shape.borderRadius
  },

  imgContainer: {
    flexBasis: '25%',
    flexShrink: 0
  }
}))

interface UserCardProps {
  user?: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const styles = useStyles()
  const theme = useTheme()
  const isScreenSmall = useMediaQuery(theme.breakpoints.down('xs'))

  if (!user) {
    return null
  }
  let { login, name, bio, avatar_url, location, company, blog } = user

  name = name || login

  const info = (
    <div className={styles.info}>
      {company && <IconWithText icon={Group} caption={company} />}
      {location && <IconWithText icon={LocationOn} caption={location} />}
      {blog && <IconWithText icon={Bookmark} caption={blog} link />}
    </div>
  )

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src={avatar_url} alt={name} />
        </div>
        <div className={styles.textContainer}>
          <Typography variant="h5">{name}</Typography>
          {name === login || (
            <Typography variant="subtitle1" color="textSecondary">
              {login}
            </Typography>
          )}
          {isScreenSmall ? null : info}
        </div>
      </div>
      {isScreenSmall && info}
      {bio && <Typography>{bio}</Typography>}
    </div>
  )
}

export default UserCard
