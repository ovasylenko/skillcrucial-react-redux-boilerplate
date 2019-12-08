import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'

const Home = () => {
  const [counter, setCounterNew] = useState(0)

  return (
    <div>
      <Head title="Hello" />
      <button
        type="button"
        onClick={() => setCounterNew(counter + 1)}
      >
        updateCounter
      </button>
      <div> Hello World Dashboard {counter} </div>
    </div>
  )
}

Home.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
