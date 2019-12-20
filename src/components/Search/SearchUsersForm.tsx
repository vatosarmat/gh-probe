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
  Grid,
  Typography,
  Link,
  Tooltip,
  ClickAwayListener
} from '@material-ui/core'
import { AccountSearch } from 'mdi-material-ui'
import cuid from 'cuid'
import React, {
  Fragment,
  ChangeEvent,
  Component,
  MouseEvent,
  FormEvent,
  KeyboardEvent,
  RefObject
} from 'react'
import { connect } from 'react-redux'

import { searchUsersRequest } from 'state'

const styles = (theme: Theme) =>
  createStyles({
    gridContainer: {
      padding: theme.spacing(4)
    },

    gridInputItem: {
      display: 'flex',
      alignItems: 'flex-end'
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

interface SearchUsersFormProps extends WithStyles<typeof styles> {
  readonly examples: string[]
  readonly searchUsersRequest: typeof searchUsersRequest
}

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
    const { searchUsersRequest } = this.props
    const { input } = this.state

    const query = input.toString().trim()

    if (query) {
      this.setState(
        {
          input: query
        },
        () => searchUsersRequest(query)
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
    const { classes, examples } = this.props

    return (
      <Grid
        container
        component="form"
        className={classes.gridContainer}
        onSubmit={(evt: FormEvent) => evt.preventDefault()}
        spacing={6}
      >
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <Grid item xs={12} className={classes.gridInputItem}>
            <AccountSearch fontSize="large" className={classes.icon} />

            <Tooltip title="Query must be non-empty" open={!!error} placement="top">
              <FormControl className={classes.textField} fullWidth error={!input}>
                <InputLabel htmlFor={this.inputElementId}>Search user</InputLabel>

                <Input
                  error={!!error}
                  name="input"
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
                      <span
                        className={classes.exampleSpan}
                        onClick={this.handleExampleClick}
                        data-text={example}
                      >
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
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={this.handleButtonClick}
            >
              Search
            </Button>
          </Grid>
        </ClickAwayListener>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    )
  }
}

export default connect(
  () => ({}),
  {
    searchUsersRequest
  }
)(withStyles(styles)(SearchUsersForm))
