import { SortBy } from 'genshin-ts/definitions/enum'
import { g } from 'genshin-ts/runtime/core'
import { float, guid, IntValue, vec3 } from 'genshin-ts/runtime/value'

import { constants } from '../../Constant'

//atan2
function gstsServercustom_atan2(y: number, x: number): number {
  let returnValue: number = 0.0
  // 1. 防止除以0
  if (x == 0) {
    if (y > 0) {
      returnValue = (-1 * gsts.f.pi()) / 2
    } else if (y < 0) {
      returnValue = gsts.f.pi() / 2
    } else {
      returnValue = 0
    }
  } else {
    let angle = gsts.f.arctangentFunction(gsts.f.division(y, x))
    returnValue = angle
    // returnValue = y/x;
    // returnValue = gsts.f.arctangentFunction(returnValue);
    if (x < 0) {
      if (y >= 0) {
        returnValue = angle + gsts.f.pi()
      } else {
        returnValue = angle - gsts.f.pi()
      }
    }
    // returnValue = -1 * returnValue
  }

  return returnValue
}

//生成板子
g.server({
  id: 1073741827 //DestroyManager
}).on('whenTimerIsTriggered', (_evt, f) => {
  const self = f.getSelfEntity()
  let startPointList = f.emptyList('vec3')
  let endPointList = f.emptyList('vec3')
  let explosionRadius = f.getCustomVariable(self, 'ExplosionRadius').asType('float')
  const explosionCenter = f.getCustomVariable(self, 'ExplosionLocation').asType('vec3')

  const LPointList = f.getCustomVariable(self, 'LPointList').asType('vec3_list')
  const RPointList = f.getCustomVariable(self, 'RPointList').asType('vec3_list')
  const TypeList = f.getCustomVariable(self, 'TypeList').asType('int_list')

  const configEntity = f.queryEntityByGuid(constants.GameConfigEntity)
  const PlaneYLoc = f.getCustomVariable(configEntity, 'PlaneYLoc').asType('float')
  const PlaneLength = f.getCustomVariable(configEntity, 'PlaneLength').asType('float')

  if (_evt.timerName == 'ExplosionAwait') {
    //计算起始和结束点
    let radiansList = f.emptyList('float')
    f.printString('---开始计算起点和终点---')
    for (let i = 0; i < TypeList.length; i++) {
      let LocDiff = f.create3dVector(0, 0, 0)
      f.printString('板子状态')
      f.printString(str(LPointList[i]))
      f.printString(str(RPointList[i]))
      f.printString(str(TypeList[i]))
      if (TypeList[i] == 1n) {
        LocDiff = f._3dVectorSubtraction(LPointList[i], explosionCenter)
        f.insertValueIntoList(
          radiansList,
          radiansList.length,
          gstsServercustom_atan2(
            f.split3dVector(LocDiff).xComponent,
            f.split3dVector(LocDiff).zComponent
          )
        )
        f.printString(str(radiansList[i]))
      } else {
        LocDiff = f._3dVectorSubtraction(RPointList[i], explosionCenter)
        f.insertValueIntoList(
          radiansList,
          radiansList.length,
          gstsServercustom_atan2(
            f.split3dVector(LocDiff).xComponent,
            f.split3dVector(LocDiff).zComponent
          )
        )
        f.printString(str(radiansList[i]))
      }
    }

    let radiansListSorted = radiansList
    f.listSorting(radiansListSorted, SortBy.Ascending)

    let start = 0n
    for (let i = 0; i < radiansListSorted.length; i++) {
      const index = f.searchListAndReturnValueId(radiansList, radiansListSorted[i])[0]
      if (TypeList[index as unknown as number] == 2n && i == 0) {
        //第一个是右边点，说明是跨pi的情况
        const startIndex = f.searchListAndReturnValueId(
          radiansList,
          radiansListSorted[radiansListSorted.length - 1]
        )[0]
        f.insertValueIntoList(startPointList, 0, LPointList[startIndex as unknown as number])
        f.insertValueIntoList(endPointList, 0, RPointList[index as unknown as number])
      } else {
        if (i != radiansListSorted.length - 1 && start == 0n) {
          f.insertValueIntoList(startPointList, 0, LPointList[index as unknown as number])
        }
        if (start == 1n) {
          f.insertValueIntoList(endPointList, 0, RPointList[index as unknown as number])
        }
        start = (start + 1n) % 2n
      }
    }

    f.printString('---计算出起点和终点---')
    f.printString(str(radiansListSorted.length))
    f.printString(str(startPointList.length))
    f.printString(str(endPointList.length))
    f.printString('---生成板子---')

    for (let i = 0; i < startPointList.length; i++) {
      f.printString(str(startPointList[i]))
      f.printString(str(endPointList[i]))
      const startPoint = startPointList[i]
      const endPoint = endPointList[i]
      //生成板子
      const midpoint = f._3dVectorZoom(f._3dVectorAddition(startPoint, endPoint), 0.5)
      const chordVector = f._3dVectorSubtraction(endPoint, startPoint)
      //差距小于板子长度的话直接连接。大于再生成
      if (f.distanceBetweenTwoCoordinatePoints(startPoint, endPoint) <= PlaneLength) {
        const finalRotation = f.create3dVector(
          0,
          f.radiansToDegrees(gstsServercustom_atan2(chordVector.x, chordVector.z)),
          90
        )

        f.createPrefab(
          constants.PlaneID,
          midpoint,
          finalRotation,
          self,
          false,
          1,
          f.emptyList('int')
        )
      } else {
        let chordLength = f.distanceBetweenTwoCoordinatePoints(startPoint, endPoint)
        let radius: number = explosionRadius
        if (chordLength > explosionRadius * 2) {
          explosionRadius = chordLength / 2
          radius = chordLength / 2
        }

        const h = f.arithmeticSquareRootOperation(
          explosionRadius * explosionRadius - radius * radius
        )

        let normalVector = f.create3dVector(-1 * chordVector.z, 0, chordVector.x)
        normalVector = f._3dVectorNormalization(normalVector)

        const center1 = f._3dVectorAddition(midpoint, f._3dVectorZoom(normalVector, h))
        const center2 = f._3dVectorSubtraction(midpoint, f._3dVectorZoom(normalVector, h))

        let crateCenter = f.create3dVector(0, 0, 0)
        if (
          f.distanceBetweenTwoCoordinatePoints(center1, explosionCenter) <
          f.distanceBetweenTwoCoordinatePoints(center2, explosionCenter)
        ) {
          crateCenter = center1
        } else {
          crateCenter = center2
        }

        // const angleStart:number = custom_atan2(startPoint[i].y-crateCenter.y,startPoint[i].z-crateCenter.z);
        // const angleEnd:number = custom_atan2(endPoint[i].y-crateCenter.y,endPoint[i].z-crateCenter.z);
        const angleDiffStart = f._3dVectorSubtraction(startPoint, crateCenter)

        const angleStart: number = gstsServercustom_atan2(
          f.split3dVector(angleDiffStart).xComponent,
          f.split3dVector(angleDiffStart).zComponent
        )
        f.printString('---angleStart---')
        f.printString(str(angleStart))

        const angleDiffEnd = f._3dVectorSubtraction(endPoint, crateCenter)
        const angleEnd: number = gstsServercustom_atan2(
          f.split3dVector(angleDiffEnd).xComponent,
          f.split3dVector(angleDiffEnd).zComponent
        )
        f.printString('---angleEnd---')
        f.printString(str(angleEnd))

        let angleDiff = angleEnd - angleStart
        f.printString('---angleDiff---')
        f.printString(str(angleDiff))
        while (angleDiff > 0) {
          angleDiff = angleDiff - 2 * f.pi()
        }
        while (angleDiff < -2 * f.pi()) {
          angleDiff = angleDiff + 2 * f.pi()
        }

        const angleStep = (-1 * PlaneLength) / explosionRadius
        f.printString('---angleStep---')
        f.printString(str(angleStep))

        const count = Math.floor(f.absoluteValueOperation(angleDiff / angleStep)) as IntValue
        let currentAngle = angleStart
        f.printString('---count---')
        f.printString(str(count))

        for (let i = 0; i < (count as unknown as number); i++) {
          const mathAngleStart = currentAngle
          let posStart = f.create3dVector(
            crateCenter.x + explosionRadius * f.sineFunction(mathAngleStart),
            PlaneYLoc,
            crateCenter.z + explosionRadius * f.cosineFunction(mathAngleStart)
          )
          if (i == 0) {
            posStart = startPoint
          }
          const nextAngle = currentAngle + angleStep

          let posEnd = f.create3dVector(0, 0, 0)

          if (i == (count as unknown as number) - 1) {
            //最后一个板子分类，凸出了的话就从终点往回推，凹的话就用两个板子来实现
            if (f.distanceBetweenTwoCoordinatePoints(endPoint, posStart) < PlaneLength) {
              posEnd = endPoint

              posStart = f._3dVectorSubtraction(posStart, posEnd)
              posStart = f._3dVectorNormalization(posStart)
              posStart = f._3dVectorZoom(posStart, PlaneLength)
              posStart = f._3dVectorAddition(posEnd, posStart)
            } else {
              posEnd = f._3dVectorSubtraction(endPoint, posStart)
              posEnd = f._3dVectorNormalization(posEnd)
              posEnd = f._3dVectorZoom(posEnd, PlaneLength)
              posEnd = f._3dVectorAddition(posEnd, posStart)

              let finalStart = f._3dVectorSubtraction(posEnd, endPoint)
              finalStart = f._3dVectorNormalization(finalStart)
              finalStart = f._3dVectorZoom(finalStart, PlaneLength)
              finalStart = f._3dVectorAddition(endPoint, finalStart)

              const finalRotation = f.create3dVector(
                0,
                f.radiansToDegrees(
                  gstsServercustom_atan2(endPoint.x - finalStart.x, endPoint.z - finalStart.z)
                ),
                90
              )

              f.createPrefab(
                constants.PlaneID,
                f._3dVectorZoom(f._3dVectorAddition(finalStart, endPoint), 0.5),
                finalRotation,
                self,
                false,
                1,
                f.emptyList('int')
              )
            }
          } else {
            const mathAngleEnd = nextAngle
            posEnd = f.create3dVector(
              crateCenter.x + explosionRadius * f.sineFunction(mathAngleEnd),
              PlaneYLoc,
              crateCenter.z + explosionRadius * f.cosineFunction(mathAngleEnd)
            )
          }
          const finalPos = f._3dVectorZoom(f._3dVectorAddition(posStart, posEnd), 0.5)

          const rotation = f.create3dVector(
            0,
            f.radiansToDegrees(
              gstsServercustom_atan2(posEnd.x - posStart.x, posEnd.z - posStart.z)
            ),
            90
          )

          f.createPrefab(constants.PlaneID, finalPos, rotation, self, false, 1, f.emptyList('int'))

          currentAngle = angleStep + currentAngle
        }
      }
    }

    f.setCustomVariable<'vec3_list'>(self, 'LPointList', f.emptyList('vec3'))
    f.setCustomVariable<'vec3_list'>(self, 'RPointList', f.emptyList('vec3'))
    f.setCustomVariable<'int_list'>(self, 'TypeList', f.emptyList('int'))
  }
})
