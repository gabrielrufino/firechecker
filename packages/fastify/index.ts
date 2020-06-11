import {FastifyRequest, FastifyReply } from 'fastify'
import * as firebase from 'firebase-admin'

interface Options {
  header: string
  type: string
}

const defaultOptions: Options = {
  header: 'Authorization',
  type: 'Bearer'
}

function firechecker (options: Options = defaultOptions) {
  const { header, type } = options

  return async function (request: FastifyRequest, reply: FastifyReply, next): Promise<void> {
    const authorization = request.headers[header]

    if (authorization) {
      const [prefix, token] = authorization.split(' ')

      if (prefix !== type) {
        reply.status(401).json({
          error: 'Invalid token type'
        })
      } else {
        try {
          await firebase
            .auth()
            .verifyIdToken(token)
  
          next()
        } catch (error) {
          reply.status(401).json(error)
        }
      }
    } else {
      reply.status(401).json({
        error: `Header ${header} empty`
      })
    }
  }
}

export = firechecker
