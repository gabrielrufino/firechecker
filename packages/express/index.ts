import { Request, Response, NextFunction } from 'express'
import * as firebase from 'firebase-admin'

interface Options {
  header: string
  type: string
}

export function setCredential (credential: object) {
  firebase.initializeApp({
    credential: firebase.credential.cert(credential),
  })
}

export function firechecker (options: Options) {
  const {
    header = 'Authorization',
    type = 'Bearer'
  } = options

  return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    const authorization = request.get(header)

    if (authorization) {
      const [prefix, token] = authorization.split(' ')

      try {
        const user = await firebase
          .auth()
          .verifyIdToken(token)

        await next()
      } catch (error) {
        response.status(403).json(error)
      }
    } else {
      response.status(403)
    }
  }
}

export default {
  setCredential,
  firechecker
}
