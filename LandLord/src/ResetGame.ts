import { g } from 'genshin-ts/runtime/core'

import { constants } from './constant'
import { RemovalMethod, UIControlGroupStatus } from 'genshin-ts/definitions/enum'
import { PlayerEntity } from 'genshin-ts/definitions/nodes';
import { EntityValue } from 'genshin-ts/runtime/value';

g.server({
  id: 1073741878 //ResetGame
}).on('whenCustomVariableChanges', (_evt, f) => {
  if (_evt.variableName == 'ResetGame') {
    const self = f.getSelfEntity();
    let LandLord = f.getCustomVariable(self,'LandLord').asType('int');

    let winning = 5;
    if(f.getCustomVariable(self,'CurPlayer').asType('int')==LandLord){
      winning = 4;
    }


    //重置UI
    f.setCustomVariable<'str'>(self, '当前玩家', '无');
    f.setCustomVariable<'str'>(self, '质疑玩家', '');
    f.setCustomVariable<'str'>(self, '操作1', '');
    f.setCustomVariable<'str'>(self, '操作文本', '');
    f.setCustomVariable<'str'>(self, '操作2', '');

    //重置Process堆栈
    f.setCustomVariable<'int_list'>(self, 'UnoProcess', f.emptyList('int'));
    f.setCustomVariable<'int_list'>(self, 'ProcessStep', f.emptyList('int'));
    f.setCustomVariable<'int_list'>(self, 'ProcessArg1', f.emptyList('int'));
    f.setCustomVariable<'int_list'>(self, 'ProcessArg2', f.emptyList('int'));
    f.setCustomVariable<'int_list'>(self, 'ProcessArg3', f.emptyList('int'));
    f.setCustomVariable<'int_list'>(self, 'ProcessArg4', f.emptyList('int'));
    f.setCustomVariable<'int'>(self, 'ProcessorReturn', 0n);

    //重置游戏数据
    f.setCustomVariable<'int'>(self, 'PlayerReadyNum', 0n);
    f.setCustomVariable<'int'>(self, 'CurType', -1n);
    f.setCustomVariable<'int_list'>(self, 'Grave', f.emptyList('int'));
    f.setCustomVariable<'int'>(self, 'CurNum', -1n);
    f.setCustomVariable<'int'>(self, 'CurLength', -1n);
    f.setCustomVariable<'int_list'>(self, 'CurCard', f.emptyList('int'));
    f.setCustomVariable<'int'>(self, 'CurPlayer', 0n);
    f.setCustomVariable<'int'>(self, 'Lastlayer', 0n);
    f.setCustomVariable<'bool'>(self, 'HaveCardForUse', false);
    f.setCustomVariable<'int'>(self, 'LandLord',-1n);
    f.setCustomVariable<'int'>(self,'MultiPower',0n);
    f.removeEntity(f.getCustomVariable(self,'Hat').asType('entity'));

    //重置角色数据
    const playerList = f.getCustomVariable(self, 'PlayerControllers').asType('entity_list');
    playerList.forEach((player) => {
      f.setCustomVariable<'int_list'>(player, 'CardList', f.emptyList('int'));
      f.setCustomVariable<'bool'>(player, 'Winning', false);
      f.setCustomVariable<'bool'>(player, 'Ready', false);
      f.setCustomVariable<'int_list'>(player, 'SCNum', f.emptyList('int'));
      f.setCustomVariable<'config_id_list'>(player, 'SCNum', f.emptyList('config_id'));
      f.setCustomVariable<'int_list'>(player, 'HintCardList', f.emptyList('int'));
      f.removeUnitStatus(player,constants.TurnEffect,RemovalMethod.AllCoexistingStatusesWithTheSameName,player);
    })

    //重置卡组
    f.setCustomVariable<'int'>(f.getCustomVariable(self,'InitDeckFunc').asType('entity'), 'ResetDeck', 0n,true);

    //重新开始对局
    f.insertValueIntoList(f.getCustomVariable(self, 'UnoProcess').asType('int_list'), 0, 7);
    f.insertValueIntoList(f.getCustomVariable(self, 'ProcessArg1').asType('int_list'), 0, 0);
    f.insertValueIntoList(f.getCustomVariable(self, 'ProcessArg2').asType('int_list'), 0, 0);
    f.insertValueIntoList(f.getCustomVariable(self, 'ProcessArg3').asType('int_list'), 0, 0);
    f.insertValueIntoList(f.getCustomVariable(self, 'ProcessArg4').asType('int_list'), 0, 0);
    f.insertValueIntoList(f.getCustomVariable(self, 'ProcessStep').asType('int_list'), 0, 0);
    f.setCustomVariable<'int'>(self, 'ProcessorReturn', 1n,true);

    //显示UI和结算

    playerList.forEach((playerCon) => {
      const player = f.getCustomVariable(playerCon,'CurPlayer').asType('entity');
      f.modifyUiControlStatusWithinTheInterfaceLayout(player as PlayerEntity,1073742321,UIControlGroupStatus.Off);
      f.switchCurrentInterfaceLayout(player as PlayerEntity,1073742222);

      const playerID = f.searchListAndReturnValueId(
        f.getCustomVariable(self,'PlayerControllers').asType('entity_list'),playerCon)[0];

      if(winning==4){
        if(playerID==LandLord){
          f.modifyUiControlStatusWithinTheInterfaceLayout(player as PlayerEntity,1073742279,UIControlGroupStatus.Off);
          f.modifyUiControlStatusWithinTheInterfaceLayout(player as PlayerEntity,1073742286,UIControlGroupStatus.On);
        }
      }else{
        if(playerID!=LandLord){
          f.modifyUiControlStatusWithinTheInterfaceLayout(player as PlayerEntity,1073742279,UIControlGroupStatus.Off);
          f.modifyUiControlStatusWithinTheInterfaceLayout(player as PlayerEntity,1073742286,UIControlGroupStatus.On);
        }
      }
    });
  }
})
