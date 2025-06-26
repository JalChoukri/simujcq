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

// DOM Elements
const emailOverlay = document.getElementById("email-overlay")
const resultsContent = document.getElementById("results-content")
const emailForm = document.getElementById("email-form")
const spouseFields = document.getElementById("spouse-fields")
const progressFill = document.getElementById("progress-fill")
const progressPercentage = document.getElementById("progress-percentage")
const progressMessage = document.getElementById("progress-message")
const recommendations = document.getElementById("recommendations")
const resetSection = document.getElementById("reset-section")
const financialWarning = document.getElementById("financial-warning")

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  updateProgress()
  updateScoreDisplay()
})

// Event Listeners
function initializeEventListeners() {
  // Navigation buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const section = this.dataset.section
      scrollToSection(section)
      updateActiveNavButton(section)
    })
  })

  // Score selects
  document.querySelectorAll(".form-select[data-score]").forEach((select) => {
    select.addEventListener("change", function () {
      const scoreKey = this.dataset.score
      const value = Number.parseInt(this.value) || 0
      updateScore(scoreKey, value)
    })
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
  document.getElementById("financial-autonomy-checkbox").addEventListener("change", function () {
    financialAutonomyAccepted = this.checked
    updateProgress()
  })

  // Email form
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email-input").value
    const privacy = document.getElementById("privacy-checkbox").checked

    if (email && privacy) {
      showResults = true
      emailOverlay.style.display = "none"
      resultsContent.classList.add("show")
      recommendations.style.display = "block"
      resetSection.style.display = "block"
      generateRecommendations()
    }
  })

  // Reset button
  document.getElementById("reset-btn").addEventListener("click", resetCalculator)

  // Scroll spy
  window.addEventListener("scroll", handleScroll)
}

// Score management
function updateScore(key, value) {
  scores[key] = value
  calculateTotal()
  updateScoreDisplay()
  updateProgress()
}

function calculateTotal() {
  totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
}

// UI Updates
function updateScoreDisplay() {
  // Individual scores
  document.getElementById("score-french-oral-comp").textContent = `${scores.frenchOralComprehension} pts`
  document.getElementById("score-french-oral-prod").textContent = `${scores.frenchOralProduction} pts`
  document.getElementById("score-french-written-comp").textContent = `${scores.frenchWrittenComprehension} pts`
  document.getElementById("score-french-written-prod").textContent = `${scores.frenchWrittenProduction} pts`

  // French total
  const frenchTotal =
    scores.frenchOralComprehension +
    scores.frenchOralProduction +
    scores.frenchWrittenComprehension +
    scores.frenchWrittenProduction
  document.getElementById("score-french-total").textContent = `${frenchTotal} pts`

  // English total
  const englishTotal =
    scores.englishOralComprehension +
    scores.englishOralProduction +
    scores.englishWrittenComprehension +
    scores.englishWrittenProduction
  document.getElementById("score-english-total").textContent = `${englishTotal} pts`

  // Other scores
  document.getElementById("score-age").textContent = `${scores.age} pts`
  document.getElementById("score-education").textContent = `${scores.education} pts`
  document.getElementById("score-field").textContent = `${scores.fieldOfStudy} pts`
  document.getElementById("score-work").textContent = `${scores.workExperience} pts`
  document.getElementById("score-quebec-diploma").textContent = `${scores.quebecDiploma} pts`
  document.getElementById("score-quebec-work").textContent = `${scores.quebecWorkExperience} pts`
  document.getElementById("score-spouse-french").textContent = `${scores.spouseFrenchOral} pts`
  document.getElementById("score-spouse-age").textContent = `${scores.spouseAge} pts`
  document.getElementById("score-spouse-education").textContent = `${scores.spouseEducation} pts`
  document.getElementById("score-spouse-field").textContent = `${scores.spouseFieldOfStudy} pts`
  document.getElementById("score-job-offer").textContent = `${scores.jobOffer} pts`
  document.getElementById("score-children").textContent = `${scores.children} pts`
  document.getElementById("score-family").textContent = `${scores.familyInQuebec} pts`

  // Total score with dynamic color
  const totalScoreElement = document.getElementById("total-score")
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

function calculateCompletionPercentage() {
  const totalFields = Object.keys(scores).length + 1 // +1 for financial autonomy
  const completedFields =
    Object.values(scores).filter((score) => score > 0).length + (financialAutonomyAccepted ? 1 : 0)
  return (completedFields / totalFields) * 100
}

function updateProgress() {
  const percentage = Math.round(calculateCompletionPercentage())

  progressFill.style.width = `${percentage}%`
  progressPercentage.textContent = `${percentage}% terminé`

  // Update progress color and message
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

function toggleSpouseFields() {
  if (hasSpouse) {
    spouseFields.style.display = "block"
  } else {
    spouseFields.style.display = "none"
  }
}

// Navigation
function scrollToSection(sectionId) {
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

// Recommendations
function generateRecommendations() {
  const baseScore = totalScore - scores.jobOffer
  const frenchTotal =
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
  document.getElementById("score-interpretation").innerHTML = `<p>${scoreInterpretation}</p>`

  // Show/hide financial autonomy warning
  if (!financialAutonomyAccepted) {
    financialWarning.style.display = "block"
  } else {
    financialWarning.style.display = "none"
  }

  // Generate specific recommendations
  const recommendationsList = document.getElementById("recommendations-list")
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

  // Render recommendations
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

  // Reset form fields
  document.querySelectorAll(".form-select").forEach((select) => {
    select.value = ""
  })

  // Reset radio buttons
  document.querySelectorAll('input[name="hasSpouse"]').forEach((radio) => {
    radio.checked = radio.value === "false"
  })

  // Reset checkboxes
  document.getElementById("financial-autonomy-checkbox").checked = false
  financialAutonomyAccepted = false

  // Reset spouse fields
  hasSpouse = false
  toggleSpouseFields()

  // Reset email form
  document.getElementById("email-input").value = ""
  document.getElementById("privacy-checkbox").checked = false

  // Reset UI state
  showResults = false
  emailOverlay.style.display = "flex"
  resultsContent.classList.remove("show")
  recommendations.style.display = "none"
  resetSection.style.display = "none"

  // Update displays
  calculateTotal()
  updateScoreDisplay()
  updateProgress()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Utility functions
function debounce(func, wait) {
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

// Export for potential external use
window.ArrimaCalculator = {
  getScores: () => scores,
  getTotalScore: () => totalScore,
  reset: resetCalculator,
  updateScore: updateScore,
}
