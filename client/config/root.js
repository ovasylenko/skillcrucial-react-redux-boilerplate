import React from 'react';
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import {
  Switch, Route, withRouter, Redirect
} from 'react-router-dom';
import { bindActionCreators } from 'redux'

import store, { history } from '../redux';

import Home from '../components/home';
import DummyView from '../components/dummy-view';
import NotFound from '../components/404';

import Startup from './startup';


const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const func = props => (!!rest.user && !!rest.user.name && !!rest.token
    ? <Redirect to={{ pathname: '/' }} />
    : <Component {...props} />)
  return (<Route {...rest} render={func} />)
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const func = props => (!!rest.user && !!rest.user.name && !!rest.token
    ? <Component {...props} />
    : (
      <Redirect to={
          {
            pathname: '/login'
          }
        }
      />
    )
  )
  return (<Route {...rest} render={func} />)
}

const types = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  token: PropTypes.string
};

const defaults = {
  location: {
    pathname: ''
  },
  user: null,
  token: ''
}

OnlyAnonymousRoute.propTypes = types
PrivateRoute.propTypes = types


PrivateRoute.defaultProps = defaults
OnlyAnonymousRoute.defaultProps = defaults

const mapStateToProps = state => ({
  user: state.authentication.user,
  token: state.authentication.token
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

const PrivateRouteConnected = connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)

const mapDispatchToPropsStartup = dispatch => bindActionCreators({}, dispatch)

const StartupConnected = withRouter(connect(() => ({}), mapDispatchToPropsStartup)(Startup));
export default (props) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history} location={props.location} context={props.context}>
        <StartupConnected>
          <Switch>
            <Route exact path="/" component={() => <DummyView />} />
            <Route exact path="/dashboard" component={() => <Home />} />
            <PrivateRouteConnected exact path="/hidden-route" component={() => <DummyView />} />
            <Route component={() => <NotFound />} />
          </Switch>
        </StartupConnected>
      </ConnectedRouter>
    </Provider>
  );
};
