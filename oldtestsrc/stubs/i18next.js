
import test from 'zopf'

const i18next = {
  '@global': true,
  '@noCallThru': true,
  use: () => i18next,
  init: () => i18next,
  on: () => null,
  off: () => null,
  t: (x) => x,
  addResources: () => null,
  getFixedT: () => i18next.t
}

module.exports = test.module(i18next)
