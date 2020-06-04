import React from 'react'
import { connect } from 'react-redux'

export const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
   <div key={alert.id} className={`alert alert-${alert.alertType} animate__animated animate__zoomIn`}>
      {alert.msg}
   </div>
))

const mapStateProps = state => ({
   alerts: state.alert
})
export default connect(mapStateProps)(Alert)