export const CUSTOM_MESSAGES = {
  success: {
    code: 200,
    description: 'The request has performed successfully.',
  },
  created: {
    code: 201,
    description:
      'The request has been created and performed the new resource successfully.',
  },
  badRequest: {
    code: 400,
    description: 'The request cannot be fulfilled due to bad syntax.',
  },
  unique: {
    code: 400,
    description: 'The resource must be unique into the database.',
  },
  unauthorized: {
    code: 401,
    description:
      'The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided.',
  },
  forbidden: {
    code: 403,
    description:
      'The request was a legal request, but the server is refusing to respond to it.',
  },
  notFound: {
    code: 404,
    description: 'The server cannot find the requested content.',
  },
  notFoundBy: {
    code: 404,
    description:
      'Please, verify your request. The server cannot find this content, in the field: ',
  },
  notFoundUser: {
    code: 404,
    description:
      'The server cannot find the requested content or the services is blocked.',
  },
  serverError: {
    code: 500,
    description: 'Has ocurred an internal server error.',
  },
  onCreateError: {
    code: 500,
    description: 'Has ocurred an error when tries to create a new record.',
  },
  onUpdateError: {
    code: 500,
    description: 'Has ocurred an error when tries to update this record.',
  },
  wrongPassword: {
    code: 403,
    description: 'Incorrect password, verify your record, please.',
  },
  tokenError: {
    code: 400,
    description:
      'Has occurred an error to generate the new token to authenticate the services.',
  },
  missingToken: {
    code: 400,
    description: 'The token is invalid or does not exist into the request.',
  },
  tokenIsExpired: {
    code: 401,
    description: 'The token is expired, it is required to login.',
  },
  tokenNoCommonAccess: {
    code: 401,
    description:
      'The token does not have access to the site or services has the unknown type. Please, contact the administrator.',
  },
  inactiveUser: {
    code: 403,
    description: 'This service is inactive, talk with the application admin.',
  },
  currentTokenValid: {
    code: 400,
    description: 'This token corresponds with the active token in the system.',
  },
  currentTokenInvalid: {
    code: 403,
    description: 'This token does not equal to the system token. Please login.',
  },
  validForeignKeys: {
    code: 400,
    description:
      'Has occurred an error with one of the foreign keys on this request. Please, validate your data.',
  },
  invalidTenant: {
    code: 403,
    description:
      'This email tenant is invalid or is not allowed for this request. Please talk with your administrator.',
  },
  externalLoginError: {
    code: 400,
    description: 'Failed to retrieve the login response.',
  },
  sapDataError: {
    code: 400,
    description: 'Failed to retrieve SAP data.',
  },
};
