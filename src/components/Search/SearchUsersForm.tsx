import {
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Theme,
  withStyles,
  WithStyles,
  Typography,
  Link,
  Tooltip,
  ClickAwayListener
} from '@material-ui/core'
import { AccountSearch } from 'mdi-material-ui'
import cuid from 'cuid'
import React, { Fragment, ChangeEvent, Component, MouseEvent, FormEvent, KeyboardEvent, RefObject } from 'react'
import { connect } from 'react-redux'

import { usersSearchActions } from 'state'
import { appConfig } from 'config'

const { request: searchRequest } = usersSearchActions

const styles = (theme: Theme) =>
  createStyles({
    form: {
      padding: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4)
      }
    },

    searchInputRow: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: theme.spacing(4)
    },

    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2)
    },

    searchInput: {
      wordSpacing: '.4rem'
    },

    icon: {
      marginBottom: -4
    },

    helperText: {
      position: 'absolute',
      top: '100%'
    },

    exampleSpan: {
      cursor: 'pointer',
      textDecoration: 'underline dotted'
    },

    searchModifiers: {
      wordSpacing: '.8rem',
      marginLeft: '.8rem'
    },

    searchModifier: {
      cursor: 'pointer'
    }
  })

interface DispatchProps {
  searchRequest: typeof searchRequest
}

type OwnProps = WithStyles<typeof styles>

type SearchUsersFormProps = DispatchProps & OwnProps

interface SearchUsersFormState {
  input: string
  error: boolean
}

class SearchUsersForm extends Component<SearchUsersFormProps, SearchUsersFormState> {
  state = {
    input: '',
    error: false
  }

  inputElementId = cuid()
  inputElementRef: RefObject<HTMLInputElement> = React.createRef()

  handleInputChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value: input } = evt.target

    this.setState({
      input,
      error: false
    })
  }

  handleButtonClick = () => {
    const { searchRequest } = this.props
    const { input } = this.state

    const query = input.toString().trim()

    if (query) {
      this.setState(
        {
          input: query
        },
        () => searchRequest(query)
      )
    } else {
      this.setState({ input: '', error: true })
    }
  }

  handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      this.handleButtonClick()
    }
  }

  handleExampleClick = (evt: MouseEvent<HTMLSpanElement>) => {
    const {
      currentTarget: { dataset }
    } = evt

    if (dataset.text) {
      this.setState(
        {
          input: dataset.text
        },
        () => this.inputElementRef.current!.focus()
      )
    }
  }

  handleSearchModifierClick = (evt: MouseEvent<HTMLElement>) => {
    const {
      currentTarget: { dataset }
    } = evt

    if (dataset.modifier) {
      this.setState(
        state => ({
          input: state.input + ' ' + dataset.modifier
        }),
        () => this.inputElementRef.current!.focus()
      )
    }
  }

  handleClickAway = () => {
    this.setState({ error: false })
  }

  componentDidMount() {
    this.inputElementRef.current!.focus()
  }

  render() {
    const { input, error } = this.state
    const { classes } = this.props
    const examples = appConfig.exampleUsers

    return (
      <form className={classes.form} onSubmit={(evt: FormEvent) => evt.preventDefault()}>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div className={classes.searchInputRow}>
            <AccountSearch fontSize="large" className={classes.icon} />

            <Tooltip title="Query must be non-empty" open={!!error} placement="top">
              <FormControl className={classes.textField} fullWidth error={!input}>
                <InputLabel htmlFor={this.inputElementId}>Search user</InputLabel>

                <Input
                  error={!!error}
                  name="input"
                  spellCheck={false}
                  id={this.inputElementId}
                  classes={{
                    input: classes.searchInput
                  }}
                  value={input}
                  inputRef={this.inputElementRef}
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleKeyDown}
                />
                <FormHelperText component="em" className={classes.helperText} error={false}>
                  Examples:{' '}
                  {examples.slice(0, -1).map(example => (
                    <Fragment key={example}>
                      <span className={classes.exampleSpan} onClick={this.handleExampleClick} data-text={example}>
                        {example}
                      </span>
                      {', '}
                    </Fragment>
                  ))}
                  {
                    <span
                      className={classes.exampleSpan}
                      onClick={this.handleExampleClick}
                      data-text={examples[examples.length - 1]}
                    >
                      {examples[examples.length - 1]}
                    </span>
                  }
                </FormHelperText>
              </FormControl>
            </Tooltip>
            <Button size="small" variant="outlined" color="primary" onClick={this.handleButtonClick}>
              Search
            </Button>
          </div>
        </ClickAwayListener>
        <Typography>
          Add modifier:{' '}
          <span className={classes.searchModifiers}>
            <Link
              component="span"
              className={classes.searchModifier}
              onClick={this.handleSearchModifierClick}
              data-modifier="in:login"
            >
              in:login
            </Link>{' '}
            <Link
              component="span"
              className={classes.searchModifier}
              onClick={this.handleSearchModifierClick}
              data-modifier="type:organization"
            >
              type:organization
            </Link>
          </span>
        </Typography>
      </form>
    )
  }
}

export default connect(() => ({}), {
  searchRequest
})(withStyles(styles)(SearchUsersForm))
