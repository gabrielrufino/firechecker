import { Request, Response, NextFunction } from 'express'
import * as firebase from 'firebase-admin'

interface Options {
  header: string
  type: string
}

function firechecker (options: Options) {
  const {
    header = 'Authorization',
    type = 'Bearer'
  } = options

  return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    const authorization = request.get(header)

    if (authorization) {
      const [prefix, token] = authorization.split(' ')

      if (prefix !== type) {
        response.status(401).json({
          error: 'Invalid token type'
        })
      } else {
        try {
          await firebase
            .auth()
            .verifyIdToken(token)
  
          next()
        } catch (error) {
          response.status(401).json(error)
        }
      }
    } else {
      response.status(401).json({
        error: `Header ${header} empty`
      })
    }
  }
}

export = firechecker
