import { WriteStream } from 'fs'
import { Readable } from 'stream'

export function asyncPipe(readStream: Readable, writeStream: WriteStream) {
  return new Promise((resolve) => {
    const req = readStream.pipe(writeStream)
    req.on('finish', resolve)
  })
}
