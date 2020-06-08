import React, { useState, useEffect } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import axios from 'axios'

import Head from './head'
import Main from './main'
import Repos from './repos'
import Readme from './readme'

const Home = () => {
  const { username, repository } = useParams()
  const url = `https://api.github.com/users/${username}/repos`
  const urlReadme = `https://api.github.com/repos/${username}/${repository}/readme`
  const [repositoriesList, setRepos] = useState([])

  useEffect(() => {
    if (typeof username !== `undefined`) {
      axios.get(url).then((it) => {
        setRepos(it.data.map(({ name, id }) => ({ name, id })))
      })
    }
  }, [url, username])

  const [readme, setReadme] = useState([])

  useEffect(() => {
    if (typeof username !== `undefined` && typeof repository !== `undefined`) {
      axios.get(urlReadme).then(({ data }) => {
        setReadme(atob(data.content))
      })
    }
  }, [urlReadme, username, repository])

  return (
    <div>
      <Head title="Home" />
      <div> Hello World Home, {username} </div>
      <Switch>
        <Route exact path="/" component={() => <Main />} />
        <Route exact path="/:username" component={() => <Repos repos={repositoriesList} />} />
        <Route exact path="/:username/:repository" component={() => <Readme readme={readme} />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
