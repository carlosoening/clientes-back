// Standard library dependencies
export * as log from 'https://deno.land/std@0.198.0/log/mod.ts';

export { crypto } from 'https://deno.land/std@0.198.0/crypto/mod.ts';

// Third party library dependencies
export {
  Router,
  Status,
  Application,
  send,
  isHttpError,
  Response,
  Request,
  type RouterContext,
  Context,
} from 'https://deno.land/x/oak@v12.6.0/mod.ts';

export { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

export { 
  hash,
  hashSync,
  genSalt,
  compare,
  compareSync,
} from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';

export { 
  create as createJwt,
  getNumericDate,
  verify as verifyJwt,
  decode as decodeJwt,
  type Payload,
  type Header,
} from 'https://deno.land/x/djwt@v2.4/mod.ts';

export { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

export { S3, S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";

export { PDFDocument, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';

export { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

