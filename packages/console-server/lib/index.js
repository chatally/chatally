import { Request, Response } from "@chatally/core";
import { createInterface as readline } from "node:readline";

const grey = 30;
const green = 32;
const onGreen = 42;

/**
 *
 * @param {string} text
 * @param {string | number} color
 * @returns
 */
function color(text, color) {
  return `\u001b[${color}m${text}\u001b[0m`;
}

/**
 * Console server
 * @class
 */
export class ConsoleServer {
  /**
   * The name displayed before each message from your bot.
   */
  name = "bot";

  /**
   * The color used to display the name.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  nameColor = green;

  /**
   * The prompt displayed before the user input.
   */
  prompt = ">";

  /**
   * The color used to display the prompt.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  promptColor = green;

  /**
   * The color used to display the response from the bot.
   *
   * See https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html for info on
   * terminal colors.
   */
  responseColor = grey;

  /**
   * Optional token, that user can type to stop the console server.
   *
   * Default is '/quit'
   */
  stopToken = "/quit";

  /**
   * The greeting displayed when the console channel starts listening.
   */
  greeting = `${color(" ChatAlly ", onGreen)} ${color("Console Server", green)}
Quit with 'Ctrl+c'${this.stopToken ? `or type '${this.stopToken}'` : ""}.
Waiting for your messages...`;

  /**
   * The message displayed, when the console channel shuts down.
   */
  goodBye = `Good bye.`;

  /** @type {import("@chatally/core").Dispatch} */
  #dispatch = async (req, res) => {
    res.end(`You said:
    > ${req.text}`);
  };

  /** @param {import("@chatally/core").Dispatch} dispatch */
  set dispatch(dispatch) {
    this.#dispatch = dispatch;
  }

  listen() {
    this.#printGreeting();
    this._interface = readline(process.stdin);

    this._interface
      .on("line", (input) => this.#printResponse(input))
      .on("close", () => this.#printGoodBye());
  }

  #printGreeting() {
    // TODO: Can this be done on arbitrary streams?
    process.stdout.write(" ");
    console.clear();
    if (this.greeting) {
      process.stdout.write(`${this.greeting}\n\n`);
    }
    this.#printPrompt();
  }

  /**
   * @param {String} line
   */
  async #printResponse(line) {
    if (this.stopToken && line === this.stopToken) {
      return this._interface?.close();
    }
    const req = new Request(line);
    const res = new Response();
    await this.#dispatch(req, res);
    for (let text of res.text) {
      this.#printName();
      process.stdout.write(`${color(text, this.responseColor)}\n`);
    }
    this.#printPrompt();
  }

  #printGoodBye() {
    if (this.goodBye) {
      process.stdout.write(`\n${this.goodBye}`);
    }
    process.stdout.write("\n");
    process.exit();
  }

  #printName() {
    const length =
      Math.max(this.name.length, this.prompt.length) - this.name.length;
    const padStart = "".padStart(length, " ");
    process.stdout.write(`${padStart}${color(this.name, this.nameColor)} `);
  }

  #printPrompt() {
    const length =
      Math.max(this.name.length, this.prompt.length) - this.prompt.length;
    const padStart = " ".repeat(length);
    process.stdout.write(`${padStart}${color(this.prompt, this.promptColor)} `);
  }
}
