# SkillCrucial React Redux boilerplate

## Quick start

1. Clone this repo using:
```shell
git clone git@github.com:ovasylenko/skillcrucial-react-redux-boilerplate.git
```

2. To install dependencies and clean the git repo run:

```shell
yarn install
```

*We recommend using `yarn` for installing packages, but you can use `npm` instead*:

```shell
npm install
```

3. Create Server-Side Rendering build

```shell
yarn run build:ssr
```

4. Create first build

```shell
yarn run build:prod
```
5. Copy .env.example file to .env and make the necessary changes there

6. Run project in Dev mode

```shell
yarn run dev
```

## Features

* Redux
* Modern ES6 for using template strings, JSX syntax, object destructuring arrow functions and more
* Babel for old browser support
* SASS/SCSS: make styles greate again, with no tears
* React Router
* Hot Module Replacement for comfortable development

## Project Structure

#### `client/`

You will write your app in this folder. You will spend most of your time in here.

#### `client/components`

This folder contains all your components

#### `dist/assets`
This directory contains compiled project files

#### `webpack.development.config.js` `and webpack.production.frontend.config.js`
Project environment configs. Webpack uses proper config depending on defined application environment.
By default `webpack.development.config.js` is used unless you build the application with --config webpack.production.frontend.config.js variable.


## Command Line Commands

#### Installation

```shell
yarn install
```
Installs the dependencies.

#### Development

```shell
yarn run dev
```

Starts the development server running on `http://localhost:8090` using the webpack.development.config.js with Hot Module Replacement (HMR) (Changes in the application code will be hot-reloaded)

```shell
yarn run dev:server
```

Starts the development server and makes your application accessible at `http://localhost:8090`

```shell
yarn run clean
```
Removes a directory "dist" from a project

#### Building

```shell
yarn build:prod
```

Prepares your app for deployment to production environment (using the webpack.production.frontend.config.js) (does not run tests). Optimizes and minifies all files, piping them to the `dist` folder.


#### Testing

```shell
yarn run test
```

Tests your application modern JavaScript Testing Framework - Jest with the unit tests specified in the `**/__tests__/*.spec.js` files
throughout the application.

```shell
yarn run test:watch
```

Watches changes to your application and re-runs tests whenever a file changes.

```shell
yarn run coverage
```

Generates test coverage.


It’s also possible to leave out the run in this command, each script can be executed with its name, e.g:
```shell
yarn test:watch
yarn test:coverage
```

#### Linting

```shell
yarn run lint
```
Will analyse your code for potential errors. Will check both: `./client/**/**.js` and `./server/**/**.js` files.
Code linting is a type of static analysis that is frequently used to find problematic patterns or code that doesn’t adhere to certain style guidelines.


```shell
yarn run lint:server
```

Will analyse only  `server/**/**.js` files

#### Docker
Nginx web server working on 443, 80 ports on localhost

Run production
```shell
docker-compose -f .\docker\PROD.docker-compose.yml up (Options: --build for build, -d to detach )
docker-compose -f .\docker\PROD.docker-compose.yml down (To stop contaiters)
```
Run develop
```shell
docker-compose -f .\docker\DEV.docker-compose.yml up (Options: --build for build, -d to detach )
docker-compose -f .\docker\DEV.docker-compose.yml down (To stop contaiters)
```
