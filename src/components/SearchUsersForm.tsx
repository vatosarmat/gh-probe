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
import { Group, Person } from '@material-ui/icons'
import cuid from 'cuid'
import React, { ChangeEvent, Component, FormEvent, KeyboardEvent, RefObject } from 'react'
import { connect } from 'react-redux'
import { defaultEntity, entityExample, EntityType, isEntityType } from '../misc/entities'
import { ReduxState, ReduxOperation, operationAction } from '../store'

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
interface RepoQueryFormProps extends WithStyles<typeof styles> {
  repoListFetchStart: typeof operationAction.repoListFetchStart
  repoListFetchAbort: typeof operationAction.repoListFetchAbort

  entityType: EntityType
  appStatus: ReduxOperation['appStatus']
  fetchProgress: ReduxOperation['fetchProgress']
  stopIssued: ReduxOperation['stopIssued']
}

interface ButtonBehavior {
  descr: 'query' | 'abort'
  disabled: boolean
}

class RepoQueryForm extends Component<RepoQueryFormProps> {
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
    const { entityType, repoListFetchStart, repoListFetchAbort } = this.props
    const buttonState = this.buttonState()

    if (buttonState.descr === 'abort') {
      repoListFetchAbort({})
    } else if (buttonState.descr === 'query') {
      const { input } = this.state

      const entitySelector = {
        key: entityType,
        value: input
      }

      repoListFetchStart({ entitySelector })
    }
  }

  handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && this.state.input) {
      this.handleButtonClick()
    }
  }

  handleExampleClick = () => {
    this.setState(
      {
        input: entityExample[this.props.entityType]
      },
      () => {
        this.inputElementRef.current!.focus()
      }
    )
  }

  buttonState(): ButtonBehavior {
    const { appStatus, fetchProgress, stopIssued } = this.props

    if (appStatus === 'REPO_LIST_FETCH') {
      if (fetchProgress) {
        return stopIssued
          ? {
              descr: 'abort',
              disabled: true
            }
          : {
              descr: 'abort',
              disabled: false
            }
      }

      return {
        descr: 'query',
        disabled: true
      }
    }

    return {
      descr: 'query',
      disabled: false
    }
  }

  render() {
    const { input } = this.state
    const { classes, entityType, appStatus } = this.props

    const buttonState = this.buttonState()

    const icon =
      entityType === 'organization' ? (
        <Group fontSize="large" className={classes.icon} />
      ) : (
        <Person fontSize="large" className={classes.icon} />
      )

    return (
      <Box
        component="form"
        onSubmit={(evt: FormEvent) => evt.preventDefault()}
        p={4}
        pb={5}
        display="flex"
        alignItems="end"
      >
        {icon}
        <FormControl className={classes.textField} fullWidth error={!input}>
          <InputLabel htmlFor={this.inputElementId}>{entityType}</InputLabel>
          <Input
            name="input"
            id={this.inputElementId}
            value={input}
            inputRef={this.inputElementRef}
            disabled={appStatus === 'REPO_LIST_FETCH'}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          {appStatus === 'RESET' && (
            <FormHelperText component="em" className={classes.helperText} error={false}>
              Example:
              <span className={classes.exampleSpan} onClick={this.handleExampleClick}>
                {entityExample[entityType]}
              </span>
            </FormHelperText>
          )}
        </FormControl>

        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={this.handleButtonClick}
          disabled={buttonState.disabled || !input}
        >
          {buttonState.descr}
        </Button>
      </Box>
    )
  }
}

export default connect(
  ({ operation: { appStatus, fetchProgress, stopIssued } }: ReduxState) => ({
    appStatus,
    fetchProgress,
    stopIssued
  }),
  {
    repoListFetchStart: operationAction.repoListFetchStart,
    repoListFetchAbort: operationAction.repoListFetchAbort
  }
)(withStyles(styles)(RepoQueryForm))
