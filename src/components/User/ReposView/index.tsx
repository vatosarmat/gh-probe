import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Typography, FormControlLabel, Checkbox, makeStyles } from '@material-ui/core'

import { State, ReposFetchStatus, ANY_LANGUAGE, NO_LANGUAGE, LanguageInfo, reposSelectors } from 'state'
import ArraySelect from 'components/common/ArraySelect'

import RepoList from './RepoList'

const { getReposFetchStatus, getReposError, getLanguageInfos, haveReposStars } = reposSelectors

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(7)
  },

  languageSelect: {
    marginBottom: theme.spacing(1)
  },

  sortByStarsFormControl: {
    marginBottom: theme.spacing(2)
  }
}))

//

interface ErrorMessageProps {
  show: boolean
  error?: string
}

const ErrorMessage = React.memo<ErrorMessageProps>(({ show, error }) =>
  show ? (
    <Typography variant="subtitle1" color="error" display="block">
      {error ? <>{error.toString()}</> : 'Unknown error'}
    </Typography>
  ) : null
)

//

interface WarningMessageProps {
  wasAborted: boolean
  wasError: boolean
}

const WarningMessage = React.memo<WarningMessageProps>(({ wasAborted, wasError }) =>
  wasAborted || wasError ? (
    <Typography component="em" variant="caption" display="block" gutterBottom>
      {wasAborted
        ? 'Some data may be missing due to request interruption'
        : wasError
        ? 'Some data may be missing due to request error'
        : null}
    </Typography>
  ) : null
)

//

interface StateProps {
  reposFetchStatus: ReposFetchStatus
  error?: string
  languageInfos: LanguageInfo[]
  haveStars: boolean
}

type ReposViewProps = StateProps

const ReposView: React.FC<ReposViewProps> = ({ reposFetchStatus, error, languageInfos, haveStars }) => {
  const [selectedLanguageIdx, setSelectedLanguageIdx] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const [sortByStars, setSortByStars] = useState<boolean>(false)

  useEffect(() => {
    setSelectedLanguageIdx(0)
  }, [languageInfos, setSelectedLanguageIdx])

  useEffect(() => {
    setPage(0)
  }, [selectedLanguageIdx, setPage])

  const languagesIndexes = useMemo(() => languageInfos.map((v, k) => k), [languageInfos])

  const styles = useStyles()

  const handlePrevClick = () => setPage(p => p - 1)
  const handleNextClick = () => setPage(p => p + 1)
  const handleSortByStarsChange = () => setSortByStars(s => !s)
  const getLabel = (idx: number) => {
    const lang = languageInfos[idx].language
    return lang === ANY_LANGUAGE ? 'All' : lang === NO_LANGUAGE ? 'None' : lang
  }

  const { language, repoCount } = languageInfos[selectedLanguageIdx]

  return (
    <div className={styles.root}>
      <ErrorMessage show={reposFetchStatus === 'ERROR'} error={error} />
      <WarningMessage wasAborted={reposFetchStatus === 'ABORTED'} wasError={reposFetchStatus === 'ERROR'} />

      <ArraySelect
        className={styles.languageSelect}
        prefix="Language"
        suffix={`${repoCount} repos`}
        value={selectedLanguageIdx}
        array={languagesIndexes}
        getLabel={getLabel}
        onChange={setSelectedLanguageIdx}
      />

      {haveStars && (
        <FormControlLabel
          className={styles.sortByStarsFormControl}
          control={
            <Checkbox color="primary" checked={sortByStars} onChange={handleSortByStarsChange} value="sortByStars" />
          }
          label="Sort by stars"
        />
      )}

      <RepoList
        language={language}
        page={page}
        sortByStars={sortByStars}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
    </div>
  )
}

export default connect<StateProps, {}, {}, State>(state => ({
  reposFetchStatus: getReposFetchStatus(state),
  error: getReposError(state),
  languageInfos: getLanguageInfos(state),
  haveStars: haveReposStars(state)
}))(ReposView)
