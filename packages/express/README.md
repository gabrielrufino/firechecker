# Firechecker - Express

## Getting started

```
$ npm install --save express firebase-admin @firechecker/express
```

```js
const admin = require('firebase-admin')
const express = require('express')
const firechecker = require('@firechecker/express')

const serviceAccount = require('path/to/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const app = express()

app.use(firechecker())

app.get('/', (request, response) => {
  response.status(200).json({
    access: true
  })
})

app.listen(3000)
```
