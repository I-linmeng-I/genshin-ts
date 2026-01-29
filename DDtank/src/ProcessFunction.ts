/* eslint-disable no-case-declarations */
import { g } from 'genshin-ts/runtime/core'
import { int } from 'genshin-ts/runtime/value'

import { constants } from './Constant'

export function gstsServerGetProcessInfo(type: string) {
  const self = gsts.f.queryEntityByGuid(constants.GameProcessEntity)
  const processStack = gsts.f.getCustomVariable(self, 'ProcessStack').asType('int_list')
  const currentProcessIndex = gsts.f.getListLength(processStack) - 1n
  let returnValue = 0n
  switch (type) {
    case 'arg1':
      const processArg1 = gsts.f.getCustomVariable(self, 'ProcessArg1').asType('int_list')
      returnValue = processArg1[currentProcessIndex as unknown as number]
      break
    case 'arg2':
      const processArg2 = gsts.f.getCustomVariable(self, 'ProcessArg2').asType('int_list')
      returnValue = processArg2[currentProcessIndex as unknown as number]
      break
    case 'arg3':
      const processArg3 = gsts.f.getCustomVariable(self, 'ProcessArg3').asType('int_list')
      returnValue = processArg3[currentProcessIndex as unknown as number]
      break
    case 'arg4':
      const processArg4 = gsts.f.getCustomVariable(self, 'ProcessArg4').asType('int_list')
      returnValue = processArg4[currentProcessIndex as unknown as number]
      break
    case 'step':
      const processstep = gsts.f.getCustomVariable(self, 'ProcessStep').asType('int_list')
      returnValue = processstep[currentProcessIndex as unknown as number]
      break
    case 'type':
      returnValue = processStack[currentProcessIndex as unknown as number]
      break
    case 'index':
      returnValue = currentProcessIndex
  }
  return returnValue
}

export function gstsServerAddProcess(
  type: bigint,
  arg1: bigint,
  arg2: bigint,
  arg3: bigint,
  arg4: bigint,
  step: bigint
) {
  const self = gsts.f.queryEntityByGuid(constants.GameProcessEntity)

  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessStack').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessStack').asType('int_list')),
    type
  )
  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessArg1').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessArg1').asType('int_list')),
    arg1
  )
  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessArg2').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessArg2').asType('int_list')),
    arg2
  )
  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessArg3').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessArg3').asType('int_list')),
    arg3
  )
  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessArg4').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessArg4').asType('int_list')),
    arg4
  )
  gsts.f.insertValueIntoList(
    gsts.f.getCustomVariable(self, 'ProcessStep').asType('int_list'),
    gsts.f.getListLength(gsts.f.getCustomVariable(self, 'ProcessStep').asType('int_list')),
    step
  )
}

export function gstsServerProcessReturn(type: bigint) {
  const self = gsts.f.queryEntityByGuid(constants.GameProcessEntity)
  gsts.f.setCustomVariable<'int'>(self, 'Process', type, true)
}
