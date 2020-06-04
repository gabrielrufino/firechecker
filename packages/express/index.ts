import { Request, Response, NextFunction } from 'express'
import * as firebase from 'firebase-admin'

interface Options {
  header: string;
  prefix: string;
}

function setCredential (credential: any) {
  firebase.initializeApp({
    credential: firebase.credential.cert(credential),
  })
}

function firechecker (options: Options) {
  const { header } = options

  return async function (request: Request, response: Response, next: NextFunction) {
    const authorization = request.headers[header.toLowerCase()]

    if (authorization) {
      const [prefix, token] = authorization.split(' ')

      try {
        const user = await firebase
          .auth()
          .verifyIdToken(token)

        await next()
      } catch (error) {
        return response.status(403).json(error)
      }
    } else {
      return response.status(403)
    }
  }
}

export default firechecker
export { setCredential }
