function TheoryPage() {
  return (
    <>
      <section className="novice card reveal-up">
        <h2>Beginner Quick Start</h2>
        <p>
     Think of the Pumping Lemma as a way to check whether a language is regular or not.
          It works by taking a sufficiently long string and testing if a part of it can be
          repeated without breaking the rules of the language.    </p>
        <div className="noviceGrid">
          <article>
            <h3>What is p?</h3>
            <p>
         p is called the pumping length. It defines a limit such that the repeating
              part must appear within the first p characters of the string.
            </p>
          </article>
          <article>
            <h3>What are x, y, z?</h3>
            <p>
                 Any string s is divided into three parts: x (prefix), y (middle part),
              and z (suffix). The middle part y is the section that will be repeated.
              we must pump something.
            </p>
          </article>
          <article>
            <h3>What does pumping mean?</h3>
            <p>
           Pumping means repeating the middle part y multiple times (or even removing it).
              If repeating y causes the string to break the rules of the language, then the
              language is not regular.
                </p>
          </article>
        </div>
      </section>

      <section className="intro card reveal-up">
        <h2>What is Pumping Lemma?</h2>
        <p>
          The Pumping Lemma is a property that all regular languages must satisfy.
          It states that any sufficiently long string in a regular language can be
          divided into three parts: s = xyz, following certain conditions.
       </p>
        <ul>
          <li>|xy| must be at most p.</li>
          <li>|y| must be at least 1.</li>
          <li>For every i &gt;= 0, xy^i z must remain in the language.</li>
        </ul>
        <p>
      To prove that a language is not regular, we assume it is regular, apply
          the lemma, and show that for some value of i, the string no longer belongs
          to the language. This contradiction proves the language is not regular.
         </p>
      </section>
    </>
  )
}

export default TheoryPage
