/// <reference types="node" />

// Note: marking anything protected or private in the exported
// class will limit Minipass's ability to be used as the base
// for mixin classes.
import { EventEmitter } from 'events'
import { Stream } from 'stream'

export namespace Minipass {
  export type Encoding = BufferEncoding | 'buffer' | null

  export type Writable =
    | Minipass<any, any, any>
    | NodeJS.WriteStream
    | (NodeJS.WriteStream & { fd: number })
    | (EventEmitter & {
        end(): any
        write(chunk: any, ...args: any[]): any
      })

  export type Readable =
    | Minipass<any, any, any>
    | NodeJS.ReadStream
    | (NodeJS.ReadStream & { fd: number })
    | (EventEmitter & {
        pause(): any
        resume(): any
        pipe(...destArgs: any[]): any
      })

  export type DualIterable<T> = Iterable<T> & AsyncIterable<T>

  export type ContiguousData =
    | Buffer
    | ArrayBufferLike
    | ArrayBufferView
    | string

  export type BufferOrString = Buffer | string

  export interface SharedOptions {
    async?: boolean
    signal?: AbortSignal
  }

  export interface StringOptions extends SharedOptions {
    encoding: BufferEncoding
    objectMode?: boolean
  }

  export interface BufferOptions extends SharedOptions {
    encoding?: null | 'buffer'
    objectMode?: boolean
  }

  export interface ObjectModeOptions extends SharedOptions {
    objectMode: true
  }

  export interface PipeOptions {
    end?: boolean
    proxyErrors?: boolean
  }

  export type Options<T> = T extends string
    ? StringOptions
    : T extends Buffer
    ? BufferOptions
    : ObjectModeOptions

  interface EventArguments {
    [k: string | symbol]: unknown[]
  }
  /**
   * The listing of events that a Minipass class can emit.
   * Extend this when extending the Minipass class, and pass as
   * the third template argument.  The key is the name of the event,
   * and the value is the argument list.
   *
   * Any undeclared events will still be allowed, but the handler will get
   * arguments as "unknown".
   */
  export interface Events<RType extends any = Buffer> extends EventArguments {
    readable: []
    data: [chunk: RType]
    error: [er: unknown]
    abort: [reason: unknown]
    drain: []
    resume: []
    end: []
    finish: []
    prefinish: []
    close: []
  }
}

export class Minipass<
    RType extends any = Buffer,
    WType extends any = RType extends Minipass.BufferOrString
      ? Minipass.ContiguousData
      : RType,
    Events extends Minipass.Events<RType> = Minipass.Events<RType>
  >
  extends Stream
  implements Minipass.DualIterable<RType>
{
  static isStream(stream: any): stream is Minipass.Readable | Minipass.Writable

  readonly bufferLength: number
  readonly flowing: boolean
  readonly writable: boolean
  readonly readable: boolean
  readonly aborted: boolean
  readonly paused: boolean
  readonly emittedEnd: boolean
  readonly destroyed: boolean

  /**
   * Technically writable, but mutating it can change the type,
   * so is not safe to do in TypeScript.
   */
  readonly objectMode: boolean
  async: boolean

  /**
   * Note: encoding is not actually read-only, and setEncoding(enc)
   * exists. However, this type definition will insist that TypeScript
   * programs declare the type of a Minipass stream up front, and if
   * that type is string, then an encoding MUST be set in the ctor. If
   * the type is Buffer, then the encoding must be missing, or set to
   * 'buffer' or null. If the type is anything else, then objectMode
   * must be set in the constructor options.  So there is effectively
   * no allowed way that a TS program can set the encoding after
   * construction, as doing so will destroy any hope of type safety.
   * TypeScript does not provide many options for changing the type of
   * an object at run-time, which is what changing the encoding does.
   */
  readonly encoding: Minipass.Encoding
  // setEncoding(encoding: Encoding): void

  // Options required if not reading buffers
  constructor(
    ...args: RType extends Buffer
      ? [] | [Minipass.Options<RType>]
      : [Minipass.Options<RType>]
  )

  on<Event extends keyof Events>(
    ev: Event,
    handler: (...args: Events[Event]) => any
  ): this

  once<Event extends keyof Events>(
    ev: Event,
    handler: (...args: Events[Event]) => any
  ): this

  addListener<Event extends keyof Events>(
    ev: Event,
    handler: (...args: Events[Event]) => any
  ): this

  emit<Event extends keyof Events>(ev: Event, ...data: Events[Event]): boolean

  write(chunk: WType, cb?: () => void): boolean
  write(chunk: WType, encoding?: Minipass.Encoding, cb?: () => void): boolean
  read(size?: number): RType
  end(cb?: () => void): this
  end(chunk: any, cb?: () => void): this
  end(chunk: any, encoding?: Minipass.Encoding, cb?: () => void): this
  pause(): void
  resume(): void
  promise(): Promise<void>
  collect(): Promise<RType[]>

  concat(): RType extends Minipass.BufferOrString ? Promise<RType> : never
  destroy(er?: any): void
  pipe<W extends Minipass.Writable>(dest: W, opts?: Minipass.PipeOptions): W
  unpipe<W extends Minipass.Writable>(dest: W): void

  [Symbol.iterator](): Generator<RType, void, void>
  [Symbol.asyncIterator](): AsyncGenerator<RType, void, void>
}
