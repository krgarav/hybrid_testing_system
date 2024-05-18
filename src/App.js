import PropTypes from 'prop-types'
import React from "react"
import './App.css'

import { Route, Routes } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

// Toast for Notification
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

import fakeBackend from "./helpers/AuthType/fakeBackend"
import Instructions from 'pages/student/Instructions'
import TestScreen from 'pages/student/testScreen'
import TestSubmitted from 'pages/student/FinalSubmit'
import Pages404 from 'pages/Extra Pages/pages-404'


// Activating fake backend
fakeBackend()

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig)

const App = props => {
  // {alert('hiii')}
  //   useEffect(() => {
  //     alert('hii')
  //     document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  //   }, [])

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Routes>
        {/* Non-authenticated routes */}
        {authRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
          />
        ))}

        {/* Authenticated routes */}
        {userRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
          />
        ))}

        <Route exact path='/Instructions' element={<Instructions />} />
        <Route exact path='/test' element={<TestScreen />} />
        <Route exact path='/finalSubmit/:submit/:visit/:unAttempt' element={<TestSubmitted />} />
        <Route exact path='*' element={<Pages404 />} />
      </Routes>
      <ToastContainer />
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
