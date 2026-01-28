import { g } from 'genshin-ts/runtime/core'
import { entity, int } from 'genshin-ts/runtime/value'

import { constants } from './Constant'

export function gstsServerSetPlayerController(bind: boolean, Controller: entity) {
  gsts.f.activateDisableNativeCollision(Controller, bind);
  if(bind){
    gsts.f.modifyingCharacterDisruptorDevice(Controller,1);
  }else{
    gsts.f.modifyingCharacterDisruptorDevice(Controller,0);
  }
}

