const Variables = ({ clientVariables = {} }) => {
  return `
      var globals = ${JSON.stringify(clientVariables)}
  `
}

export default Variables
