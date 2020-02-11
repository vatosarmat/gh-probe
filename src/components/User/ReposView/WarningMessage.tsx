import React from 'react'
import { connect } from 'react-redux'
import { Typography, Link } from '@material-ui/core'

import { reposActions } from 'state'

const { resume: resumeFetch } = reposActions

//
interface OwnProps {
  wasStopped: boolean
  wasError: boolean

  className?: string
}

interface DispatchProps {
  resumeFetch: typeof resumeFetch
}

type WarningMessageProps = OwnProps & DispatchProps

const WarningMessage: React.FC<WarningMessageProps> = ({ wasStopped, wasError, resumeFetch, className }) => {
  const handleResumeFetch = () => resumeFetch()

  return wasStopped || wasError ? (
    <Typography component="em" variant="caption" display="block" className={className}>
      {wasStopped ? (
        <>
          Some data may be missing due to fetch interruption.{' '}
          <Link component="button" onClick={handleResumeFetch}>
            <em>Resume fetch</em>
          </Link>
        </>
      ) : wasError ? (
        <>Some data may be missing due to request error. </>
      ) : null}
    </Typography>
  ) : null
}

export default connect<{}, DispatchProps, OwnProps>(undefined, { resumeFetch })(WarningMessage)
