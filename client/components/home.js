import React from 'react';
import {
  Route, Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <Head title="Hello" />
        <div> Hello World Home </div>
        <a href="/">Go Home HREF| </a>
        <br />
        <Link to="/">Go home LINK</Link>
        <br />
        <Route exact path="/salo/pampushki/s/chesnokim" component={() => <div>Geroyam slava</div>} />
        <Route exact path="/salo/okroshka/na/kefire" component={() => <div>Ne rady</div>} />
      </div>
    )
  }
}

Home.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
