import { AgyCliBridge } from '../../lib/mcp/core/agy-bridge'

async function runAgyBridgeTest() {
  console.log('====================================================')
  console.log('🧪 Testing Antigravity CLI Bridge (agy.exe -p)')
  console.log('====================================================')

  const binary = AgyCliBridge.getBinaryPath()
  console.log('ℹ️ Detected agy binary path:', binary)

  const testPrompt = `Balas secara singkat dalam 1 baris format JSON: {"status": "ACTIVE", "engine": "Antigravity CLI", "ready": true}`

  console.log('ℹ️ Executing test prompt via AgyCliBridge...')
  const result = await AgyCliBridge.executePrompt(testPrompt, 45000)

  console.log('Execution duration:', result.durationMs, 'ms')
  console.log('Success:', result.success)
  console.log('Output:\n', result.output)
  if (result.error) {
    console.error('Error:\n', result.error)
  }

  if (result.success) {
    console.log('✅ Antigravity CLI Bridge Test PASSED!')
  } else {
    console.error('❌ Antigravity CLI Bridge Test FAILED!')
    process.exit(1)
  }
}

runAgyBridgeTest()
