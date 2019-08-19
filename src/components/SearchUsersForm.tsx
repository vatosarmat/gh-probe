import {
  Box,
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core'
import { AccountSearch } from 'mdi-material-ui'
import cuid from 'cuid'
import React, { ChangeEvent, Component, FormEvent, KeyboardEvent, RefObject } from 'react'
import { connect } from 'react-redux'

import { State, searchUsersRequest } from 'state'

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2)
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
    }
  })

//TODO: input validation
interface SearchUsersFormProps extends WithStyles<typeof styles> {
  readonly example: string
  readonly searchUsersRequest: typeof searchUsersRequest
}

class SearchUsersForm extends Component<SearchUsersFormProps> {
  state = {
    input: ''
  }

  inputElementId = cuid()
  inputElementRef: RefObject<HTMLInputElement> = React.createRef()

  handleInputChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target

    this.setState(state => ({
      ...state,
      [name]: value
    }))
  }

  handleButtonClick = () => {
    const { searchUsersRequest } = this.props
    const { input } = this.state

    searchUsersRequest(input)
  }

  handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && this.state.input) {
      this.handleButtonClick()
    }
  }

  handleExampleClick = () => {
    const { example } = this.props
    this.setState(
      {
        input: example
      },
      () => {
        this.inputElementRef.current!.focus()
      }
    )
  }

  render() {
    const { input } = this.state
    const { classes, example } = this.props

    return (
      <Box
        component="form"
        onSubmit={(evt: FormEvent) => evt.preventDefault()}
        p={4}
        pb={5}
        display="flex"
        alignItems="end"
      >
        <AccountSearch fontSize="large" className={classes.icon} />
        <FormControl className={classes.textField} fullWidth error={!input}>
          <InputLabel htmlFor={this.inputElementId}>Search user</InputLabel>
          <Input
            name="input"
            id={this.inputElementId}
            value={input}
            inputRef={this.inputElementRef}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          <FormHelperText component="em" className={classes.helperText} error={false}>
            Example:
            <span className={classes.exampleSpan} onClick={this.handleExampleClick}>
              {example}
            </span>
          </FormHelperText>
        </FormControl>

        <Button size="small" variant="outlined" color="primary" onClick={this.handleButtonClick}>
          Search
        </Button>
      </Box>
    )
  }
}

export default connect(
  () => {},
  {
    searchUsersRequest
  }
)(withStyles(styles)(SearchUsersForm))
