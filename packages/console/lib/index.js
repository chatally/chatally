import { BaseServer } from '@chatally/core'
import { content } from '@chatally/utils'
import { createInterface as readline } from 'node:readline'

const grey = 30
const green = 32
const onGreen = 42

/**
 * @param {string} text
 * @param {string | number} color
 * @returns {string} A TTY format string with the text wrapped in color
 *    controls.
 */
function color(text, color) {
  return `\u001B[${color}m${text}\u001B[0m`
}

export class ConsoleServer extends BaseServer {
  #displayName;
  #prompt;
  #namePad = "";
  #promptPad = "";

  constructor(name = 'ConsoleServer') {
    super(name)
    this.#displayName = name;
    this.#prompt = ">";
    this.#updatePadding();
  }

  /**
   * The name displayed before each message from your bot.
   * @param {string} displayName 
   */
  set displayName(displayName) {
    this.#displayName = displayName;
    this.#updatePadding();
  }

  /**
   * The color used to display the name.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  nameColor = green

  /**
   * The prompt displayed before the user input.
   * @param {string} prompt
   */
  set prompt(prompt) {
    this.#prompt = prompt;
    this.#updatePadding();
  }

  #updatePadding() {
    const max = Math.max(this.#displayName.length, this.#prompt.length);
    this.#namePad = ' '.repeat(max - this.#displayName.length);
    this.#promptPad = ' '.repeat(max - this.#prompt.length);
  }

  /**
   * The color used to display the prompt.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  promptColor = green

  /**
   * The color used to display the response from the bot.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  responseColor = grey

  /**
   * Optional token, that user can type to stop the console server.
   *
   * Default is '/quit'
   */
  stopToken = '/quit'

  /**
   * The greeting displayed when the console channel starts listening.
   */
  greeting = `${color(' ChatAlly ', onGreen)} ${color('Console Server', green)}
Quit with 'Ctrl+c'${this.stopToken ? `or type '${this.stopToken}'` : ''}.
Waiting for your messages...`

  /**
   * The message displayed, when the console channel shuts down.
   */
  goodBye = 'Good bye.'

  listen() {
    this.#printGreeting()
    this._interface = readline(process.stdin)

    this._interface
      .on('line', line => this.#printResponse(line))
      .on('close', () => this.#printGoodBye())
  }

  #printGreeting() {
    process.nextTick(() => {
      // eslint-disable-next-line no-console
      console.clear()
      if (this.greeting) {
        process.stdout.write(`${this.greeting}\n\n`)
      }
      this.#printPrompt()
    })
  }

  /**
   * @param {string} line
   */
  #printResponse(line) {
    if (this.stopToken && line === this.stopToken) {
      return this._interface?.close()
    }
    this.dispatch(line, {
      onWrite: (msg) => {
        this.#printName()
        process.stdout.write(`${color(content(msg), this.responseColor)}\n`)
      },
      onFinished: () => {
        this.#printPrompt()
      },
    })
  }

  #printGoodBye() {
    if (this.goodBye) {
      process.stdout.write(`\n${this.goodBye}`)
    }
    process.stdout.write('\n')
    process.exit()
  }

  #printName() {
    process.stdout.write(
      `${this.#namePad}${color(this.#displayName, this.nameColor)} `)
  }

  #printPrompt() {
    process.stdout.write(
      `${this.#promptPad}${color(this.#prompt, this.promptColor)} `)
  }
}
