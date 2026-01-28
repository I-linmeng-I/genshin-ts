import { g } from 'genshin-ts/runtime/core'
import { entity } from 'genshin-ts/runtime/value'

import { constants } from '../Constant'
import {
  gstsServerAddProcess,
  gstsServerGetProcessInfo,
  gstsServerProcessReturn
} from '../ProcessFunction'

g.server({
  id: 1073741826 //Operation
}).on('whenCustomVariableChanges', (_evt, f) => {
  if (_evt.variableName == 'StartProcess') {
    const currentProcessType = gstsServerGetProcessInfo('type')
    const currentProcessStep = gstsServerGetProcessInfo('step')
    const currentProcessArg1 = gstsServerGetProcessInfo('arg1')
    const currentProcessArg2 = gstsServerGetProcessInfo('arg2')
    const currentProcessArg3 = gstsServerGetProcessInfo('arg3')
    const currentProcessArg4 = gstsServerGetProcessInfo('arg4')
    const configEntity = gsts.f.queryEntityByGuid(constants.GameConfigEntity)
    switch (currentProcessType) {
      case 1n:
        //准备阶段
        gstsServerPrepare(currentProcessStep, configEntity)
        break
      case 2n:
        gstsServerTurn(currentProcessStep, currentProcessArg1)
        break
    }
  }
})

function gstsServerPrepare(step: bigint, configEntity: entity) {
  switch (step) {
    case 1n:
      //生成玩家控制器(准备界面)
      for (let i = 0n; i < gsts.f.getCustomVariable(configEntity, 'PlayerNum').asType('int'); i++) {
        const CreateLoc = gsts.f
          .getCustomVariable(configEntity, 'PrepareCharacterLoc')
          .asType('vec3_list')[i as any]
        const CharacterEntity = gsts.f.createPrefab(
          constants.CharacterEntity,
          CreateLoc,
          gsts.f.create3dVector(0, 0, 0),
          gsts.f.getSelfEntity(),
          false,
          1n,
          gsts.f.emptyList('int')
        )
        gsts.f.setCustomVariable<'entity'>(
          gsts.f.getCustomVariable(configEntity, 'PlayerControllerList').asType('entity_list')[
            i as any
          ],
          'CharacterEntity',
          CharacterEntity
        )
      }
      //补充准备的逻辑
      gstsServerProcessReturn(1n)
      break
    case 2n:
      gstsServerProcessReturn(1n)
      break
    case 3n:
      //生成战斗场景
      //下方后期替换成场景布设组
      const GenID = gsts.f.getCustomVariable(configEntity, 'CurrentSceneGenID').asType('int')
      const SceneGenList = gsts.f
        .getCustomVariable(configEntity, 'SceneGenList')
        .asType('prefab_id_list')
      const SceneGenPrefab = SceneGenList[GenID as any]
      gsts.f.createPrefab(
        SceneGenPrefab,
        gsts.f.create3dVector(0, 0, 0),
        gsts.f.create3dVector(0, 0, 0),
        gsts.f.getSelfEntity(),
        false,
        1n,
        gsts.f.emptyList('int')
      )
      //传送所有玩家角色
      //启动角色重力
      //开始战斗
      gstsServerAddProcess(2n, 0n, 0n, 0n, 0n, 0n)
      gstsServerProcessReturn(1n)
      break
    default:
      gstsServerProcessReturn(2n)
      break
  }
}

function gstsServerTurn(step: bigint, Player: bigint) {
  switch (step) {
    case 1n:
      //开始回合
      gstsServerProcessReturn(1n)
      break
    default:
      gstsServerProcessReturn(2n)
      break
  }
}
