function VisualizerPage({
  langKey,
  p,
  input,
  error,
  selectedLang,
  languageKeys,
  langs,
  steps,
  stepIndex,
  isAutoPlaying,
  verdictRevealed,
  walkthroughDone,
  currentStep,
  pumpedPreview,
  x,
  y,
  z,
  customI,
  onLanguageChange,
  onPChange,
  onInputChange,
  onStart,
  onSuggest,
  onRandomDemo,
  onPrevStep,
  onNextStep,
  onToggleAuto,
  onReveal,
  onCustomIChange,
  onUseCustomI,
  onUseStepI,
  explainText
}) {
  return (
    <>
      <section className="controls card reveal-up">
        <h2>Build Your Example</h2>
        <div className="grid">
          <label>
            Language
            <select value={langKey} onChange={(e) => onLanguageChange(e.target.value)}>
              {languageKeys.map((key) => (
                <option key={key} value={key}>
                  {langs[key].name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Pumping Length p
            <input
              type="number"
              min="1"
              value={p}
              onChange={(e) => onPChange(e.target.value)}
            />
          </label>

          <label className="wide">
            Input String s
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter a valid string from selected language"
            />
          </label>
        </div>

        <div className="buttonRow">
          <button className="primary" onClick={onStart}>
            Start Guided Proof
          </button>
          <button className="ghost" onClick={onSuggest}>
            Suggest Valid String
          </button>
        </div>

        <div className="buttonRow showcaseRow" aria-label="Showcase presets">
          <button type="button" className="ghost" onClick={onRandomDemo}>
            Random Demo
          </button>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="metaHighlights">
          <span className="pill pill-lang">Language: {selectedLang.name}</span>
          <span className={selectedLang.isReg ? 'pill pill-regular' : 'pill pill-nonregular'}>
            {selectedLang.isReg ? 'Regular behavior expected' : 'Non-regular contradiction expected'}
          </span>
          <span className="pill pill-theory">Open "What is Pumping Lemma?" for formal definition</span>
        </div>
      </section>

      <section className="walkSplit reveal-up">
        <div className="mainBoard card">
          <div className="walkHead">
            <h2>Visualizer Animation</h2>
            <p>{steps.length ? `Animated view for step ${stepIndex + 1}` : 'Start Guided Proof to animate proof.'}</p>
          </div>

          <div className="caseLegend" aria-label="Color legend">
            <span className="legendBlue">Blue = x prefix</span>
            <span className="legendYellow">Yellow = y pump region</span>
            <span className="legendGreen">Purple = z suffix</span>
            <span className="legendRed">Red = contradiction</span>
          </div>

          <div className="blockArea" key={`decomp-${stepIndex}`}>
            <h3>Decomposition s = x y z</h3>
            <div className="charRow">
              {x
                ? x.split('').map((ch, idx) => (
                    <span className="token token-x" key={`x-${idx}`} style={{ '--i': idx }}>
                      {ch}
                    </span>
                  ))
                : <span className="token token-empty">epsilon</span>}

              {y
                ? y.split('').map((ch, idx) => (
                    <span className="token token-y" key={`y-${idx}`} style={{ '--i': x.length + idx }}>
                      {ch}
                    </span>
                  ))
                : <span className="token token-empty">epsilon</span>}

              {z
                ? z.split('').map((ch, idx) => (
                    <span className="token token-z" key={`z-${idx}`} style={{ '--i': x.length + y.length + idx }}>
                      {ch}
                    </span>
                  ))
                : <span className="token token-empty">epsilon</span>}
            </div>
          </div>

          {pumpedPreview ? (
            <div className={`blockArea pumpArea ${pumpedPreview.ok ? 'ok' : 'bad'}`} key={`pump-${stepIndex}-${pumpedPreview.i}`}>
              <h3>Pumped String: xy^{pumpedPreview.i}z</h3>
              <div className="charRow">
                {(x + y.repeat(pumpedPreview.i) + z).split('').map((ch, idx) => {
                  const xEnd = x.length
                  const yEnd = x.length + y.repeat(pumpedPreview.i).length
                  const tone = idx < xEnd ? 'x' : idx < yEnd ? 'y' : 'z'
                  return (
                    <span className={`token token-${tone}`} key={`p-${idx}`} style={{ '--i': idx }}>
                      {ch}
                    </span>
                  )
                })}
                {pumpedPreview.word === '' ? <span className="token token-empty">epsilon</span> : null}
              </div>
            </div>
          ) : null}

          <div className="xyzRow">
            <div className="xCard">
              <span>x</span>
              <strong>{x || 'epsilon'}</strong>
            </div>
            <div className="yCard">
              <span>y</span>
              <strong>{y || 'epsilon'}</strong>
            </div>
            <div className="zCard">
              <span>z</span>
              <strong>{z || 'epsilon'}</strong>
            </div>
          </div>

          {pumpedPreview ? (
            <div className={`pumpState ${pumpedPreview.ok ? 'ok' : 'bad'}`}>
              xy^{pumpedPreview.i}z = {pumpedPreview.word || 'epsilon'}
              <span>{pumpedPreview.ok ? 'in language' : 'not in language'}</span>
            </div>
          ) : null}
        </div>

        <aside className="sideSteps card">
          <div className="walkHead">
            <h2>Step-by-Step</h2>
            <p>{steps.length ? `Step ${stepIndex + 1} of ${steps.length}` : 'Waiting for run'}</p>
          </div>

          <div className={`stepPanel step-${currentStep?.type || 'empty'}`} key={`side-${stepIndex}-${currentStep?.title || 'empty'}`}>
            {currentStep ? (
              <>
                <h3>{currentStep.title}</h3>
                <p>{currentStep.description}</p>
              </>
            ) : (
              <p className="placeholder">No step yet. Choose language, p, and input string, then click Start Guided Proof.</p>
            )}
          </div>

          <div className="buttonRow">
            <button className="ghost" disabled={!steps.length || stepIndex === 0} onClick={onPrevStep}>
              Previous
            </button>
            <button className="ghost" disabled={!steps.length || stepIndex === steps.length - 1} onClick={onNextStep}>
              Next
            </button>
            <button className="ghost" disabled={!steps.length} onClick={onToggleAuto}>
              {isAutoPlaying ? 'Pause Auto Play' : 'Auto Play Steps'}
            </button>
            <button className="primary" disabled={!steps.length || stepIndex !== steps.length - 1} onClick={onReveal}>
              Reveal Final Verdict
            </button>
          </div>

          {walkthroughDone ? (
            <div className="customIBox">
              <h3>Try Your Own i Value</h3>
              <p>Walkthrough complete. Enter any i to test the pumped string in animation.</p>
              <div className="customIRow">
                <label>
                  i value
                  <input type="number" min="0" value={customI} onChange={(e) => onCustomIChange(e.target.value)} />
                </label>
                <button type="button" className="ghost" onClick={onUseCustomI}>
                  Show in Animation
                </button>
                <button type="button" className="ghost" onClick={onUseStepI}>
                  Use Step i
                </button>
              </div>

              {pumpedPreview ? (
                <p className={pumpedPreview.ok ? 'customIResult ok' : 'customIResult bad'}>
                  For i = {pumpedPreview.i}, string "{pumpedPreview.word || 'epsilon'}" is{' '}
                  {pumpedPreview.ok ? 'in language' : 'not in language (contradiction)'}.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="referenceNote">
            <h3>Language Reference</h3>
            <p>{explainText}</p>
          </div>

          <div className={`verdict ${verdictRevealed ? 'show' : ''}`}>
            {verdictRevealed ? (
              <p>
                Final verdict: <strong>{selectedLang.name}</strong> is <strong>{selectedLang.type}</strong>.
              </p>
            ) : (
              <p>Final verdict is hidden. Finish the walkthrough and click Reveal Final Verdict.</p>
            )}
          </div>
        </aside>
      </section>
    </>
  )
}

export default VisualizerPage
