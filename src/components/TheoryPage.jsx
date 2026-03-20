function TheoryPage() {
  return (
    <>
      <section className="novice card reveal-up">
        <h2>Beginner Quick Start</h2>
        <p>
          If you are a first-time learner, think of Pumping Lemma as a stress test for
          regular languages. We pick one long string, split it into x, y, z, and then
          test what happens when the middle part y is repeated.
        </p>
        <div className="noviceGrid">
          <article>
            <h3>What is p?</h3>
            <p>
              p is the pumping length. It is a boundary that says x and y must come from
              the first p symbols.
            </p>
          </article>
          <article>
            <h3>What are x, y, z?</h3>
            <p>
              x is prefix, y is pump region, and z is suffix. y cannot be empty because
              we must pump something.
            </p>
          </article>
          <article>
            <h3>What does pumping mean?</h3>
            <p>
              Pumping means replacing y by y^i for i = 0, 1, 2, ... If one pumped string
              leaves the language, we get contradiction.
            </p>
          </article>
        </div>
      </section>

      <section className="intro card reveal-up">
        <h2>What is Pumping Lemma?</h2>
        <p>
          Pumping lemma is a test used to reason about regular languages. If a language is
          regular, then every long enough string can be split as s = xyz with special rules.
        </p>
        <ul>
          <li>|xy| must be at most p.</li>
          <li>|y| must be at least 1.</li>
          <li>For every i &gt;= 0, xy^i z must remain in the language.</li>
        </ul>
        <p>
          Proof idea for non-regular languages: pick s in L, force y into a sensitive
          region, pump with some i, and show resulting string is not in L.
        </p>
      </section>
    </>
  )
}

export default TheoryPage
