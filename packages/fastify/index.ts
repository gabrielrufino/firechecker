import {FastifyRequest, FastifyReply, Middleware} from 'fastify'
import {Server, ServerResponse} from 'http'
import * as firebase from 'firebase-admin'

interface Options {
  header: string
  type: string
}

const defaultOptions: Options = {
  header: 'Authorization',
  type: 'Bearer'
}

function firechecker (options: Options = defaultOptions): Middleware<Server, FastifyRequest, FastifyReply<ServerResponse>> {
  const { header, type } = options

  return async function (request: FastifyRequest, reply: FastifyReply<ServerResponse>, done): Promise<void> {
    const authorization = request.headers[header.toLowerCase()]

    if (authorization) {
      const [prefix, token] = authorization.split(' ')

      if (prefix !== type) {
        reply.code(401).send({
          error: 'Invalid token type'
        })
      } else {
        try {
          await firebase
            .auth()
            .verifyIdToken(token)
  
          done()
        } catch (error) {
          reply.code(401).send(error)
        }
      }
    } else {
      reply.code(401).send({
        error: `Header ${header} empty`
      })
    }
  }
}

export = firechecker
