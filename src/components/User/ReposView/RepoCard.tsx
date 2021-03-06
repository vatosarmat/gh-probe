import React from 'react'
import { connect } from 'react-redux'
import { Card, CardActionArea, Typography, Chip, CardContent, makeStyles } from '@material-ui/core'
import { Circle, SourceFork, Star } from 'mdi-material-ui'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'

import { State, reposSelectors } from 'state'
import { Repo } from 'services/api'
import { appConfig } from 'config'

const { getRepoById } = reposSelectors

dayjs.extend(calendar)

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingLeft: theme.spacing(appConfig.padding.repoListItem),
    paddingRight: theme.spacing(appConfig.padding.repoListItem),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

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
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      flexShrink: 0,
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      marginRight: theme.spacing(2)
    },
    '&:not(:last-child)': {
      marginRight: theme.spacing(4)
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
  id: string
}

type RepoCardProps = StateProps & OwnProps

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const styles = useStyles()

  if (!repo) {
    return null
  }

  const { name, description, primaryLanguage, starsCount, forksCount, createdAt, pushedAt, url, isArchived } = repo

  return (
    <Card elevation={0}>
      <CardActionArea disableRipple component="a" href={url} target="_blank">
        <CardContent className={styles.cardContent}>
          <div className={styles.repoName}>
            <Typography variant="h6">{name}</Typography>
            {isArchived && (
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
              {primaryLanguage && (
                <div className={styles.itemWithIcon}>
                  <Circle fontSize="inherit" htmlColor={primaryLanguage.color ?? undefined} />{' '}
                  <Typography variant="caption">{primaryLanguage.name}</Typography>
                </div>
              )}
              {starsCount > 0 ? (
                <div className={styles.itemWithIcon}>
                  <Star fontSize="inherit" htmlColor="gray" /> <Typography variant="caption">{starsCount}</Typography>
                </div>
              ) : null}
              {forksCount > 0 ? (
                <div className={styles.itemWithIcon}>
                  <SourceFork fontSize="inherit" htmlColor="gray" />{' '}
                  <Typography variant="caption">{forksCount}</Typography>
                </div>
              ) : null}
            </div>
            <div className={styles.infoRow}>
              <Typography variant="caption">
                Created{' '}
                {dayjs(createdAt).calendar(undefined, {
                  sameElse: 'MMM D, YYYY'
                })}
              </Typography>
              {pushedAt && (
                <Typography variant="caption">
                  Pushed{' '}
                  {dayjs(pushedAt).calendar(undefined, {
                    sameElse: 'MMM D, YYYY'
                  })}
                </Typography>
              )}
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
