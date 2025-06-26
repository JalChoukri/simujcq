// Score tracking object
const scores = {
  frenchOralComprehension: 0,
  frenchOralProduction: 0,
  frenchWrittenComprehension: 0,
  frenchWrittenProduction: 0,
  englishOralComprehension: 0,
  englishOralProduction: 0,
  englishWrittenComprehension: 0,
  englishWrittenProduction: 0,
  age: 0,
  education: 0,
  fieldOfStudy: 0,
  workExperience: 0,
  quebecDiploma: 0,
  quebecWorkExperience: 0,
  spouseFrenchOral: 0,
  spouseAge: 0,
  spouseEducation: 0,
  spouseFieldOfStudy: 0,
  jobOffer: 0,
  children: 0,
  familyInQuebec: 0,
}

let totalScore = 0
let hasSpouse = false
let showResults = false
let financialAutonomyAccepted = false
let mounted = false

// Cached DOM Elements for performance
const cachedElements = {}

// DOM Elements
const emailOverlay = document.getElementById("email-overlay")
const resultsContent = document.getElementById("results-content")
const emailForm = document.getElementById("email-form")
const spouseFields = document.getElementById("spouse-fields")
const progressFill = document.getElementById("progress-fill")
const progressMessage = document.getElementById("progress-message")
const recommendations = document.getElementById("recommendations")
const resetSection = document.getElementById("reset-section")
const financialWarning = document.getElementById("financial-warning")

// Performance optimizations
const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Memoized calculations
const memoizedCalculations = {
  totalScore: null,
  completionPercentage: null,
  frenchTotal: null,
  englishTotal: null,
}

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => {
  mounted = true
  cacheElements()
  initializeEventListeners()
  updateProgress()
  updateScoreDisplay()
})

// Cache DOM elements for better performance
function cacheElements() {
  const elements = [
    "score-french-oral-comp",
    "score-french-oral-prod",
    "score-french-written-comp",
    "score-french-written-prod",
    "score-age",
    "score-education",
    "score-field",
    "score-work",
    "score-quebec-diploma",
    "score-quebec-work",
    "score-spouse-french",
    "score-spouse-age",
    "score-spouse-education",
    "score-spouse-field",
    "score-job-offer",
    "score-children",
    "score-family",
    "score-french-total",
    "score-english-total",
    "total-score",
  ]

  elements.forEach((id) => {
    cachedElements[id] = document.getElementById(id)
  })
}

// Event Listeners with performance optimizations
function initializeEventListeners() {
  // Navigation buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const section = this.dataset.section
      scrollToSection(section)
      updateActiveNavButton(section)
    })
  })

  // Score selects with debounced updates
  document.querySelectorAll(".form-select[data-score]").forEach((select) => {
    select.addEventListener(
      "change",
      debounce(function () {
        const scoreKey = this.dataset.score
        const value = Number.parseInt(this.value) || 0
        updateScore(scoreKey, value)
      }, 100),
    )
  })

  // Spouse radio buttons
  document.querySelectorAll('input[name="hasSpouse"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      hasSpouse = this.value === "true"
      toggleSpouseFields()
      if (!hasSpouse) {
        // Reset spouse scores
        scores.spouseFrenchOral = 0
        scores.spouseAge = 0
        scores.spouseEducation = 0
        scores.spouseFieldOfStudy = 0
        // Reset spouse form fields
        document.querySelectorAll("#spouse-fields .form-select").forEach((select) => {
          select.value = ""
        })
      }
      calculateTotal()
      updateScoreDisplay()
      updateProgress()
    })
  })

  // Financial autonomy checkbox
  const financialCheckbox = document.getElementById("financial-autonomy-checkbox")
  if (financialCheckbox) {
    financialCheckbox.addEventListener("change", function () {
      financialAutonomyAccepted = this.checked
      updateProgress()
    })
  }

  // Email form
  if (emailForm) {
    emailForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("email-input").value
      const privacy = document.getElementById("privacy-checkbox").checked

      if (email && privacy) {
        showResults = true
        if (emailOverlay) emailOverlay.style.display = "none"
        if (resultsContent) resultsContent.classList.add("show")
        if (recommendations) recommendations.style.display = "block"
        if (resetSection) resetSection.style.display = "block"
        generateRecommendations()
      }
    })
  }

  // Reset button
  const resetBtn = document.getElementById("reset-btn")
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCalculator)
  }

  // Throttled scroll spy
  if (mounted) {
    window.addEventListener("scroll", throttle(handleScroll, 100), { passive: true })
  }
}

// Score management with memoization
function updateScore(key, value) {
  scores[key] = value
  // Clear memoized calculations
  memoizedCalculations.totalScore = null
  memoizedCalculations.completionPercentage = null
  memoizedCalculations.frenchTotal = null
  memoizedCalculations.englishTotal = null

  calculateTotal()
  updateScoreDisplay()
  updateProgress()
}

function calculateTotal() {
  if (memoizedCalculations.totalScore === null) {
    memoizedCalculations.totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  }
  totalScore = memoizedCalculations.totalScore
}

// UI Updates with performance optimizations
function updateScoreDisplay() {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    // Individual scores with cached elements
    const scoreUpdates = {
      "score-french-oral-comp": scores.frenchOralComprehension,
      "score-french-oral-prod": scores.frenchOralProduction,
      "score-french-written-comp": scores.frenchWrittenComprehension,
      "score-french-written-prod": scores.frenchWrittenProduction,
      "score-age": scores.age,
      "score-education": scores.education,
      "score-field": scores.fieldOfStudy,
      "score-work": scores.workExperience,
      "score-quebec-diploma": scores.quebecDiploma,
      "score-quebec-work": scores.quebecWorkExperience,
      "score-spouse-french": scores.spouseFrenchOral,
      "score-spouse-age": scores.spouseAge,
      "score-spouse-education": scores.spouseEducation,
      "score-spouse-field": scores.spouseFieldOfStudy,
      "score-job-offer": scores.jobOffer,
      "score-children": scores.children,
      "score-family": scores.familyInQuebec,
    }

    Object.entries(scoreUpdates).forEach(([id, value]) => {
      const element = cachedElements[id]
      if (element) {
        element.textContent = `${value} pts`
      }
    })

    // French total with memoization
    if (memoizedCalculations.frenchTotal === null) {
      memoizedCalculations.frenchTotal =
        scores.frenchOralComprehension +
        scores.frenchOralProduction +
        scores.frenchWrittenComprehension +
        scores.frenchWrittenProduction
    }

    const frenchTotalElement = cachedElements["score-french-total"]
    if (frenchTotalElement) {
      frenchTotalElement.textContent = `${memoizedCalculations.frenchTotal} pts`
    }

    // English total with memoization
    if (memoizedCalculations.englishTotal === null) {
      memoizedCalculations.englishTotal =
        scores.englishOralComprehension +
        scores.englishOralProduction +
        scores.englishWrittenComprehension +
        scores.englishWrittenProduction
    }

    const englishTotalElement = cachedElements["score-english-total"]
    if (englishTotalElement) {
      englishTotalElement.textContent = `${memoizedCalculations.englishTotal} pts`
    }

    // Total score with dynamic color
    const totalScoreElement = cachedElements["total-score"]
    if (totalScoreElement) {
      totalScoreElement.textContent = `${totalScore} points`

      // Update total score color based on progress
      const completionPercentage = calculateCompletionPercentage()
      totalScoreElement.className = "total-score-text"

      if (completionPercentage < 30) {
        totalScoreElement.classList.add("red")
      } else if (completionPercentage < 70) {
        totalScoreElement.classList.add("yellow")
      } else {
        totalScoreElement.classList.add("green")
      }
    }
  })
}

function calculateCompletionPercentage() {
  if (memoizedCalculations.completionPercentage === null) {
    const totalFields = Object.keys(scores).length + 1 // +1 for financial autonomy
    const completedFields =
      Object.values(scores).filter((score) => score > 0).length + (financialAutonomyAccepted ? 1 : 0)
    memoizedCalculations.completionPercentage = (completedFields / totalFields) * 100
  }
  return memoizedCalculations.completionPercentage
}

function updateProgress() {
  const percentage = Math.round(calculateCompletionPercentage())

  if (progressFill) {
    // Use transform instead of width for better performance
    progressFill.style.transform = `scaleX(${percentage / 100})`
    progressFill.style.transformOrigin = "left"
  }

  // Update progress color and message
  if (progressFill && progressMessage) {
    if (percentage < 30) {
      progressFill.className = "progress-fill"
      progressMessage.textContent = "Continuez - Informations insuffisantes"
    } else if (percentage < 70) {
      progressFill.className = "progress-fill yellow"
      progressMessage.textContent = "Bon progrès - Ça s'améliore"
    } else {
      progressFill.className = "progress-fill green"
      progressMessage.textContent = "Excellent - Presque terminé!"
    }
  }
}

function toggleSpouseFields() {
  if (spouseFields) {
    if (hasSpouse) {
      spouseFields.style.display = "block"
    } else {
      spouseFields.style.display = "none"
    }
  }
}

// Navigation with performance optimizations
function scrollToSection(sectionId) {
  if (!mounted) return

  const section = document.getElementById(`${sectionId}-section`)
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function updateActiveNavButton(activeSection) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.section === activeSection) {
      btn.classList.add("active")
    }
  })
}

function handleScroll() {
  if (!mounted) return

  const sections = [
    { id: "french", element: document.getElementById("french-section") },
    { id: "english", element: document.getElementById("english-section") },
    { id: "human-capital", element: document.getElementById("human-capital-section") },
    { id: "quebec", element: document.getElementById("quebec-section") },
    { id: "spouse", element: document.getElementById("spouse-section") },
    { id: "additional", element: document.getElementById("additional-section") },
  ]

  const scrollPosition = window.scrollY + 200

  for (const section of sections) {
    if (section.element) {
      const { offsetTop, offsetHeight } = section.element
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        updateActiveNavButton(section.id)
        break
      }
    }
  }
}

// Recommendations with memoization
function generateRecommendations() {
  const baseScore = totalScore - scores.jobOffer
  const frenchTotal =
    memoizedCalculations.frenchTotal ||
    scores.frenchOralComprehension +
      scores.frenchOralProduction +
      scores.frenchWrittenComprehension +
      scores.frenchWrittenProduction

  // Generate score interpretation
  let scoreInterpretation = ""
  let chanceLevel = ""

  if (scores.jobOffer > 0) {
    if (totalScore >= 800) {
      chanceLevel = "TRÈS ÉLEVÉES"
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont ${chanceLevel}. Les candidats avec une offre d'emploi validée sont souvent priorisés, surtout si elle est hors de la CMM. Assurez-vous que votre offre est bien validée par le MIFI.`
    } else if (totalScore >= 600) {
      chanceLevel = "ÉLEVÉES"
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont ${chanceLevel}. Votre offre d'emploi vous donne un avantage significatif.`
    } else {
      chanceLevel = "MODÉRÉES"
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont ${chanceLevel}. Bien que l'offre d'emploi soit un atout, il serait bénéfique d'améliorer d'autres aspects de votre profil.`
    }
  } else {
    if (totalScore >= 620) {
      chanceLevel = "TRÈS ÉLEVÉES"
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont ${chanceLevel}. Votre profil est très compétitif pour les tirages généraux.`
    } else if (totalScore >= 570) {
      chanceLevel = "ÉLEVÉES"
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont ${chanceLevel}. Votre score se situe dans la fourchette souvent observée lors des tirages généraux.`
    } else if (totalScore >= 400) {
      chanceLevel = "MODÉRÉES"
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont ${chanceLevel}. Il serait recommandé d'améliorer certains aspects de votre profil pour augmenter vos chances.`
    } else {
      chanceLevel = "FAIBLES"
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont ${chanceLevel}. Il est important d'améliorer significativement votre profil avant de soumettre votre candidature.`
    }
  }

  // Update score interpretation
  const scoreInterpretationElement = document.getElementById("score-interpretation")
  if (scoreInterpretationElement) {
    scoreInterpretationElement.innerHTML = `<p>${scoreInterpretation}</p>`
  }

  // Show/hide financial autonomy warning
  if (financialWarning) {
    if (!financialAutonomyAccepted) {
      financialWarning.style.display = "block"
    } else {
      financialWarning.style.display = "none"
    }
  }

  // Generate specific recommendations
  const recommendationsList = document.getElementById("recommendations-list")
  if (!recommendationsList) return

  const recommendationsArray = []

  if (frenchTotal < 200) {
    recommendationsArray.push({
      title: "Améliorer le français",
      description:
        "Votre score en français est faible. Concentrez-vous sur l'amélioration de vos compétences linguistiques, particulièrement l'oral qui rapporte plus de points.",
      priority: "high",
      icon: "language",
    })
  }

  if (scores.age < 100) {
    recommendationsArray.push({
      title: "Facteur âge",
      description:
        "L'âge impacte votre score. Si vous avez plus de 35 ans, concentrez-vous sur d'autres facteurs pour compenser.",
      priority: "medium",
      icon: "user",
    })
  }

  if (scores.education < 90) {
    recommendationsArray.push({
      title: "Niveau d'éducation",
      description:
        "Considérez obtenir une reconnaissance de diplôme ou poursuivre des études supérieures pour augmenter vos points.",
      priority: "medium",
      icon: "education",
    })
  }

  if (scores.workExperience < 80) {
    recommendationsArray.push({
      title: "Expérience professionnelle",
      description: "Accumulez plus d'expérience de travail qualifiée dans votre domaine avant de postuler.",
      priority: "medium",
      icon: "work",
    })
  }

  if (scores.quebecDiploma === 0 && scores.quebecWorkExperience === 0) {
    recommendationsArray.push({
      title: "Connexion au Québec",
      description:
        "Considérez obtenir un diplôme québécois ou une expérience de travail au Québec pour des points bonus significatifs.",
      priority: "high",
      icon: "location",
    })
  }

  if (scores.jobOffer === 0) {
    recommendationsArray.push({
      title: "Offre d'emploi",
      description:
        "Une offre d'emploi validée par le MIFI peut considérablement augmenter vos chances, surtout si elle est hors de la région de Montréal.",
      priority: "high",
      icon: "trending",
    })
  }

  // Render recommendations with performance optimization
  if (recommendationsArray.length > 0) {
    let recommendationsHTML = '<h4>Recommandations pour améliorer votre profil :</h4><div class="recommendations-grid">'

    recommendationsArray.forEach((rec) => {
      const iconSVG = getIconSVG(rec.icon)
      recommendationsHTML += `
                <div class="recommendation-item ${rec.priority}">
                    ${iconSVG}
                    <div class="recommendation-content">
                        <h5>${rec.title}</h5>
                        <p>${rec.description}</p>
                    </div>
                </div>
            `
    })

    recommendationsHTML += "</div>"
    recommendationsList.innerHTML = recommendationsHTML
  } else {
    recommendationsList.innerHTML = "<p>Excellent profil ! Continuez à maintenir vos qualifications à jour.</p>"
  }
}

function getIconSVG(iconType) {
  const icons = {
    language:
      '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>',
    user: '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    education:
      '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 0 5-1 7-2"/></svg>',
    work: '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    location:
      '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    trending:
      '<svg class="recommendation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>',
  }
  return icons[iconType] || icons.trending
}

// Reset functionality
function resetCalculator() {
  // Reset all scores
  Object.keys(scores).forEach((key) => {
    scores[key] = 0
  })

  // Clear memoized calculations
  Object.keys(memoizedCalculations).forEach((key) => {
    memoizedCalculations[key] = null
  })

  // Reset form fields
  document.querySelectorAll(".form-select").forEach((select) => {
    select.value = ""
  })

  // Reset radio buttons
  document.querySelectorAll('input[name="hasSpouse"]').forEach((radio) => {
    radio.checked = radio.value === "false"
  })

  // Reset checkboxes
  const financialCheckbox = document.getElementById("financial-autonomy-checkbox")
  if (financialCheckbox) {
    financialCheckbox.checked = false
  }
  financialAutonomyAccepted = false

  // Reset spouse fields
  hasSpouse = false
  toggleSpouseFields()

  // Reset email form
  const emailInput = document.getElementById("email-input")
  const privacyCheckbox = document.getElementById("privacy-checkbox")
  if (emailInput) emailInput.value = ""
  if (privacyCheckbox) privacyCheckbox.checked = false

  // Reset UI state
  showResults = false
  if (emailOverlay) emailOverlay.style.display = "flex"
  if (resultsContent) resultsContent.classList.remove("show")
  if (recommendations) recommendations.style.display = "none"
  if (resetSection) resetSection.style.display = "none"

  // Update displays
  calculateTotal()
  updateScoreDisplay()
  updateProgress()

  // Scroll to top
  if (mounted) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

// Export for potential external use
if (typeof window !== "undefined") {
  window.ArrimaCalculator = {
    getScores: () => scores,
    getTotalScore: () => totalScore,
    reset: resetCalculator,
    updateScore: updateScore,
  }
}
