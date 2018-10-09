export function card(val) {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(val)
}
export function validdateMobile(val) {
  const length = val.length
  let mobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  return length === 11 && mobile.test(val)
}

export function validpass(val) {
  let pass = /^[a-zA-Z0-9]{8,20}$/
  return pass.test(val)
}


