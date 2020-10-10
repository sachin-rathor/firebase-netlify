import Cookies from 'cookies'
import { encodeBase64, decodeBase64 } from 'src/encoding'

const encode = (val) => encodeBase64(val)
const decode = (val) => decodeBase64(val)

const createCookieMgr = (req, res) => {
  // FIXME: use user config
  // An array is useful for rotating secrets without invalidating old sessions.
  // The first will be used to sign cookies, and the rest to validate them.
  // const sessionSecrets = ['abc', 'def']

  // https://github.com/pillarjs/cookies
  const cookies = Cookies(req, res, {
    // keys: sessionSecrets,
    // Recommended: set other options, such as "secure", "sameSite", etc.
    // https://github.com/pillarjs/cookies#readme
  })
  return cookies
}

export const getCookie = (cookieName, { req, res }) => {
  const cookies = createCookieMgr(req, res)
  try {
    // FIXME: don't try to decode undefined value
    return decode(
      cookies.get(cookieName, {
        // FIXME: use user config
        // signed: true,
      })
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return undefined
  }
}

export const setCookie = (cookieName, cookieVal, { req, res }) => {
  const cookies = createCookieMgr(req, res)

  // If the value is not defined, set the value to undefined
  // so that the cookie will be deleted.
  const valToSet = cookieVal == null ? undefined : encode(cookieVal)

  // FIXME: use user config
  cookies.set(cookieName, valToSet, {
    httpOnly: true,
    maxAge: 604800000, // week
    overwrite: true,
  })
}
