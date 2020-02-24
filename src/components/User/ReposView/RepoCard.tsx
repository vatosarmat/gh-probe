import React from 'react'
import { connect } from 'react-redux'
import { Card, CardActionArea, Typography, Chip, CardContent, makeStyles } from '@material-ui/core'
import { Circle, SourceFork, Star } from 'mdi-material-ui'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'

import { State, reposSelectors } from 'state'
import { Repo } from 'services/api'
import getLangColor from 'services/lang-color'
import { appConfig } from 'config'

const { getRepoById } = reposSelectors

dayjs.extend(calendar)

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(appConfig.padding.repoListItem),
    paddingRight: theme.spacing(appConfig.padding.repoListItem),

    '&:last-child': {
      paddingBottom: theme.spacing(4)
    }
  },

  repoName: {
    display: 'flex',
    alignItems: 'center'
  },

  archivedChip: {
    borderRadius: 4,
    marginLeft: theme.spacing(1)
  },

  infoBlock: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },

  infoRow: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(4),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      flexShrink: 0,
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      marginRight: theme.spacing(2)
    }
  },

  itemWithIcon: {
    '& > *': {
      verticalAlign: 'middle'
    }
  }
}))

interface StateProps {
  repo?: Repo
}

interface OwnProps {
  id: number
}

type RepoCardProps = StateProps & OwnProps

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const styles = useStyles()

  if (!repo) {
    return null
  }

  const { name, description, language, stargazers_count, forks_count, created_at, pushed_at, html_url, archived } = repo

  return (
    <Card elevation={0}>
      <CardActionArea disableRipple component="a" href={html_url} target="_blank">
        <CardContent className={styles.cardContent}>
          <div className={styles.repoName}>
            <Typography variant="h6">{name}</Typography>
            {archived && (
              <Chip
                label="archived"
                className={styles.archivedChip}
                color="secondary"
                variant="outlined"
                size="small"
              />
            )}
          </div>
          <Typography color="textSecondary">{description}</Typography>
          <div className={styles.infoBlock}>
            <div className={styles.infoRow}>
              {language && (
                <div className={styles.itemWithIcon}>
                  <Circle fontSize="inherit" htmlColor={getLangColor(language)} />{' '}
                  <Typography variant="caption">{language}</Typography>
                </div>
              )}
              {stargazers_count > 0 ? (
                <div className={styles.itemWithIcon}>
                  <Star fontSize="inherit" htmlColor="gray" />{' '}
                  <Typography variant="caption">{stargazers_count}</Typography>
                </div>
              ) : null}
              {forks_count > 0 ? (
                <div className={styles.itemWithIcon}>
                  <SourceFork fontSize="inherit" htmlColor="gray" />{' '}
                  <Typography variant="caption">{forks_count}</Typography>
                </div>
              ) : null}
            </div>
            <div className={styles.infoRow}>
              <Typography variant="caption">
                Created{' '}
                {dayjs(created_at).calendar(undefined, {
                  sameElse: 'MMM D, YYYY'
                })}
              </Typography>
              <Typography variant="caption">
                Pushed{' '}
                {dayjs(pushed_at).calendar(undefined, {
                  sameElse: 'MMM D, YYYY'
                })}
              </Typography>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  repo: getRepoById(state, props)
}))(RepoCard)
