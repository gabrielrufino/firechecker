# Firechecker - Fastify

## Getting started

```
$ npm install --save fastify firebase-admin @firechecker/fastify
```

```js
const admin = require('firebase-admin')
const fastify = require('fastify')({
  logger: true
})
const firechecker = require('@firechecker/fastify')

const serviceAccount = require('path/to/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

fastify.addHook('preHandler', firechecker())

fastify.get('/', function (request, reply) {
  reply.code(200).send({
    access: true
  })
})

fastify.listen(3000, function (error, address) {
  if (error) {
    fastify.log.error(error)
    process.exit(1)
  }

  fastify.log.info(`Server listening on ${address}`)
})
```
