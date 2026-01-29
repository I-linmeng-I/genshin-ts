import { FollowCoordinateSystem, FollowLocationType } from 'genshin-ts/definitions/enum'
import { PlayerEntity } from 'genshin-ts/definitions/nodes'
import { g } from 'genshin-ts/runtime/core'
import { EntityValue } from 'genshin-ts/runtime/value'

import { constants } from '../../Constant'
import { gstsServerSetPlayerController } from '../../PlayerFunction'
import { gstsServerAddProcess, gstsServerProcessReturn } from '../../ProcessFunction'

g.server({
  id: 1073741834 //Porcess
}).on('whenEntityIsCreated', (_evt, f) => {
  const self = f.getSelfEntity()
  const configEntity = f.queryEntityByGuid(constants.GameConfigEntity)

  //初始化所有变量（方便管理）
  if (f.getCustomVariable(configEntity, 'PlayerNum').asType('int') == 0n) {
    f.setCustomVariable<'int'>(
      configEntity,
      'PlayerNum',
      f.queryGameModeAndPlayerNumber().playerCount
    )
  }
  f.setCustomVariable<'int'>(configEntity, 'CurrentSceneGenID', 0n)
  f.setCustomVariable<'entity_list'>(configEntity, 'PlayerControllerList', f.emptyList('entity'))

  gstsServerAddProcess(1n, 0n, 0n, 0n, 0n, 0n)
  f.startTimer(self, 'WaitPlayerLoad', true, [5])
})

g.server({
  id: 1073741834 //Porces
}).on('whenTimerIsTriggered', (_evt, f) => {
  if (_evt.timerName == 'WaitPlayerLoad') {
    const configEntity = f.queryEntityByGuid(constants.GameConfigEntity)
    const playerNum = f.getCustomVariable(configEntity, 'PlayerNum').asType('int')
    const loadedPlayerList: EntityValue[] = f.getListOfPlayerEntitiesOnTheField()
    //测试模式
    if (playerNum == 5n) {
      f.setCustomVariable<'int'>(configEntity, 'PlayerNum', 4n)
      //生成玩家控制器
      gstsServerInitPlayerController(loadedPlayerList, true)
      gstsServerProcessReturn(1n)
      f.stopTimer(f.getSelfEntity(), 'WaitPlayerLoad')
    }
    if ((playerNum as any) == f.getListLength(loadedPlayerList)) {
      //处理玩家阵营
      switch (playerNum) {
        case 2n:
          if (f.getEntityListBySpecifiedFaction(loadedPlayerList, 4).length == 0) {
            f.modifyEntityFaction(loadedPlayerList[0 as any], 4)
          } else if (f.getEntityListBySpecifiedFaction(loadedPlayerList, 5).length == 0) {
            f.modifyEntityFaction(loadedPlayerList[0 as any], 5)
          }
          break
        case 3n:
          f.setCustomVariable<'int'>(configEntity, 'PlayerNum', 2n)
          f.teleportPlayer(
            loadedPlayerList[2] as PlayerEntity,
            f.create3dVector(0, 9, 0),
            f.create3dVector(0, 0, 0)
          )
          f.switchMainCameraTemplate([loadedPlayerList[2] as PlayerEntity], 'Player3')
          break
      }
      gstsServerInitPlayerController(loadedPlayerList, false)
      gstsServerProcessReturn(1n)
      f.stopTimer(f.getSelfEntity(), 'WaitPlayerLoad')
    }
  }
})

function gstsServerInitPlayerController(loadedPlayerList: EntityValue[], isTestMode: boolean) {
  const configEntity = gsts.f.queryEntityByGuid(constants.GameConfigEntity)
  //生成玩家控制器
  for (let i = 0n; i < gsts.f.getListLength(loadedPlayerList); i++) {
    const locY = gsts.f.dataTypeConversion(5 + (i as any) * 2, 'float')
    //生成控制器
    const PlayerController = gsts.f.createPrefab(
      constants.PlayerControllerEntity,
      gsts.f.create3dVector(0, locY, 0),
      gsts.f.create3dVector(0, 180, 180),
      loadedPlayerList[i as unknown as number],
      false,
      1n,
      gsts.f.emptyList('int')
    )
    gsts.f.activateDisableModelDisplay(PlayerController, false)
    gsts.f.insertValueIntoList(
      gsts.f.getCustomVariable(configEntity, 'PlayerControllerList').asType('entity_list'),
      0,
      PlayerController
    )
    if (isTestMode) {
      gsts.f.setCustomVariable<'entity'>(PlayerController, 'PlayerEntity', loadedPlayerList[0])
    } else {
      gsts.f.setCustomVariable<'entity'>(
        PlayerController,
        'PlayerEntity',
        loadedPlayerList[i as unknown as number]
      )
    }
    gstsServerSetPlayerController(false, PlayerController)
    //传送玩家到控制器
    gsts.f.teleportPlayer(
      loadedPlayerList[i as unknown as number] as PlayerEntity,
      gsts.f.create3dVector(0, locY, 0),
      gsts.f.create3dVector(0, 0, 0)
    )
    switch (i) {
      case 0n:
        gsts.f.switchMainCameraTemplate(
          [loadedPlayerList[i as unknown as number] as PlayerEntity],
          'Player1'
        )
        break
      case 1n:
        gsts.f.switchMainCameraTemplate(
          [loadedPlayerList[i as unknown as number] as PlayerEntity],
          'Player2'
        )
        break
      case 2n:
        gsts.f.switchMainCameraTemplate(
          [loadedPlayerList[i as unknown as number] as PlayerEntity],
          'Player3'
        )
        break
      case 3n:
        gsts.f.switchMainCameraTemplate(
          [loadedPlayerList[i as unknown as number] as PlayerEntity],
          'Player4'
        )
        break
    }
    // f.activateDisableModelDisplay(
    //   f.getAllCharacterEntitiesOfSpecifiedPlayer(loadedPlayerList[i as any] as PlayerEntity)[0],
    //   false
    // )
  }
}
