import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  createStyles,
  Divider,
  FormControlLabel,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from '@material-ui/core'

import React, { ChangeEvent, Component } from 'react'
import { connect } from 'react-redux'

import ArraySelect from '../common/ArraySelect'
import { State, getReposItems, getReposProgress, getReposStatus, getReposError, getReposPerPage } from 'state'
import { Repo } from 'services/api'
import { ReposFetchStatus, ReposFetchProgress } from 'services/repos'

const styles = (theme: Theme) =>
  createStyles({
    languageSelect: {
      marginBottom: theme.spacing(1)
    },

    starSortFormControl: {
      marginBottom: theme.spacing(2)
    },

    pagButtons: {
      flexGrow: 1
    },

    ownerAvatar: {
      marginRight: theme.spacing(1)
    }
  })

interface ReposListProps extends WithStyles<typeof styles> {
  readonly reposPerPage: number

  readonly items: Repo[]
  readonly status: ReposFetchStatus
  readonly progress: ReposFetchProgress | null
  readonly error: Error | null
}

const ALL_LANGUAGES = 'ALL_LANGUAGES'
const NO_LANGUAGE = 'NO_LANGUAGE'

interface ReposListState {
  page: number
  language: string
  starSort: boolean
}

class ReposList extends Component<ReposListProps, ReposListState> {
  state: ReposListState = {
    page: 0,
    language: ALL_LANGUAGES,
    starSort: false
  }

  handleNextClick = () => {
    this.setState(({ page }, { items, reposPerPage }) =>
      ReposList.hasNextPage(items.length, page, reposPerPage)
        ? {
            page: page + 1
          }
        : { page }
    )
  }

  handlePreviousClick = () => {
    this.setState(state =>
      state.page > 0
        ? {
            ...state,
            page: state.page - 1
          }
        : state
    )
  }

  handleLanguageChange = (value: string) => {
    this.setState({
      language: value,
      page: 0
    })
  }

  handleStarSortChange = (evt: ChangeEvent, checked: boolean) => {
    this.setState({
      starSort: checked,
      page: 0
    })
  }

  static hasNextPage(length: number, page: number, perPage: number) {
    return (page + 1) * perPage < length
  }

  renderRepoListControl(hasStars: boolean, languages: Language[], pagFrom: number, pagTo: number, total: number) {
    const {
      reposPerPage,

      status,
      error,

      classes
    } = this.props
    const { language, starSort } = this.state

    return (
      <>
        {status === 'ERROR' && (
          <Typography variant="subtitle1" color="error" display="block">
            {error ? (
              <>
                {error.toString()}
                <br />
                {error.message}
              </>
            ) : (
              'Unknown error'
            )}
          </Typography>
        )}
        {status === 'ABORTED' || status === 'ERROR' ? (
          <Typography component="em" variant="caption" display="block" gutterBottom>
            {status === 'ABORTED'
              ? 'Some data may be missing due to request interruption'
              : status === 'ERROR'
              ? 'Some data may be missing due to request error'
              : null}
          </Typography>
        ) : null}
        <ArraySelect
          className={classes.languageSelect}
          prefix="Language"
          suffix={`${total} repos`}
          value={language}
          array={languages}
          getLabel={lang => (lang === ALL_LANGUAGES ? 'All' : lang === NO_LANGUAGE ? 'None' : lang)}
          onChange={this.handleLanguageChange}
        />
        {hasStars && (
          <FormControlLabel
            className={classes.starSortFormControl}
            control={
              <Checkbox color="primary" checked={starSort} onChange={this.handleStarSortChange} value="starSort" />
            }
            label="Sort by stars"
          />
        )}
        {total > reposPerPage && (
          <Typography variant="body2">
            Showing {pagFrom + 1} to {pagTo}
          </Typography>
        )}
      </>
    )
  }

  render() {
    const { page, language, starSort } = this.state
    const { reposPerPage, items, classes } = this.props

    type LanguageDict = {
      [language: string]: number
    }

    const languagesDict: LanguageDict = items.reduce(
      (ld: LanguageDict, repo: Repo) => {
        const key = repo.language ? repo.language : NO_LANGUAGE
        ld[key] = ld[key] ? ld[key] + 1 : 1
        return ld
      },
      { [ALL_LANGUAGES]: Infinity } as LanguageDict
    )

    const languages = Object.keys(languagesDict).sort((a, b) => {
      return languagesDict[b] - languagesDict[a]
    })

    const displayRepos =
      language === ALL_LANGUAGES
        ? items.slice()
        : items.filter(repo => {
            const p = repo.language === language || (!repo.language && language === NO_LANGUAGE)

            return p
          })

    const hasStars = displayRepos.some(repo => repo.stargazers_count > 0)

    if (hasStars && starSort) {
      displayRepos.sort((a, b) => b.stargazers_count - a.stargazers_count)
    }

    const pagFrom = page * reposPerPage
    const pagTo = Math.min((page + 1) * reposPerPage, displayRepos.length)

    return (
      <Box px={2} pt={4} pb={7}>
        {this.renderRepoListControl(hasStars, languages, pagFrom, pagTo, displayRepos.length)}
        <Box component="ul" m={0} px={0} pb={5}>
          {displayRepos.slice(pagFrom, pagTo).map(rep => (
            <li key={rep.id} className={classes.li}>
              {this.renderRepoCard(rep)}
              <Divider />
            </li>
          ))}
        </Box>
        {displayRepos.length > reposPerPage && (
          <Box component={ButtonGroup} {...{ fullWidth: true }} px={'30%'}>
            <Button disabled={page <= 0} onClick={this.handlePreviousClick}>
              Previous
            </Button>
            <Button
              disabled={!ReposList.hasNextPage(displayRepos.length, page, reposPerPage)}
              onClick={this.handleNextClick}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    )
  }
}

export default connect((state: State) => ({
  reposPerPage: getReposPerPage(state),
  items: getReposItems(state),
  status: getReposStatus(state),
  progress: getReposProgress(state),
  error: getReposError(state)
}))(withStyles(styles)(ReposList))
