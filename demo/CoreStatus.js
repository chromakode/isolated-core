import React, { PropTypes } from 'react'

export default function CoreStatus({ loading, ready, coreRef, error, errorDetail }) {
  if (error) {
    return <span className="core-status error">{error} error: "{String(errorDetail)}"</span>
  } else if (loading) {
    return <span className="core-status loading">loading...</span>
  } else if (ready) {
    return <span className="core-status ready">core #{coreRef.id} ready!</span>
  }
  return <span className="core-status none">not loaded</span>
}

CoreStatus.propTypes = {
  loading: PropTypes.bool,
  ready: PropTypes.bool,
  error: PropTypes.string,
}
