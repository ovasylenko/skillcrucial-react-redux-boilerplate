import React, { useState, useEffect } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import axios from 'axios'

// import Head from './head'
import Main from './main'
import Repos from './repos'
import Readme from './readme'
import Header from './header'

const Home = () => {
  const { user, repository } = useParams()
  const url = `https://api.github.com/users/${user}/repos`
  const urlReadme = `https://api.github.com/repos/${user}/${repository}/readme`
  const [repositoriesList, setRepos] = useState([])
  useEffect(() => {
    if (typeof user !== 'undefined') {
      axios.get(url).then((it) => {
        setRepos(it.data.map((repo) => ({ name: repo.name, id: repo.id })))
      })
    }
  }, [url, user])
  const [readme, setReadme] = useState('')
  useEffect(() => {
    if (typeof user !== 'undefined' && typeof user !== 'undefined') {
      axios.get(urlReadme).then(({ data }) => {
        axios(data.download_url).then(({ data: text }) => {
          setReadme(text)
        })
      })
    }
  }, [urlReadme, user, repository])
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={() => <Main />} />
        <Route exact path="/:user" component={() => <Repos repos={repositoriesList} />} />
        <Route exact path="/:user/:repository" component={() => <Readme readme={readme} />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home