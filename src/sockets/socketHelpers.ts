export type SocketResponse<T = null> = T extends null
  ? { error: true; message: string | any | unknown; data: null }
  : { error: false; message: 'ok' | string; data: T }
// |
// |

export const socketOkReponse = <T>(data: T): SocketResponse<T> => {
  const responseData = {
    error: false,
    message: 'ok',
    data
  } as SocketResponse<T>

  return responseData
}

export const socketErrorResponse = (
  message: string | any | unknown
): SocketResponse => {
  // TODO: add method to register error logs in database

  const responseData: SocketResponse = {
    error: true,
    message: message || 'Server error',
    data: null
  }

  return responseData
}
