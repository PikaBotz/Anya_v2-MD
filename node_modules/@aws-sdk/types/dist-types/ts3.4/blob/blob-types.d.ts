import { RuntimeBlobTypes } from "./runtime-blob-types.node";
export type BlobTypes =
  | string
  | ArrayBuffer
  | ArrayBufferView
  | Uint8Array
  | RuntimeBlobTypes;
