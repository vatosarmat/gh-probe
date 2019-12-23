import React from 'react'
import { Typography, makeStyles } from '@material-ui/core'
import { Group, LocationOn, Bookmark } from '@material-ui/icons'

import IconWithText from './IconWithText'
import { User } from 'services/api'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2.5)
  },

  content: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2)
  },

  textContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },

  info: {
    display: 'flex',
    flexWrap: 'wrap'
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
  if (!user) {
    return null
  }
  let { login, name, bio, avatar_url, location, company, blog } = user

  name = name || login

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
          <div className={styles.info}>
            {company && <IconWithText icon={Group} caption={company} />}
            {location && <IconWithText icon={LocationOn} caption={location} />}
            {blog && <IconWithText icon={Bookmark} caption={blog} link />}
          </div>
        </div>
      </div>
      {bio && <Typography>{bio}</Typography>}
    </div>
  )
}

export default UserCard
