import { 
  Payload, 
  getNumericDate, 
  Header, 
  crypto, 
  createJwt, 
  decodeJwt, 
  Request 
} from '../deps.ts';

const EXP_ONE_WEEK = 60 * 60 * 24 * 7;

export const key = await crypto.subtle.generateKey(
  { name: 'HMAC', hash: 'SHA-512' }, 
  true, 
  ['sign', 'verify'],
);

export const getPayload = (username: string, role: string) => {
  const payload: Payload = {
    exp: getNumericDate(EXP_ONE_WEEK),
    sub: username,
    role
  };
  return payload;
};

export const header: Header = {
  alg: 'HS512',
  typ: 'JWT'
};

export const getNewToken = async (username: string, role: string) => {
  header.iss = username;
  return await createJwt(header, getPayload(username, role), key);
}

export const getPayloadFromToken = (jwt: string) => {
  return decodeJwt(jwt)[1];
}

export const getAuthorizationToken = (request: Request) => {
  const headers: Headers = request.headers;
  const authorization = headers.get('Authorization');
  if (!authorization) {
    throw new Error('Não autenticado');
  }
  const jwt = authorization.split(' ')[1];
  if (!jwt) {
    throw new Error('Não autenticado');
  }
  return jwt;
}