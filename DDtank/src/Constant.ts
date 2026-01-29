import { guid } from 'genshin-ts/runtime/value'

export const constants = {
  PlaneID: prefabId(1077936144),
  GameProcessEntity: new guid(1077938371),
  GameConfigEntity: new guid(1077938377),
  PlayerControllerEntity: prefabId(1077936154),
  PlayerLocaterEntity: prefabId(1077936153),
  CharacterEntity: prefabId(1077936156),
}
export enum PlayerState {
  Observing = 0,
  Inturn = 1,
  Attacking = 2,
  Dead = 3,
  OutTurn = 4
}
export enum PlayerInput {
  Down = 1,
  Up = 2,
  Left = 4,
  Right = 8
}
