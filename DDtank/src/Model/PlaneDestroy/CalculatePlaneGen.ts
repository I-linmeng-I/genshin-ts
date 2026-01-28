import { g } from 'genshin-ts/runtime/core'
import { float, guid, IntValue, vec3 } from 'genshin-ts/runtime/value'

import { constants } from '../../Constant'

g.server({
  id: 1073741832 //DestroyManager
}).on('whenCustomVariableChanges', (_evt, f) => {
  if (_evt.variableName == 'CalculatePlaneGen') {
    const self = f.getSelfEntity()
    const configEntity = f.queryEntityByGuid(constants.GameConfigEntity)
    const PlaneLength = f.getCustomVariable(configEntity, 'PlaneLength').asType('float')
    const PlaneThickness = f.getCustomVariable(configEntity, 'PlaneThickness').asType('float')

    const explosionCenter = f.getCustomVariable(self, 'ExplosionLocation').asType('vec3')
    const explosionRadius = f.getCustomVariable(self, 'ExplosionRadius').asType('float')

    const loc = f.getEntityLocationAndRotation(self).location
    //向右为正方向
    const rightVector = f.getEntityForwardVector(self)
    const leftVector = f._3dVectorZoom(rightVector, -1)
    const upVector = f.getEntityUpwardVector(self)

    //LOC是交点计算用点，point为生成传递用点
    const leftPoint = f._3dVectorAddition(loc, f._3dVectorZoom(leftVector, PlaneLength / 2))
    const leftLoc = f._3dVectorAddition(leftPoint, f._3dVectorZoom(upVector, PlaneThickness / 2))

    const rightPoint = f._3dVectorAddition(loc, f._3dVectorZoom(rightVector, PlaneLength / 2))
    const rightLoc = f._3dVectorAddition(rightPoint, f._3dVectorZoom(upVector, PlaneThickness / 2))

    let type = 0n

    if (f.distanceBetweenTwoCoordinatePoints(leftLoc, explosionCenter) > explosionRadius) {
      type = type + 1n
    }
    if (f.distanceBetweenTwoCoordinatePoints(rightLoc, explosionCenter) > explosionRadius) {
      type = type + 2n
    }

    f.setCustomVariable<'vec3'>(f.getSelfEntity(), 'LPoint', leftPoint)
    f.setCustomVariable<'vec3'>(f.getSelfEntity(), 'RPoint', rightPoint)
    f.setCustomVariable<'int'>(f.getSelfEntity(), 'GenType', type)

    f.setCustomVariable<'int'>(f.getSelfEntity(), 'EndCalculate', 1n, true)
  }
})
