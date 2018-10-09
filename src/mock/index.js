import Mock from 'mockjs'
import demand from './demand'
import management from './management.js'

// Mock.setup({
//   timeout: '350-600'
// })

// 需求相关

// 待审核需求
//Mock.mock(/\/hts\/management\/showList/, 'post', demand.showList)
// 我管理的需求
//Mock.mock(/\/hts\/management\/myDemends/, 'post', demand.myDemends)
// 待审核干部列表
// Mock.mock(/\/hts\/management\/isCheck/, 'post', management.managementCheckList)
// 扶贫干部查询列表
// Mock.mock(/\/hts\/management\/group/, 'post', management.managementList)
export default Mock
