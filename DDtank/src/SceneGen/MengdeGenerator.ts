import { g } from 'genshin-ts/runtime/core'

import { constants } from '../Constant'

g.server({
  id: 1073741833 //Operation
}).on('whenEntityIsCreated', (_evt, f) => {
  const configEntity = f.queryEntityByGuid(constants.GameConfigEntity)
  const PlaneYLoc = f.getCustomVariable(configEntity, 'PlaneYLoc').asType('float')
  for (let i = 0n; i < 10n; i++) {
    const z = Number(i) * 0.5
    f.createPrefab(
      constants.PlaneID,
      f.create3dVector(0, PlaneYLoc, z),
      f.create3dVector(0, 0, 90),
      f.getSelfEntity(),
      false,
      1n,
      f.emptyList('int')
    )
  }
  for (let i = 10n; i < 20n; i++) {
    const z = Number(i) * 0.5
    f.createPrefab(
      constants.PlaneID,
      f.create3dVector(0, PlaneYLoc, z),
      f.create3dVector(0, 0, 90),
      f.getSelfEntity(),
      false,
      1n,
      f.emptyList('int')
    )
  }
  for (let i = 20n; i < 30n; i++) {
    const z = Number(i) * 0.5
    f.createPrefab(
      constants.PlaneID,
      f.create3dVector(0, PlaneYLoc, z),
      f.create3dVector(0, 0, 90),
      f.getSelfEntity(),
      false,
      1n,
      f.emptyList('int')
    )
  }
})
