export function createDemoAudio(seed = 0) {
  const sampleRate = 22050
  const seconds = 24
  const sampleCount = sampleRate * seconds
  const bytesPerSample = 2
  const buffer = new ArrayBuffer(44 + sampleCount * bytesPerSample)
  const view = new DataView(buffer)
  const writeText = (offset, text) => [...text].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)))

  writeText(0, 'RIFF')
  view.setUint32(4, 36 + sampleCount * bytesPerSample, true)
  writeText(8, 'WAVE')
  writeText(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * bytesPerSample, true)
  view.setUint16(32, bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeText(36, 'data')
  view.setUint32(40, sampleCount * bytesPerSample, true)

  const beatLength = 60 / 96
  const roots = [110, 82.41, 98, 73.42]
  const melody = [440, 0, 523.25, 659.25, 0, 587.33, 523.25, 0, 392, 0, 440, 523.25, 0, 659.25, 587.33, 523.25]
  const samples = new Float32Array(sampleCount)
  let peak = 0

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate
    const beatPosition = time / beatLength
    const beat = Math.floor(beatPosition)
    const beatPhase = beatPosition - beat
    const root = roots[(Math.floor(beat / 4) + seed) % roots.length]
    const stepPosition = time / (beatLength / 2)
    const step = Math.floor(stepPosition)
    const stepPhase = stepPosition - step
    const note = melody[(step + seed * 3) % melody.length]
    const chordPulse = 0.62 + 0.38 * Math.sin((time / (beatLength * 4)) * Math.PI * 2)
    const pad = (Math.sin(time * root * Math.PI * 2) + 0.42 * Math.sin(time * root * 1.5 * Math.PI * 2)) * 0.085 * chordPulse
    const bass = Math.sin(time * root * Math.PI * 2) * Math.exp(-beatPhase * 5) * 0.22
    const lead = note ? Math.sin(time * note * Math.PI * 2) * Math.exp(-stepPhase * 5) * 0.14 : 0
    const kick = beat % 4 === 0 ? Math.sin((time * 110 - Math.floor(time * 110)) * Math.PI * 2) * Math.exp(-beatPhase * 11) * 0.2 : 0
    const tickPhase = stepPhase * 2 * Math.PI
    const tick = (Math.sin(tickPhase * 19 + seed) + Math.sin(tickPhase * 27)) * Math.exp(-stepPhase * 20) * 0.014
    const sample = pad + bass + lead + kick + tick
    samples[index] = sample
    peak = Math.max(peak, Math.abs(sample))
  }

  const scale = peak > 0 ? 0.82 / peak : 1
  for (let index = 0; index < sampleCount; index += 1) {
    const envelope = Math.min(1, index / (sampleRate * 0.08), (sampleCount - index) / (sampleRate * 0.25))
    view.setInt16(44 + index * bytesPerSample, Math.round(samples[index] * scale * envelope * 32767), true)
  }

  return new Blob([buffer], { type: 'audio/wav' })
}
