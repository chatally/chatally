import { createInterface as readline } from "node:readline";
import { createRequest, createResponse } from "@chatally/core";

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

export class Console {
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
   * The greeting displayed when the console channel starts listening.
   */
  greeting = `${color(" ChatAlly ", onGreen)} ${color("Console Server", green)}
Quit with 'Ctrl+c'.
Waiting for your messages...`;

  /**
   * The message displayed, when the console channel shuts down.
   */
  goodBye = `Good bye.`;

  /** @type {import("@chatally/core").Callback} */
  #respond = async (req, res) => {
    const echo = req.messages.map((m) => `    > ${m}`).join("\n");
    res.end(`You said:
${echo}`);
  };

  /**
   * @param {import("@chatally/core").Callback} responder
   */
  set respond(responder) {
    this.#respond = responder;
  }

  listen() {
    this.#printGreeting();
    readline(process.stdin)
      .on("line", this.#printResponse.bind(this))
      .on("close", this.#printGoodBye.bind(this));
  }

  #printGreeting() {
    if (this.greeting) {
      process.stdout.write(`${this.greeting}\n\n`);
    }
    this.#printPrompt();
  }

  /**
   * @param {String} line
   */
  async #printResponse(line) {
    const req = createRequest(line);
    const res = createResponse();
    await this.#respond(req, res);
    for (let message of res.messages) {
      this.#printName();
      process.stdout.write(`${color(message, this.responseColor)}\n`);
    }
    this.#printPrompt();
  }

  #printGoodBye() {
    if (this.goodBye) {
      process.stdout.write(`\n${this.goodBye}`);
    }
    process.stdout.write("\n");
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
