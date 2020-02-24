import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Typography, makeStyles, Divider } from '@material-ui/core'

import {
  State,
  ReposFetchStatus,
  ANY_LANGUAGE,
  NO_LANGUAGE,
  LanguageInfo,
  reposSelectors,
  RepoSortingKey,
  repoSortingKeyTuple,
  repoSortingKeyName,
  RepoSortingOrder,
  repoSortingOrderTuple
} from 'state'
import ArraySelect from 'components/common/ArraySelect'
import { appConfig } from 'config'

import RepoList from './RepoList'
import WarningMessage from './WarningMessage'

const { getReposFetchStatus, getReposError, getLanguageInfos, haveReposStars } = reposSelectors

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(7)
  },

  controlBlock: {
    padding: theme.spacing(appConfig.padding.repoListControl)
  },

  additionalMessage: {
    marginBottom: theme.spacing(1)
  },

  sortingBlock: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexShrink: 0,
      marginTop: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1)
      }
    }
  }
}))

interface ErrorMessageProps {
  show: boolean
  error?: string

  className?: string
}

const ErrorMessage = React.memo<ErrorMessageProps>(({ show, error, className }) => {
  return show ? (
    <Typography variant="subtitle1" color="error" display="block" className={className}>
      {error ? <>{error.toString()}</> : 'Unknown error'}
    </Typography>
  ) : null
})

interface StateProps {
  reposFetchStatus: ReposFetchStatus
  error?: string
  languageInfos: LanguageInfo[]
  haveStars: boolean
}

type ReposViewProps = StateProps

const ReposView: React.FC<ReposViewProps> = ({ reposFetchStatus, error, languageInfos, haveStars }) => {
  const [languageInfo, setLanguageInfo] = useState<LanguageInfo>(languageInfos[0])
  const [page, setPage] = useState<number>(0)
  const [sortingKey, setSortingKey] = useState<RepoSortingKey>('name')
  const [sortingOrder, setSortingOrder] = useState<RepoSortingOrder>('asc')

  const styles = useStyles()

  const handlePrevClick = () => setPage(p => p - 1)
  const handleNextClick = () => setPage(p => p + 1)

  const handleLanguageInfoChange = (languageInfo: LanguageInfo) => {
    setLanguageInfo(languageInfo)
    setPage(0)
  }

  const handleSortingKeyChange = (sortingKey: RepoSortingKey) => {
    setSortingKey(sortingKey)
    setPage(0)
  }

  const handleSortingOrderChange = (sortingOrder: RepoSortingOrder) => {
    setSortingOrder(sortingOrder)
    setPage(0)
  }

  const getLanguageInfoLabel = (languageInfo: LanguageInfo) => {
    const lang = languageInfo.language
    return lang === ANY_LANGUAGE ? 'All' : lang === NO_LANGUAGE ? 'None' : lang
  }

  const getSortingKeyLabel = (key: RepoSortingKey) => repoSortingKeyName[key]

  const { language, repoCount } = languageInfo

  return (
    <div className={styles.root}>
      <div className={styles.controlBlock}>
        <ErrorMessage className={styles.additionalMessage} show={reposFetchStatus === 'ERROR'} error={error} />
        <WarningMessage
          className={styles.additionalMessage}
          wasStopped={reposFetchStatus === 'STOPPED'}
          wasError={reposFetchStatus === 'ERROR'}
        />

        <ArraySelect
          prefix="Language"
          suffix={`${repoCount} repos`}
          value={languageInfo}
          array={languageInfos}
          getLabel={getLanguageInfoLabel}
          onChange={handleLanguageInfoChange}
        />
        <div className={styles.sortingBlock}>
          <ArraySelect
            prefix="Sort by"
            value={sortingKey}
            array={repoSortingKeyTuple}
            getLabel={getSortingKeyLabel}
            onChange={handleSortingKeyChange}
          />

          <ArraySelect
            prefix="in"
            suffix={'ending order'}
            value={sortingOrder}
            array={repoSortingOrderTuple}
            onChange={handleSortingOrderChange}
          />
        </div>
      </div>

      <Divider />

      <RepoList
        language={language}
        page={page}
        sortingKey={sortingKey}
        sortingOrder={sortingOrder}
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
