import { Response, Request } from '../deps.ts';

interface Context {
  request: Request,
  response: Response,
  params?: any
}

export default Context;