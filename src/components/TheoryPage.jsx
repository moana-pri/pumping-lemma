import { useState } from 'react'

function TheoryPage({ onGoVisualizer }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(null)
  const [showBlur, setShowBlur] = useState(false)

  const cards = [
    {
      id: 'what-is-p',
      title: 'What is p?',
      content: 'p is called the pumping length. It defines a limit such that the repeating part must appear within the first p characters of the string. Think of it as a threshold—if your string is longer than p, the Pumping Lemma guarantees you can find a repeating section.'
    },
    {
      id: 'what-is-xyz',
      title: 'What are x, y, z?',
      content: 'Any string s is divided into three parts: x (prefix), y (middle part), and z (suffix). The middle part y is the section that will be repeated. We must pump something—y cannot be empty. The constraint |xy| ≤ p ensures we\'re looking at the beginning of the string.'
    },
    {
      id: 'what-is-pumping',
      title: 'What does pumping mean?',
      content: 'Pumping means repeating the middle part y multiple times (0, 1, 2, 3... times). If repeating y any number of times causes the string to break the rules of the language, then the language is NOT regular. This is the contradiction we look for!'
    },
    {
      id: 'how-to-prove',
      title: 'How do we prove non-regularity?',
      content: 'We assume the language IS regular, apply the Pumping Lemma, and then show that for some value of i, the pumped string xy^i z is NO LONGER in the language. This contradiction means our assumption was wrong—the language must be non-regular!'
    }
  ]

  const handleOpenCard = (index) => {
    setCurrentCardIndex(index)
    setShowBlur(true)
  }

  const handleCloseCard = () => {
    setCurrentCardIndex(null)
    setShowBlur(false)
  }

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      handleCloseCard()
    }
  }

  const handleGoVisualizer = () => {
    handleCloseCard()
    if (typeof onGoVisualizer === 'function') {
      onGoVisualizer()
    }
  }

  const currentCard = currentCardIndex !== null ? cards[currentCardIndex] : null

  return (
    <>
      {showBlur && <div className="modalBackdrop" onClick={handleCloseCard} />}
      
      <section className="novice card reveal-up">
        <h2>Beginner Quick Start</h2>
        <p>
          Think of the Pumping Lemma as a way to check whether a language is regular or not.
          It works by taking a sufficiently long string and testing if a part of it can be
          repeated without breaking the rules of the language. Click any card below to learn more!
        </p>
        <div className="noviceGrid">
          {cards.slice(0, 3).map((card, idx) => (
            <article key={card.id} className="interactiveCard" onClick={() => handleOpenCard(idx)}>
              <h3>{card.title}</h3>
              <p>{card.content.substring(0, 80)}...</p>
              <span className="readMore">Read More →</span>
            </article>
          ))}
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
          Then go to the Visualizer for visual aid.
        </p>
        <button className="learnMore" onClick={() => handleOpenCard(3)}>
          Learn How to Prove Non-Regularity with Visual Aid →
        </button>
      </section>

      {currentCard && (
        <div className={`cardModal ${showBlur ? 'show' : ''}`}>
          <div className="cardModalContent slideIn">
            <button className="closeBtn" onClick={handleCloseCard} aria-label="Close">✕</button>
            <h2>{currentCard.title}</h2>
            <p className="modalBody">{currentCard.content}</p>
            <div className="modalFooter">
              <button className="ghost" onClick={handleGoVisualizer}>Go to Visualizer</button>
              <button className="ghost" onClick={handleCloseCard}>Close</button>
              <button className="primary" onClick={handleNextCard}>
                {currentCardIndex < cards.length - 1 ? 'Next →' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TheoryPage
