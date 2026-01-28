import { FollowCoordinateSystem, FollowLocationType } from 'genshin-ts/definitions/enum'
import { PlayerEntity } from 'genshin-ts/definitions/nodes'
import { g } from 'genshin-ts/runtime/core'

import { constants, PlayerInput } from '../../../Constant'
import { gstsServerAddProcess, gstsServerProcessReturn } from '../../../ProcessFunction'

g.server({
  id: 1073741844 //Porcess
}).on('whenEnteringCollisionTrigger', (_evt, f) => {
  const self = f.getSelfEntity()
  const Input = f.getCustomVariable(self, 'Input').asType('int')
  switch (_evt.triggerId) {
    case 1n:
      f.activateDisableCollisionTrigger(self, 2n, false)
      f.activateDisableCollisionTrigger(self, 3n, false)
      f.activateDisableCollisionTrigger(self, 4n, false)
      f.activateDisableCollisionTrigger(self, 5n, false)
      break
    case 2n:
      f.setCustomVariable<'int'>(self, 'Input', Input | BigInt(PlayerInput.Down))
      break
    case 3n:
      f.setCustomVariable<'int'>(self, 'Input', Input | BigInt(PlayerInput.Up))
      break
    case 4n:
      f.setCustomVariable<'int'>(self, 'Input', Input | BigInt(PlayerInput.Left))
      break
    case 5n:
      f.setCustomVariable<'int'>(self, 'Input', Input | BigInt(PlayerInput.Right))
      break
  }
})
g.server({
  id: 1073741844 //Porcess
}).on('whenExitingCollisionTrigger', (_evt, f) => {
  const self = f.getSelfEntity()
  const Input = f.getCustomVariable(self, 'Input').asType('int')
  switch (_evt.triggerId) {
    case 1n:
      f.activateDisableCollisionTrigger(self, 2n, true)
      f.activateDisableCollisionTrigger(self, 3n, true)
      f.activateDisableCollisionTrigger(self, 4n, true)
      f.activateDisableCollisionTrigger(self, 5n, true)
      break
    case 2n:
      f.activateDisableCollisionTrigger(self, 1n, true)
      f.setCustomVariable<'int'>(self, 'Input', Input & ~BigInt(PlayerInput.Down))
      break
    case 3n:
      f.activateDisableCollisionTrigger(self, 1n, true)
      f.setCustomVariable<'int'>(self, 'Input', Input & ~BigInt(PlayerInput.Up))
      break
    case 4n:
      f.activateDisableCollisionTrigger(self, 1n, true)
      f.setCustomVariable<'int'>(self, 'Input', Input & ~BigInt(PlayerInput.Left))
      break
    case 5n:
      f.activateDisableCollisionTrigger(self, 1n, true)
      f.setCustomVariable<'int'>(self, 'Input', Input & ~BigInt(PlayerInput.Right))
      break
  }
})
