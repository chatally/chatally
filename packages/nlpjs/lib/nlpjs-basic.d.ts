declare module '@nlpjs/basic' {
  export function dockStart(conf?: Configuration): Promise<Dock>
  export interface Configuration {
    settings?: {
      nlp?: {
        corpora?: string[]
      }
    }
    use?: Plugin[]
  }
  export type Plugin = 'Basic' | 'Qna'
  export interface Dock {
    getContainer: () => Container
    get: (module: 'nlp') => Nlp
  }
  export interface Container {
    register: (module: 'logger', logger: Logger) => void
  }
  export interface Logger {
    trace: (msg: string) => void
    debug: (msg: string) => void
    info: (msg: string) => void
    log: (msg: string) => void
    warn: (msg: string) => void
    error: (msg: string) => void
    fatal: (msg: string) => void
  }
  export interface Nlp {
    train: () => Promise<void>
    process: (language: Language, input: string) => Promise<Result>
  }
  export type Language = 'en'
  export interface Result {
    answer?: string
    score: number
  }
}
