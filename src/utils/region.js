
export function getRegionListById(_this, id = 100) {
  _this.$http.post('eai/authRegion/selectDate', { 'parentId': id }).then(res => {
    if (res.code === 'EAII0000') {
      return res.data
    } else {
      return ''
    }
  })
}
