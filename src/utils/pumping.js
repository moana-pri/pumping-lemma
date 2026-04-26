import { LANGS } from '../data/languages'

export function decompose(s, p) {
  const xLen = Math.max(0, Math.min(p - 1, s.length - 1))
  const yLen = Math.min(1, s.length - xLen, p - xLen)
  return { xLen, yLen }
}

export function pumped(x, y, z, i) {
  return x + y.repeat(i) + z
}

export function buildSteps({ x, y, z, langKey, p }) {
  const lang = LANGS[langKey]
  const s = x + y + z
  const steps = []

  steps.push({
    title: 'Step 1: Assume Regular',
    description: `Assume ${lang.name} is regular.\nThen there exists a pumping length p = ${p}.`,
    type: 'assumption'
  })

  steps.push({
    title: 'Step 2: Pick a Valid String',
    description: `Choose s = "${s || 'epsilon'}" with |s| = ${s.length} and |s| >= p.\nThis s is in ${lang.name}.`,
    type: 'string'
  })

  steps.push({
    title: 'Step 3: Define x, y, z',
    description: [
      `x = "${x || 'epsilon'}"`,
      `y = "${y || 'epsilon'}"`,
      `z = "${z || 'epsilon'}"`,
      '',
      'Why this choice?',
      `1) |xy| <= ${p}, so x and y stay in the first p symbols.`,
      '2) |y| >= 1, so y cannot be empty.',
      '3) z is the remaining suffix.'
    ].join('\n'),
    type: 'decompose'
  })

  steps.push({
    title: 'Step 4: Verify Conditions',
    description: `|x| = ${x.length}, |y| = ${y.length}, |z| = ${z.length}\n|xy| = ${x.length + y.length} <= ${p} and |y| >= 1`,
    type: 'verify'
  })

  for (let i = 0; i <= 4; i += 1) {
    const word = pumped(x, y, z, i)
    const inLang = lang.check(word)

    steps.push({
      title: `Step ${5 + i}: Pump with i = ${i}`,
      description: `xy^${i}z = "${word || 'epsilon'}"\nIn language? ${inLang ? 'YES' : 'NO'}`,
      type: inLang ? 'success' : 'fail',
      i,
      word,
      inLang
    })

    if (!inLang) {
      steps.push({
        title: 'Final Step: Contradiction',
        description: `For i = ${i}, xy^${i}z is not in ${lang.name}.\nSo the language is not regular.`,
        type: 'conclusion'
      })
      return steps
    }
  }

  steps.push({
    title: 'Final Step: Pumping Works',
    description: [
      'All tested pumped strings stayed inside the language for this chosen split and tested i values.',
      'This does NOT prove the language is regular.',
      'It only means this run found no pumping-lemma contradiction.'
    ].join('\n'),
    type: 'conclusion'
  })

  return steps
}
