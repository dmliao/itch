
import test from 'zopf'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

import electron from '../stubs/electron'
import i18next from '../stubs/i18next'

test('crash-reporter', t => {
  const sf = test.module({
    write_file: () => null
  })

  const os = test.module({
    platform: () => 'linux'
  })

  const stubs = Object.assign({
    '../util/sf': sf,
    './os': os,
    i18next
  }, electron)
  const crash_reporter = proxyquire('../../app/util/crash-reporter', stubs).default

  const e = {stack: 'No sweat'}

  t.case('write_crash_log', t => {
    const mock = t.mock(sf)
    mock.expects('write_file').once().withArgs(sinon.match.string, 'Hey\nthere').returns(sf)
    crash_reporter.write_crash_log({stack: 'Hey\nthere'})
  })

  t.case('write_crash_log (win32)', t => {
    t.stub(os, 'platform').returns('win32')
    const mock = t.mock(sf)
    mock.expects('write_file').once().withArgs(sinon.match.string, 'Hey\r\nthere').returns(sf)
    crash_reporter.write_crash_log({stack: 'Hey\nthere'})
  })

  t.case('report_issue', t => {
    const mock = t.mock(electron.electron.shell)
    mock.expects('openExternal').once()
    crash_reporter.report_issue({log: e})
  })

  let stub_write = (t) => {
    t.stub(crash_reporter, 'write_crash_log').returns({log: e.stack, crash_file: 'tmp/crash_log.txt'})
  }

  t.case('handle → close', t => {
    stub_write(t)
    t.stub(electron.electron.dialog, 'showMessageBox').returns(-1)
    crash_reporter.handle(e)
  })

  t.case('handle → report_issue', t => {
    stub_write(t)
    t.stub(electron.electron.dialog, 'showMessageBox').callsArgWith(1, 0)
    t.mock(crash_reporter).expects('report_issue').once()
    crash_reporter.handle(e)
  })

  t.case('handle → open_item', t => {
    stub_write(t)
    t.stub(electron.electron.dialog, 'showMessageBox').callsArgWith(1, 1)
    t.mock(electron.electron.shell).expects('openItem').once()
    crash_reporter.handle(e)
  })

  t.case('mount', t => {
    const exit = t.stub(process, 'exit')
    t.stub(process, 'on').callsArgWith(1, e)
    t.mock(crash_reporter).expects('handle').once().throws('Test error, please ignore')
    crash_reporter.mount()
    sinon.assert.calledWith(exit, 1)
  })
})
