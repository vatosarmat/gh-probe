import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  Link,
  Tooltip,
  ClickAwayListener,
  useMediaQuery,
  makeStyles
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { CSSProperties } from '@material-ui/styles'
import { AccountSearch } from 'mdi-material-ui'
import React, {
  Fragment,
  useState,
  ChangeEvent,
  MouseEvent,
  FormEvent,
  KeyboardEvent,
  RefObject,
  useRef,
  useEffect
} from 'react'
import { connect } from 'react-redux'
import { reduce } from 'lodash'

import { usersSearchActions } from 'state'
import { appConfig } from 'config'

const { request: searchRequest } = usersSearchActions

const useStyles = makeStyles(theme => ({
  form: reduce(
    appConfig.padding.searchUserForm,
    (css: CSSProperties, value, breakpoint) => ({
      ...css,
      [theme.breakpoints.up(breakpoint as Breakpoint)]: {
        padding: theme.spacing(value)
      }
    }),
    {}
  ),
  searchInputRow: {
    display: 'flex',
    alignItems: 'flex-start',
    '& > *': {
      marginRight: theme.spacing(1)
    },
    marginBottom: theme.spacing(1)
  },

  accountSearchIcon: {
    position: 'relative',
    top: theme.spacing(2)
  },

  searchInput: {
    wordSpacing: '.4rem'
  },

  exampleSpan: {
    cursor: 'pointer',
    textDecoration: 'underline dotted',
    '-webkit-text-decoration': 'underline dotted'
  },

  searchButton: {
    marginRight: 0,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      minWidth: 40,
      top: theme.spacing(2.75)
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      top: theme.spacing(2.5)
    }
  },

  searchModifiers: {
    wordSpacing: '.8rem',
    marginLeft: '.8rem'
  },

  searchModifier: {
    cursor: 'pointer'
  }
}))

interface DispatchProps {
  searchRequest: typeof searchRequest
}

type SearchUsersFormProps = DispatchProps

const SEARCH_INPUT_ID = '23852db036abed4725193c1663bcecca'

const SearchUserForm: React.FC<SearchUsersFormProps> = ({ searchRequest }) => {
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState(false)
  const inputElementRef: RefObject<HTMLInputElement> = useRef(null)

  const focusInput = () => {
    const { current } = inputElementRef
    if (current) {
      current.focus()
    }
  }

  useEffect(focusInput, [])

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInput(evt.target.value)

  const handleButtonClick = () => {
    setInput(value => {
      const query = value.toString().trim()
      if (query) {
        searchRequest(query)
        return query
      } else {
        setInputError(true)
        return ''
      }
    })
  }

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      handleButtonClick()
    }
  }

  const handleExampleClick = (evt: MouseEvent<HTMLSpanElement>) => {
    const {
      currentTarget: {
        dataset: { text }
      }
    } = evt

    if (text) {
      setInput(text)
      focusInput()
    }
  }

  const handleClickAway = () => {
    setInputError(false)
  }

  const handleSearchModifierClick = (evt: MouseEvent<HTMLElement>) => {
    const {
      currentTarget: {
        dataset: { modifier }
      }
    } = evt

    if (modifier) {
      setInput(value => `${value} ${modifier}`)
      focusInput()
    }
  }

  const theme = useTheme()
  const isScreenSmall = useMediaQuery(theme.breakpoints.down('xs'))
  const styles = useStyles()
  const { exampleUsers, searchUserLabel, emptySearchQueryTooltip } = appConfig
  const lastExample = exampleUsers[exampleUsers.length - 1]

  return (
    <form className={styles.form} onSubmit={(evt: FormEvent) => evt.preventDefault()}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={styles.searchInputRow}>
          {isScreenSmall ? null : <AccountSearch fontSize="large" className={styles.accountSearchIcon} />}
          <Tooltip title={emptySearchQueryTooltip} open={inputError} placement="top">
            <FormControl fullWidth error={!input}>
              <InputLabel htmlFor={SEARCH_INPUT_ID}>{searchUserLabel}</InputLabel>

              <Input
                error={inputError}
                name="input"
                spellCheck={false}
                id={SEARCH_INPUT_ID}
                classes={{
                  input: styles.searchInput
                }}
                value={input}
                inputRef={inputElementRef}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <FormHelperText component="em" error={false}>
                Examples:{' '}
                {exampleUsers.slice(0, -1).map(example => (
                  <Fragment key={example}>
                    <span className={styles.exampleSpan} onClick={handleExampleClick} data-text={example}>
                      {example}
                    </span>
                    {', '}
                  </Fragment>
                ))}
                {
                  <span className={styles.exampleSpan} onClick={handleExampleClick} data-text={lastExample}>
                    {lastExample}
                  </span>
                }
              </FormHelperText>
            </FormControl>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleButtonClick}
            className={styles.searchButton}
          >
            {isScreenSmall ? <AccountSearch fontSize="small" /> : 'Search'}
          </Button>
        </div>
      </ClickAwayListener>
      <Typography variant={isScreenSmall ? 'body2' : 'body1'}>
        Add modifier:{' '}
        <span className={styles.searchModifiers}>
          <Link
            component="span"
            className={styles.searchModifier}
            onClick={handleSearchModifierClick}
            data-modifier="in:login"
          >
            in:login
          </Link>{' '}
          <Link
            component="span"
            className={styles.searchModifier}
            onClick={handleSearchModifierClick}
            data-modifier="type:organization"
          >
            type:organization
          </Link>
        </span>
      </Typography>
    </form>
  )
}

export default connect(() => ({}), {
  searchRequest
})(SearchUserForm)
