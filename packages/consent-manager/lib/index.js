import { Store } from './Store.js'

/**
 * @constructor
 * @param {Partial<import('./index.d.ts').Options>} [options]
 */
export function ConsentManager(options = {}) {
  const {
    path = 'gdpr-consent.db',
    askForConsent = {
      type: 'buttons',
      content: '✅ This is a chat bot, i.e. that we will process the data that you provide. We will only store the minimum data required to provide our services and will not share any data with third parties. Other parties could be involved in the message transportation, depending on the client you are using. If you do not accept, we will not be able to serve you. See https://chatally.org/impressum for more details.',
      actions: [
        { command: '/accept', title: 'I accept' },
        { command: '/reject', title: 'I do not accept' },
      ],
    },
    thankForConsent = '🫶   Thank you for consenting.',
    nextCommand,
  } = options

  let acceptCommand = options.acceptCommand
  const acceptAction = findAcceptAction(askForConsent, acceptCommand)
  if (acceptCommand && !acceptAction) {
    throw new Error(`GDPR Consent prompt has no button with command '${acceptCommand}'`)
  } else if (acceptAction) {
    acceptCommand = acceptAction.command
  }
  let acceptRegExp = options.acceptRegExp
  if (!acceptRegExp) {
    if (acceptAction) {
      const { ascii, nonascii } = filterAscii(acceptAction.title)
      acceptRegExp = [new RegExp(ascii, 'i'), new RegExp(nonascii, 'i')]
    } else {
      acceptRegExp = /I accept/i
    }
  }

  const store = new Store(path)

  /**
   * @param {import('@chatally/core').ChatRequest} req
   * @returns {boolean} true if the request contains some form of acceptance
   */
  function isConsent(req) {
    if (req.type === 'text') {
      if (req.content === acceptCommand || `<${req.content}>` === acceptCommand) {
        return true
      }
      if (Array.isArray(acceptRegExp)) {
        return acceptRegExp.findIndex(regex => regex.test(req.content)) >= 0
      } else {
        return acceptRegExp?.test(req.content) || false
      }
    } else if (req.type === 'action') {
      return req.command === acceptCommand
    } else if (req.type === 'reaction') {
      return req.emoji === 'thumbs_up'
    }
    return false
  }

  /**
   * @param {import('@chatally/core').ChatRequest} req
   */
  function restoreOriginal(req) {
    const original = store.getOriginal(req.from)
    if (!original) return
    Object.assign(req, original)
  }

  /**
   * @type {import('@chatally/core').Middleware}
   */
  const middleware = async ({ req, res }) => {
    const { from } = req
    const consent = store.hasConsent(from)
    if (consent === true) return

    if (consent === false) {
      if (isConsent(req)) {
        res.write(thankForConsent)
        if (nextCommand) {
          /** @type {Partial<import('@chatally/core').ChatRequest>} */
          const action = {
            type: 'action',
            command: nextCommand,
          }
          Object.assign(req, action)
        } else {
          restoreOriginal(req)
        }
        store.storeConsent(from, req.id)
      } else {
        res.end(askForConsent)
      }
    } else {
      store.storeOriginal(from, req)
      res.end(askForConsent)
    }
  }
  return middleware
}

/**
 * @param {string|import('@chatally/core').ChatMessage} msg
 * @param {string|undefined} command
 */
function findAcceptAction(msg, command) {
  if (typeof msg === 'string' || msg.type !== 'buttons' || msg.actions.length === 0) {
    return undefined
  }
  if (command) {
    return msg.actions.find(a => a.command === command)
  } else {
    return msg.actions[0]
  }
}

/** @param {string} input */
function filterAscii(input) {
  let ascii = ''
  let nonascii = ''
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      ascii += input.charAt(i)
    } else {
      nonascii += input.charAt(i)
    }
  }
  ascii = ascii.trim()
  nonascii = nonascii.trim()
  return { ascii, nonascii }
}
