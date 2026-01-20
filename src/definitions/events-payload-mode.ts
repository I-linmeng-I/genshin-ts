import type { ServerGraphMode } from '../runtime/IR.js'
import type { ReplaceEntityByMode } from './entity_helpers.js'
import type { ServerEventPayloads } from './events-payload.js'

export type ServerEventPayloadsByMode<M extends ServerGraphMode> = {
  [K in keyof ServerEventPayloads]: ReplaceEntityByMode<ServerEventPayloads[K], M>
}
