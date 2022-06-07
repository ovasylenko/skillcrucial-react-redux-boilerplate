// eslint-disable-next-line
const Html = ({ body }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <script defer="defer" src="/js/main.bundle.js?v=COMMITHASH1"></script>
      <link href="/css/main.css" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
`
}

export default Html
