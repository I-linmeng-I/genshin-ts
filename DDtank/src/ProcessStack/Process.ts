import { g } from 'genshin-ts/runtime/core'
import { int } from 'genshin-ts/runtime/value'

import { gstsServerGetProcessInfo } from '../ProcessFunction'

//初始化堆栈自定义变量
g.server({
  id: 1073741825 //Porcess
}).on('whenEntityIsCreated', (_evt, f) => {
  const self = gsts.f.getSelfEntity()

  f.setCustomVariable<'int_list'>(self, 'ProcessStack', f.emptyList('int'))
  f.setCustomVariable<'int_list'>(self, 'ProcessStep', f.emptyList('int'))
  f.setCustomVariable<'int_list'>(self, 'ProcessArg1', f.emptyList('int'))
  f.setCustomVariable<'int_list'>(self, 'ProcessArg2', f.emptyList('int'))
  f.setCustomVariable<'int_list'>(self, 'ProcessArg3', f.emptyList('int'))
  f.setCustomVariable<'int_list'>(self, 'ProcessArg4', f.emptyList('int'))
})

//处理堆栈并执行最后的指令
g.server({
  id: 1073741825 //Porcess
}).on('whenCustomVariableChanges', (_evt, f) => {
  if (_evt.variableName == 'Process') {
    const self = f.getSelfEntity()
    const index = gstsServerGetProcessInfo('index')
    if (index >= 0n) {
      switch (_evt.postChangeValue.asType('int')) {
        case 1n:
          const steps = f.getCustomVariable(self, 'ProcessStep').asType('int_list')
          const nextstep = steps[index as any] + 1n;
          f.modifyValueInList(f.getCustomVariable(self, 'ProcessStep').asType('int_list'), index, nextstep);
          f.setCustomVariable<'str'>(self, 'StartProcess', '0n', true)
          break
        case 2n:
          const processArg1 = f.getCustomVariable(self, 'ProcessArg1').asType('int_list')
          const processArg2 = f.getCustomVariable(self, 'ProcessArg2').asType('int_list')
          const processArg3 = f.getCustomVariable(self, 'ProcessArg3').asType('int_list')
          const processArg4 = f.getCustomVariable(self, 'ProcessArg4').asType('int_list')
          const step = f.getCustomVariable(self, 'ProcessStep').asType('int_list')
          const processStack = f.getCustomVariable(self, 'ProcessStack').asType('int_list')

          f.removeValueFromList(processArg1, index)
          f.removeValueFromList(processArg2, index)
          f.removeValueFromList(processArg3, index)
          f.removeValueFromList(processArg4, index)
          f.removeValueFromList(step, index)
          f.removeValueFromList(processStack, index)
          break
      }
    }
  }
})
