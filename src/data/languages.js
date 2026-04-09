export const LANGS = {
  firstlanguage: {
    name: 'a^n b^n',
    isReg: false,
    type: 'Context-Free (Not Regular)',
    check: (s) => {
      if (s === '') return true
      const m = s.match(/^(a+)(b+)$/)
      return Boolean(m && m[1].length === m[2].length)
    },
    suggest: (p) => 'a'.repeat(p) + 'b'.repeat(p),
    definition: 'L1 = { a^n b^n | n >= 0 }'
  },
  twolanguage: {
    name: '0^n 1^n',
    isReg: false,
    type: 'Context-Free (Not Regular)',
    check: (s) => {
      if (s === '') return true
      const m = s.match(/^(0+)(1+)$/)
      return Boolean(m && m[1].length === m[2].length)
    },
    suggest: (p) => '0'.repeat(p) + '1'.repeat(p),
    definition: 'L2 = { 0^n 1^n | n >= 0 }'
  },
  threelanguage: {
    name: 'a^n b^n c^n',
    isReg: false,
    type: 'Not Context-Free',
    check: (s) => {
      if (s === '') return true
      const m = s.match(/^(a+)(b+)(c+)$/)
      return Boolean(m && m[1].length === m[2].length && m[2].length === m[3].length)
    },
    suggest: (p) => 'a'.repeat(p) + 'b'.repeat(p) + 'c'.repeat(p),
    definition: 'L3 = { a^n b^n c^n | n >= 0 }'
  },
  fourlanguage: {
    name: 'a*',
    isReg: true,
    type: 'Regular',
    check: (s) => /^a*$/.test(s),
    suggest: (p) => 'a'.repeat(p),
    definition: 'L4 = { a* }'
  },
  fivelanguage: {
    name: '(a|b)*',
    isReg: true,
    type: 'Regular',
    check: (s) => /^[ab]*$/.test(s),
    suggest: (p) => 'ab'.repeat(Math.ceil(p / 2)).slice(0, p),
    definition: 'L5 = { (a|b)* }'
  },
  sixlanguage: {
    name: 'a* b*',
    isReg: true,
    type: 'Regular',
    check: (s) => /^a*b*$/.test(s),
    suggest: (p) => 'a'.repeat(p) + 'b'.repeat(Math.max(1, Math.floor(p / 2))),
    definition: 'L6 = { a^i b^j | i, j >= 0 }'
  },
  sevenlanguage: {
    name: 'a^n b^{2n}',
    isReg: false,
    type: 'Context-Free (Not Regular)',
    check: (s) => {
      if (s === '') return true
      const m = s.match(/^(a+)(b+)$/)
      return Boolean(m && m[2].length === 2 * m[1].length)
    },
    suggest: (p) => 'a'.repeat(p) + 'b'.repeat(2 * p),
    definition: 'L7 = { a^n b^{2n} | n >= 0 }'
  }
}

export const LANGUAGE_KEYS = Object.keys(LANGS)

export const EXPLAINS = {
  firstlanguage:
    'L1 = { a^n b^n | n >= 0 }. The machine must remember how many a symbols appeared to match b symbols later, which is why this is not regular.',
  twolanguage:
    'L2 = { 0^n 1^n | n >= 0 }. Same core issue as a^n b^n: finite automata cannot do unbounded counting.',
  threelanguage:
    'L3 = { a^n b^n c^n | n >= 0 }. This needs synchronized counts across three blocks; a single stack model cannot enforce this.',
  fourlanguage:
    'L4 = { a* }. Any number of a symbols (including empty) is accepted, so pumping remains inside the language.',
  fivelanguage:
    'L5 = { (a|b)* }. Any string over alphabet {a,b} is valid, so pumping never leaves the language.',
  sixlanguage:
    'L6 = { a^i b^j | i, j >= 0 }. This is regular because one finite-state machine can scan a symbols first and then b symbols without counting.',
  sevenlanguage:
    'L7 = { a^n b^{2n} | n >= 0 }. The language still needs unbounded matching between the number of a symbols and b symbols, so it is not regular.'
}
