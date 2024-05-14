import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import withRouter from "components/Common/withRouter"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

import classes from "./Header.module.css";
const Sidebar = props => {
  return (
    <React.Fragment>
      <div id="verticalDiv" className={`vertical-menu custom-scrollbar`} >
        <div data-simplebar className="">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
