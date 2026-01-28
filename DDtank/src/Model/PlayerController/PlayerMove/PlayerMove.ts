import { g } from 'genshin-ts/runtime/core'

import { PlayerInput, PlayerState } from '../../../Constant'

g.server({
  id: 1073741845 //DestroyManager
}).onSignal('UpdateGame', (_evt, f) => {
  const self = f.getSelfEntity()
  const playerState = f.getCustomVariable(self, 'PlayerState').asType('int')
  const Input = f.getCustomVariable(self, 'Input').asType('int')
  let MoveVectorX = 0.0
  let MoveVectorY = 0.0
  f.setCustomVariable<'int'>(
    f.getCustomVariable(self, 'PlayerEntity').asType('entity'),
    'Test',
    Input
  )
  if (f.bitwiseAnd(Input, BigInt(PlayerInput.Up)) != 0n) {
    MoveVectorY = 1.0
  }
  if (f.bitwiseAnd(Input, BigInt(PlayerInput.Down)) != 0n) {
    MoveVectorY = -1.0
  }
  if (f.bitwiseAnd(Input, BigInt(PlayerInput.Left)) != 0n) {
    MoveVectorX = -1.0
  }
  if (f.bitwiseAnd(Input, BigInt(PlayerInput.Right)) != 0n) {
    MoveVectorX = 1.0
  }
  gstsServerMovePlayer(MoveVectorX, MoveVectorY)
})

function gstsServerMovePlayer(X: number, Y: number) {
  if (X != 0 || Y != 0) {
    const self = gsts.f.getSelfEntity()
    gsts.f.stopAndDeleteBasicMotionDevice(self, 'basic_Move', true)
    const MoveX = X / 0.15
    const MoveY = Y / 0.15
    gsts.f.addUniformBasicLinearMotionDevice(
      self,
      'basic_Move',
      0.2,
      gsts.f.create3dVector(0, MoveY, MoveX)
    )
  }
}
