
const LANGS={

  firstlanguage:{
    name:'aⁿbⁿ',
    isReg:false,
    type:'Context-Free (NOT Regular)',
    check:s=>{
      if(s==='') return true;
      const m=s.match(/^(a+)(b+)$/);
      return m&&m[1].length===m[2].length;
    },
    suggest:p=>'a'.repeat(p)+'b'.repeat(p),
    definition:'L₁ = { aⁿbⁿ | n ≥ 0 } — Equal number of a\'s followed by equal number of b\'s'
  },
  
 
 twolanguage:{
    name:'0ⁿ1ⁿ',
    isReg:false,
    type:'Context-Free (NOT Regular)',
    check:s=>{
      if(s==='') return true;
      const m=s.match(/^(0+)(1+)$/);
      return m&&m[1].length===m[2].length;
    },
    suggest:p=>'0'.repeat(p)+'1'.repeat(p),
    definition:'L₂ = { 0ⁿ1ⁿ | n ≥ 0 } — Equal number of 0\'s followed by equal number of 1\'s'
  },
  
  threelanguage:{
    name:'aⁿbⁿcⁿ',
    isReg:false,
    type:'NOT Context-Free',
    check:s=>{
      if(s==='') return true;
      const m=s.match(/^(a+)(b+)(c+)$/);
      return m&&m[1].length===m[2].length&&m[2].length===m[3].length;
    },
    suggest:p=>'a'.repeat(p)+'b'.repeat(p)+'c'.repeat(p),
    definition:'L₃ = { aⁿbⁿcⁿ | n ≥ 0 } — Equal number of a\'s, b\'s, and c\'s (in order)'
  },
  
  fourlanguage:{
    name:'a*',
    isReg:true,
    type:'Regular',
    check:s=>/^a*$/.test(s),
    suggest:p=>'a'.repeat(p),
    definition:'L₆ = { a* } — All strings containing only "a" (including empty string)'
  },
  
  fivelanguage:{
    name:'(a|b)*',
    isReg:true,
    type:'Regular',
    check:s=>/^[ab]*$/.test(s),
    suggest:p=>'ab'.repeat(Math.ceil(p/2)).slice(0,p),
    definition:'L₇ = { (a|b)* } — Any combination of a and b'
  }
};

const EXPLAINS={
  firstlanguage:'❌ NOT REGULAR (Context-Free)\n\nL₁ = { aⁿbⁿ | n ≥ 0 }\nExamples: ε, ab, aabb, aaabbb\n\nDefinition: Equal number of a\'s and b\'s (in order)\nNote: n ≥ 0 means empty string ε is valid\n\nPumping Lemma: VIOLATED\n• Requires counting (DFA can\'t count unboundedly)\n• |xy| ≤ p means y is in a-block\n• Pumping y adds a\'s without adding b\'s\n• Breaks equal count!\n\nProof: s="aaabbb", p=3\n• Decompose: x="aa", y="a", z="bbb"\n• Pump i=2: xy²z="aaaabbb" (4a, 3b) ✗\n• NOT in L → Contradiction! → NOT REGULAR ∎',
  
  twolanguage:'❌ NOT REGULAR (Context-Free)\n\nL₂ = { 0ⁿ1ⁿ | n ≥ 0 }\nExamples: ε, 01, 0011, 000111\n\nDefinition: Equal number of 0\'s and 1\'s (in order)\nNote: n ≥ 0 means empty string ε is valid\n\nPumping Lemma: VIOLATED\n• Same reasoning as aⁿbⁿ\n• DFA cannot count unboundedly\n• Pumping breaks equal count\n\nProof: s="000111", p=3\n• Decompose: x="00", y="0", z="111"\n• Pump i=0: xy⁰z="00111" (2 zeros, 3 ones) ✗\n• NOT in L → NOT REGULAR ∎',
  
  threelanguage:'❌ NOT CONTEXT-FREE\n\nL₃ = { aⁿbⁿcⁿ | n ≥ 0 }\nExamples: ε, abc, aabbcc, aaabbbccc\n\nDefinition: Equal a\'s, b\'s, and c\'s (in order)\nNote: n ≥ 0 means empty string ε is valid\n\nCFL Pumping Lemma: VIOLATED\n• Requires THREE synchronized counters\n• PDA (pushdown automaton) has only ONE stack\n• Cannot maintain triple equality\n\nProof: s="aaabbbccc", p=3\n• By CFL Pumping: s=uvwxy where |vwx|≤p\n• vwx spans at most 2 blocks (e.g., b\'s and c\'s)\n• Pumping changes only 2 blocks, third stays same\n• Triple equality broken! ✗\n• NOT Context-Free ∎',
  
  fourlanguage:'✅ REGULAR LANGUAGE\n\nL₆ = { a* }\nExamples: ε, a, aa, aaa, aaaa, ...\n\nDefinition: All strings containing ONLY "a"\nNote: Can include empty string ε\n\nPumping Lemma: SATISFIED\n• Can be recognized by 1-state DFA\n• Pumping y (more a\'s) stays in a*\n• For any decomposition xyz, pumping y gives more a\'s → still in L\n\nProof: s="aaaaa", p=3\n• Decompose: x="aa", y="a", z="aa"\n• Pump i=0,1,2,3,4: All give strings of only a\'s ✓\n• All pumped strings in L → REGULAR ∎',
  
  fivelanguage:'✅ REGULAR LANGUAGE\n\nL₇ = { (a|b)* }\nExamples: ε, a, b, ab, ba, aa, bb, aba, ...\n\nDefinition: Any combination of a and b\nNote: Can include empty string ε\n\nPumping Lemma: SATISFIED\n• Recognized by 1-state DFA\n• Any string over {a,b} is valid\n• Pumping any substring stays in L\n\nProof: s="ababab", p=3\n• Decompose: x="ab", y="a", z="bab"\n• Pump i=0,1,2,3,4: All give strings of only a\'s and b\'s ✓\n• All pumped strings in L → REGULAR ∎'
};

let pState={x:'',y:'',z:'',curI:2,failI:-1,lang:''};
let explanationSteps = [];
let currentStepIndex = 0;

document.getElementById('pLang').addEventListener('change',function(){
  const k=this.value;
  const p=parseInt(document.getElementById('pP').value)||3;
  if(LANGS[k]) document.getElementById('pStr').value=LANGS[k].suggest(p);
});

function decompose(s,p){
  const xLen=Math.max(0,Math.min(p-1,s.length-1));
  const yLen=Math.min(Math.max(1,Math.ceil(p/3)),s.length-xLen,p-xLen);
  const zLen=Math.max(0,s.length-xLen-yLen);
  return{xLen,yLen,zLen};
}

function pumped(x,y,z,i){return x+y.repeat(i)+z;}

function generateSteps(x, y, z, k, p) {
  const steps = [];
  const s = x + y + z;
  
  steps.push({
    title: ' Step 1: Assumption',
    description: `Assume ${LANGS[k].name} is regular.\nBy pumping lemma, ∃ pumping length p = ${p}.`,
    type: 'assumption'
  });
  
  steps.push({
    title: ' Step 2: Choose String',
    description: `Choose s = "${s}"\n|s| = ${s.length} ≥ p = ${p} ✓\nString is in ${LANGS[k].name} ✓`,
    type: 'string',
    array: [{label: 's', value: s, color: 'text'}]
  });
  
  steps.push({
    title: ' Step 3: Decomposition',
    description: `Decompose s = xyz where:\n• |xy| ≤ ${p}\n• |y| ≥ 1\n\nx = "${x || 'ε'}"\ny = "${y}"\nz = "${z || 'ε'}"`,
    type: 'decompose',
    array: [
      {label: 'x', value: x, color: 'cyan'},
      {label: 'y', value: y, color: 'violet'},
      {label: 'z', value: z, color: 'emerald'}
    ]
  });
  
  steps.push({
    title: ' Step 4: Verify Conditions',
    description: `|x| = ${x.length}\n|y| = ${y.length}\n|z| = ${z.length}\n\n|xy| = ${x.length + y.length} ≤ ${p} ✓\n|y| = ${y.length} ≥ 1 ✓`,
    type: 'verify'
  });
  
  for (let i = 0; i <= 4; i++) {
    const pumpedStr = pumped(x, y, z, i);
    const inLang = LANGS[k].check(pumpedStr);
    
    steps.push({
      title: ` Step ${5 + i}: Pump i = ${i}`,
      description: `xy^${i}z = "${pumpedStr}"\nLength = ${pumpedStr.length}\n\nIn ${LANGS[k].name}? ${inLang ? '✅ YES' : '❌ NO'}`,
      type: inLang ? 'success' : 'fail',
      array: [
        {label: 'x', value: x, color: 'cyan'},
        {label: `y^${i}`, value: y.repeat(i), color: 'violet'},
        {label: 'z', value: z, color: 'emerald'}
      ]
    });
    
    if (!inLang) {
      steps.push({
        title: '💡 Conclusion',
        description: `CONTRADICTION!\n\nWhen i = ${i}:\n"${pumpedStr}" ∉ ${LANGS[k].name}\n\n∴ ${LANGS[k].name} is NOT REGULAR ∎`,
        type: 'conclusion'
      });
      break;
    }
  }
  
  if (steps[steps.length - 1].type === 'success') {
    steps.push({
      title: '💡 Conclusion',
      description: `All pumped strings in ${LANGS[k].name}!\n\nPumping lemma satisfied.\n\n∴ ${LANGS[k].name} IS REGULAR ✓`,
      type: 'conclusion'
    });
  }
  
  return steps;
}

function displayStep(step) {
  const container = document.getElementById('stepDisplay');
  if (!container) return;
  
  let html = `<div class="step-box ${step.type}"><h4 style="margin:0 0 10px 0;font-size:15px;font-weight:600;">${step.title}</h4><p style="white-space:pre-line;font-size:13px;line-height:1.6;margin:0;">${step.description}</p>`;
  
  if (step.array) {
    html += '<div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap;">';
    step.array.forEach(item => {
      const chars = item.value ? item.value.split('') : [];
      html += `<div style="display:flex;flex-direction:column;gap:3px;"><div style="font-size:10px;font-weight:600;color:var(--${item.color});font-family:'Fira Code',monospace;">${item.label}</div><div style="display:flex;gap:2px;">`;
      if (chars.length === 0) {
        html += `<div style="padding:5px 8px;background:rgba(106,90,205,.1);border:1px solid var(--${item.color});border-radius:3px;font-family:'Fira Code',monospace;font-size:12px;color:var(--${item.color});">ε</div>`;
      } else {
        chars.forEach(ch => {
          html += `<div style="padding:5px 8px;background:rgba(106,90,205,.1);border:1px solid var(--${item.color});border-radius:3px;font-family:'Fira Code',monospace;font-size:12px;color:var(--${item.color});">${ch}</div>`;
        });
      }
      html += '</div></div>';
    });
    html += '</div>';
  }
  
  html += '</div>';
  container.innerHTML = html;
  
  document.getElementById('stepCounter').textContent = `Step ${currentStepIndex + 1} of ${explanationSteps.length}`;
  document.getElementById('prevStepBtn').disabled = currentStepIndex === 0;
  document.getElementById('nextStepBtn').disabled = currentStepIndex === explanationSteps.length - 1;
  
  if (window.gsap) {
    gsap.fromTo('#stepDisplay .step-box', {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: 0.25});
  }
}

function nextStep() {
  if (currentStepIndex < explanationSteps.length - 1) {
    currentStepIndex++;
    displayStep(explanationSteps[currentStepIndex]);
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    displayStep(explanationSteps[currentStepIndex]);
  }
}

function pRun(){
  const k=document.getElementById('pLang').value;
  const s=document.getElementById('pStr').value.trim();
  const p=parseInt(document.getElementById('pP').value);
  const err=document.getElementById('pErr');

  const showErr=m=>{err.textContent=m;err.classList.add('show');};
  err.classList.remove('show');

  if(!s){showErr('Enter a string.');return;}
  if(!p||p<1){showErr('p must be ≥ 1.');return;}
  if(!LANGS[k].check(s)){showErr(`"${s}" is not in ${LANGS[k].name}.`);return;}
  if(s.length<p){showErr(`|s|=${s.length} must be ≥ p=${p}.`);return;}

  const {xLen,yLen}=decompose(s,p);
  const x=s.slice(0,xLen),y=s.slice(xLen,xLen+yLen),z=s.slice(xLen+yLen);
  pState={x,y,z,curI:2,failI:-1,lang:k};
  
  explanationSteps = generateSteps(x, y, z, k, p);
  currentStepIndex = 0;
  displayStep(explanationSteps[0]);

  for(let i=0;i<=4;i++){
    if(!LANGS[k].check(pumped(x,y,z,i))){pState.failI=i;break;}
  }

  renderPump();
}

function renderPump(){
  document.getElementById('pMain').style.display='block';
  const {x,y,z,lang}=pState;
  const L=LANGS[lang];

  const b=document.getElementById('pBanner');
  b.className='banner show '+(L.isReg?'banner-green':'banner-red');
  b.innerHTML=L.isReg
    ?`✅ <strong>${L.name}</strong> is ${L.type} — Pumping lemma satisfied`
    :`❌ <strong>${L.name}</strong> is ${L.type} — Pumping lemma violated`;
  
  const info=document.getElementById('pLangInfo');
  info.innerHTML=`
    <div style="margin-bottom:10px;"><strong style="color:var(--cyan);font-size:16px;">${L.name}</strong></div>
    <div style="margin-bottom:8px;"><strong>Type:</strong> <span style="color:${L.isReg?'var(--emerald)':'var(--rose)'}">${L.type}</span></div>
    <div style="margin-bottom:8px;"><strong>Definition:</strong> ${L.definition}</div>
  `;

  const bl=document.getElementById('pBlocks');
  bl.innerHTML='';
  const add=(str,cls)=>{
    if(!str){const e=document.createElement('div');e.className='ch ch-eps';e.textContent='ε';bl.appendChild(e);return;}
    for(const ch of str){const e=document.createElement('div');e.className='ch '+cls;e.textContent=ch;bl.appendChild(e);}
  };
  add(x,'ch-x');add(y,'ch-y');add(z,'ch-z');

  const p=parseInt(document.getElementById('pP').value);
  document.getElementById('pChips').innerHTML=
    `<div style="background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-family:'Fira Code',monospace;font-size:12px;color:var(--text);opacity:0.9;">|xy| = ${x.length+y.length} ≤ ${p}</div>
     <div style="background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-family:'Fira Code',monospace;font-size:12px;color:var(--text);opacity:0.9;">|y| = ${y.length} ≥ 1</div>`;

  const ib=document.getElementById('iBtns');
  ib.innerHTML='';
  for(let i=0;i<=4;i++){
    const ps=pumped(x,y,z,i);
    const ok=LANGS[lang].check(ps);
    const btn=document.createElement('button');
    btn.className='ib '+(i===pState.curI?'active':'')+(ok?' ok':' bad');
    btn.textContent=i;
    const ii=i;btn.onclick=()=>pSelectI(ii);
    ib.appendChild(btn);
  }

  document.getElementById('pExplain').innerHTML=EXPLAINS[lang]||'';

  pRenderPumped(pState.curI);
  
  gsap.fromTo('#pMain',{opacity:0,y:16},{opacity:1,y:0,duration:.45,ease:'power2.out'});
  gsap.fromTo('#pBlocks .ch',{opacity:0,scale:.5,y:6},{opacity:1,scale:1,y:0,duration:.3,stagger:.04,ease:'back.out(1.8)'});
}

function pSelectI(i){
  pState.curI=i;
  document.querySelectorAll('.ib').forEach((b,idx)=>{
    b.classList.toggle('active',idx===i);
  });
  pRenderPumped(i);
}

function pRenderPumped(i){
  const{x,y,z,lang}=pState;
  const ps=pumped(x,y,z,i);
  const disp=document.getElementById('pPumpDisp');
  disp.innerHTML='';

  const addCh=(str,cls)=>{
    for(const ch of str){const e=document.createElement('div');e.className='ch '+cls;e.textContent=ch;disp.appendChild(e);}
  };
  if(!ps){const e=document.createElement('div');e.className='ch ch-eps';e.textContent='ε';disp.appendChild(e);}
  else{
    addCh(x,'ch-x');
    for(let k=0;k<i;k++) addCh(y,'ch-y');
    addCh(z,'ch-z');
  }

  const ok=LANGS[lang].check(ps);
  const st=document.getElementById('pStatus');
  if(ok){
    st.innerHTML=`<span class="status-pill pill-green">✓ xy<sup>${i}</sup>z = "${ps||'ε'}" ∈ L</span>`;
  } else {
    st.innerHTML=`<span class="status-pill pill-red">✗ xy<sup>${i}</sup>z = "${ps||'ε'}" ∉ L — CONTRADICTION!</span>`;
    disp.classList.remove('shake');
    void disp.offsetWidth;
    disp.classList.add('shake');
  }
  
  gsap.fromTo(disp.children,{opacity:0,scale:.65},{opacity:1,scale:1,duration:.22,stagger:.03,ease:'back.out(1.6)'});
}
