// Performance optimizations with throttling and debouncing
const throttle = (func, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

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

// State variables
let currentStep = 0
let totalScore = 0
let hasSpouse = false
let showResults = false
let financialAutonomyAccepted = false
let isMobile = false

// Cached DOM elements for performance
const elements = {}

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => {
  cacheElements()
  checkMobile()
  initializeEventListeners()
  updateDisplay()
  updateProgress()
  window.addEventListener("resize", throttle(checkMobile, 100))
})

// Cache DOM elements for better performance
function cacheElements() {
  try {
    elements.stepPanels = document.querySelectorAll(".step-panel") || []
    elements.navButtonsMobile = document.querySelectorAll(".nav-btn-mobile") || []
    elements.navButtonsDesktop = document.querySelectorAll(".nav-btn-desktop") || []
    elements.prevBtn = document.getElementById("prev-btn")
    elements.nextBtn = document.getElementById("next-btn")
    elements.stepIndicator = document.getElementById("step-indicator")
    elements.progressFill = document.getElementById("progress-fill")
    elements.progressMessage = document.getElementById("progress-message")
    elements.emailForm = document.getElementById("email-gate-form")
    elements.emailFormContainer = document.getElementById("email-form-container")
    elements.resultsContent = document.getElementById("results-content")
    elements.resetBtn = document.getElementById("reset-btn")
    elements.downloadBtn = document.getElementById("download-btn")
    elements.ageInput = document.getElementById("age-input")
    elements.fieldInfoBtn = document.getElementById("field-info-btn")
    elements.fieldExplanation = document.getElementById("field-explanation")
    elements.spouseSection = document.getElementById("spouse-section")
    elements.financialCheckbox = document.getElementById("financial-autonomy-checkbox")

    // Cache score display elements with safety checks
    elements.scoreElements = {
      frenchOralComp: document.getElementById("score-french-oral-comp"),
      frenchOralProd: document.getElementById("score-french-oral-prod"),
      frenchWrittenComp: document.getElementById("score-french-written-comp"),
      frenchWrittenProd: document.getElementById("score-french-written-prod"),
      age: document.getElementById("score-age"),
      education: document.getElementById("score-education"),
      field: document.getElementById("score-field"),
      work: document.getElementById("score-work"),
      quebecDiploma: document.getElementById("score-quebec-diploma"),
      quebecWork: document.getElementById("score-quebec-work"),
      spouseFrench: document.getElementById("score-spouse-french"),
      spouseAge: document.getElementById("score-spouse-age"),
      spouseEducation: document.getElementById("score-spouse-education"),
      spouseField: document.getElementById("score-spouse-field"),
      jobOffer: document.getElementById("score-job-offer"),
      children: document.getElementById("score-children"),
      family: document.getElementById("score-family"),
      frenchTotal: document.getElementById("score-french-total"),
      englishTotal: document.getElementById("score-english-total"),
      totalScore: document.getElementById("total-score"),
    }

    // Cache hidden form fields for data capture with safety checks
    elements.hiddenFields = {
      totalScore: document.getElementById("arrima_score_total"),
      languageScore: document.getElementById("arrima_score_language"),
      jobOfferStatus: document.getElementById("job_offer_status"),
    }
  } catch (error) {
    console.error("Error caching elements:", error)
  }
}

// Check if mobile
function checkMobile() {
  isMobile = window.innerWidth < 768
}

// Initialize event listeners with performance optimizations
function initializeEventListeners() {
  try {
    // Navigation buttons with passive event listeners
    if (elements.navButtonsMobile) {
      elements.navButtonsMobile.forEach((btn, index) => {
        btn.addEventListener("click", () => goToStep(index), { passive: true })
      })
    }

    if (elements.navButtonsDesktop) {
      elements.navButtonsDesktop.forEach((btn, index) => {
        btn.addEventListener("click", () => goToStep(index), { passive: true })
      })
    }

    // Step navigation
    if (elements.prevBtn) {
      elements.prevBtn.addEventListener("click", previousStep)
    }
    if (elements.nextBtn) {
      elements.nextBtn.addEventListener("click", nextStep)
    }

    // Option buttons with event delegation for better performance
    document.addEventListener("click", (event) => {
      if (event.target.closest(".option-btn")) {
        handleOptionClick(event)
      }
    })

    // Age input with debounced handler
    if (elements.ageInput) {
      elements.ageInput.addEventListener("input", debounce(handleAgeInput, 300))
    }

    // Field info button
    if (elements.fieldInfoBtn) {
      elements.fieldInfoBtn.addEventListener("click", toggleFieldExplanation)
    }

    // Financial autonomy checkbox
    if (elements.financialCheckbox) {
      elements.financialCheckbox.addEventListener("change", function () {
        financialAutonomyAccepted = this.checked
        updateProgress()
        updateFinancialStatus()
      })
    }

    // Email form
    if (elements.emailForm) {
      elements.emailForm.addEventListener("submit", handleEmailSubmit)
    }

    // Reset button
    if (elements.resetBtn) {
      elements.resetBtn.addEventListener("click", resetCalculator)
    }

    // Download button
    if (elements.downloadBtn) {
      elements.downloadBtn.addEventListener("click", downloadResults)
    }
  } catch (error) {
    console.error("Error initializing event listeners:", error)
  }
}

// Handle option button clicks with optimized performance
function handleOptionClick(event) {
  const btn = event.target.closest(".option-btn")
  if (!btn) return

  const field = btn.dataset.field
  const value = btn.dataset.value

  // Handle spouse toggle
  if (field === "hasSpouse") {
    hasSpouse = value === "true"
    toggleSpouseSection()
    // Reset spouse scores if not married
    if (!hasSpouse) {
      scores.spouseFrenchOral = 0
      scores.spouseAge = 0
      scores.spouseEducation = 0
      scores.spouseFieldOfStudy = 0
      // Reset spouse option buttons
      document.querySelectorAll('[data-field^="spouse"]').forEach((spouseBtn) => {
        spouseBtn.classList.remove("active")
      })
    }
  } else {
    // Update score
    scores[field] = Number.parseInt(value) || 0
  }

  // Update button states efficiently
  requestAnimationFrame(() => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((otherBtn) => {
      otherBtn.classList.remove("active")
    })
    btn.classList.add("active")
  })

  // Batch updates for better performance
  requestAnimationFrame(() => {
    calculateTotal()
    updateScoreDisplay()
    updateProgress()
    updateHiddenFields() // Update hidden fields for data capture
  })
}

// Handle age input with optimized calculation
function handleAgeInput(event) {
  const age = Number.parseInt(event.target.value) || 0

  if (age < 18) {
    scores.age = 0
  } else if (age <= 30) {
    scores.age = 130
  } else if (age === 31) {
    scores.age = 124
  } else if (age === 32) {
    scores.age = 118
  } else if (age === 33) {
    scores.age = 112
  } else if (age === 34) {
    scores.age = 106
  } else if (age === 35) {
    scores.age = 100
  } else if (age === 36) {
    scores.age = 88
  } else if (age === 37) {
    scores.age = 76
  } else if (age === 38) {
    scores.age = 64
  } else if (age === 39) {
    scores.age = 52
  } else if (age === 40) {
    scores.age = 40
  } else if (age === 41) {
    scores.age = 26
  } else if (age === 42) {
    scores.age = 13
  } else {
    scores.age = 0
  }

  requestAnimationFrame(() => {
    calculateTotal()
    updateScoreDisplay()
    updateProgress()
    updateHiddenFields() // Update hidden fields for data capture
  })
}

// Toggle field explanation
function toggleFieldExplanation() {
  if (elements.fieldExplanation) {
    const isVisible = elements.fieldExplanation.style.display !== "none"
    elements.fieldExplanation.style.display = isVisible ? "none" : "block"
  }
}

// Toggle spouse section
function toggleSpouseSection() {
  if (elements.spouseSection) {
    elements.spouseSection.style.display = hasSpouse ? "block" : "none"
  }
}

// Navigation functions with smooth scrolling
function goToStep(step) {
  if (step >= 0 && step < elements.stepPanels.length) {
    currentStep = step
    updateDisplay()
    scrollToTop()
    // Special handling for results step
    if (step === 5) {
      setTimeout(() => {
        scrollToResults()
      }, 100)
    }
  }
}

function previousStep() {
  if (currentStep > 0) {
    goToStep(currentStep - 1)
  }
}

function nextStep() {
  if (currentStep < elements.stepPanels.length - 1) {
    if (currentStep === 4) {
      goToStep(5) // Go to results
    } else {
      goToStep(currentStep + 1)
    }
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function scrollToResults() {
  const resultsContainer = document.getElementById("results-container")
  if (resultsContainer) {
    if (isMobile) {
      // On mobile, scroll higher to account for fixed navigation
      const elementPosition = resultsContainer.offsetTop
      const offsetPosition = elementPosition - 180 // Adjust for mobile nav height + padding
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    } else {
      // On desktop, use standard scroll
      resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}

// Update display with optimized DOM manipulation
function updateDisplay() {
  requestAnimationFrame(() => {
    // Update step panels
    elements.stepPanels.forEach((panel, index) => {
      panel.classList.toggle("active", index === currentStep)
    })

    // Update navigation buttons
    elements.navButtonsMobile.forEach((btn, index) => {
      btn.classList.toggle("active", index === currentStep)
    })

    elements.navButtonsDesktop.forEach((btn, index) => {
      btn.classList.toggle("active", index === currentStep)
    })

    // Update step indicator
    if (elements.stepIndicator) {
      elements.stepIndicator.textContent = `${currentStep + 1} / ${elements.stepPanels.length}`
    }

    // Update navigation button states
    if (elements.prevBtn) {
      elements.prevBtn.disabled = currentStep === 0
    }
    if (elements.nextBtn) {
      elements.nextBtn.disabled = currentStep === elements.stepPanels.length - 1

      if (currentStep === 4) {
        elements.nextBtn.textContent = "Voir les résultats"
      } else {
        elements.nextBtn.innerHTML =
          'Suivant <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9,18 15,12 9,6"/></svg>'
      }
    }
  })
}

// Calculate total score
function calculateTotal() {
  totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
}

// Update score display with batched DOM updates
function updateScoreDisplay() {
  requestAnimationFrame(() => {
    // Individual scores
    if (elements.scoreElements.frenchOralComp) {
      elements.scoreElements.frenchOralComp.textContent = `${scores.frenchOralComprehension} pts`
    }
    if (elements.scoreElements.frenchOralProd) {
      elements.scoreElements.frenchOralProd.textContent = `${scores.frenchOralProduction} pts`
    }
    if (elements.scoreElements.frenchWrittenComp) {
      elements.scoreElements.frenchWrittenComp.textContent = `${scores.frenchWrittenComprehension} pts`
    }
    if (elements.scoreElements.frenchWrittenProd) {
      elements.scoreElements.frenchWrittenProd.textContent = `${scores.frenchWrittenProduction} pts`
    }
    if (elements.scoreElements.age) {
      elements.scoreElements.age.textContent = `${scores.age} pts`
    }
    if (elements.scoreElements.education) {
      elements.scoreElements.education.textContent = `${scores.education} pts`
    }
    if (elements.scoreElements.field) {
      elements.scoreElements.field.textContent = `${scores.fieldOfStudy} pts`
    }
    if (elements.scoreElements.work) {
      elements.scoreElements.work.textContent = `${scores.workExperience} pts`
    }
    if (elements.scoreElements.quebecDiploma) {
      elements.scoreElements.quebecDiploma.textContent = `${scores.quebecDiploma} pts`
    }
    if (elements.scoreElements.quebecWork) {
      elements.scoreElements.quebecWork.textContent = `${scores.quebecWorkExperience} pts`
    }
    if (elements.scoreElements.spouseFrench) {
      elements.scoreElements.spouseFrench.textContent = `${scores.spouseFrenchOral} pts`
    }
    if (elements.scoreElements.spouseAge) {
      elements.scoreElements.spouseAge.textContent = `${scores.spouseAge} pts`
    }
    if (elements.scoreElements.spouseEducation) {
      elements.scoreElements.spouseEducation.textContent = `${scores.spouseEducation} pts`
    }
    if (elements.scoreElements.spouseField) {
      elements.scoreElements.spouseField.textContent = `${scores.spouseFieldOfStudy} pts`
    }
    if (elements.scoreElements.jobOffer) {
      elements.scoreElements.jobOffer.textContent = `${scores.jobOffer} pts`
    }
    if (elements.scoreElements.children) {
      elements.scoreElements.children.textContent = `${scores.children} pts`
    }
    if (elements.scoreElements.family) {
      elements.scoreElements.family.textContent = `${scores.familyInQuebec} pts`
    }

    // French total
    const frenchTotal =
      scores.frenchOralComprehension +
      scores.frenchOralProduction +
      scores.frenchWrittenComprehension +
      scores.frenchWrittenProduction

    if (elements.scoreElements.frenchTotal) {
      elements.scoreElements.frenchTotal.textContent = `${frenchTotal} pts`
    }

    // English total
    const englishTotal =
      scores.englishOralComprehension +
      scores.englishOralProduction +
      scores.englishWrittenComprehension +
      scores.englishWrittenProduction

    if (elements.scoreElements.englishTotal) {
      elements.scoreElements.englishTotal.textContent = `${englishTotal} pts`
    }

    // Total score with color
    if (elements.scoreElements.totalScore) {
      elements.scoreElements.totalScore.textContent = `${totalScore} points`
      // Update total score color
      elements.scoreElements.totalScore.className = "total-score-text"
      if (totalScore < 300) {
        elements.scoreElements.totalScore.classList.add("red")
      } else if (totalScore < 600) {
        elements.scoreElements.totalScore.classList.add("yellow")
      } else {
        elements.scoreElements.totalScore.classList.add("green")
      }
    }
  })
}

// Update hidden form fields for data capture
function updateHiddenFields() {
  const frenchTotal =
    scores.frenchOralComprehension +
    scores.frenchOralProduction +
    scores.frenchWrittenComprehension +
    scores.frenchWrittenProduction

  const englishTotal =
    scores.englishOralComprehension +
    scores.englishOralProduction +
    scores.englishWrittenComprehension +
    scores.englishWrittenProduction

  if (elements.hiddenFields.totalScore) {
    elements.hiddenFields.totalScore.value = totalScore
  }
  if (elements.hiddenFields.languageScore) {
    elements.hiddenFields.languageScore.value = frenchTotal + englishTotal
  }
  if (elements.hiddenFields.jobOfferStatus) {
    elements.hiddenFields.jobOfferStatus.value = scores.jobOffer > 0 ? "Yes" : "No"
  }
}

// Update progress with optimized calculations
function updateProgress() {
  requestAnimationFrame(() => {
    if (!elements.progressFill || !elements.progressMessage) return

    const totalFields = Object.keys(scores).length
    const completedFields = Object.values(scores).filter((score) => score > 0).length
    const completionPercentage = Math.round((completedFields / totalFields) * 100)

    // Update progress bar based on score
    const maxPossibleScore = 1346
    const pointsProgress = Math.min((totalScore / maxPossibleScore) * 100, 100)
    elements.progressFill.style.width = `${pointsProgress}%`

    // Update progress color and message
    elements.progressFill.className = "progress-fill"
    elements.progressMessage.className = "progress-message"

    const minimumRequired = hasSpouse ? 59 : 50

    if (totalScore < minimumRequired) {
      elements.progressMessage.textContent = "Score insuffisant pour soumettre un profil Arrima"
      elements.progressMessage.classList.add("red")
    } else if (totalScore < 300) {
      elements.progressMessage.textContent = "Score minimal atteint, mais des améliorations sont nécessaires"
      elements.progressMessage.classList.add("red")
    } else if (totalScore < 600) {
      elements.progressFill.classList.add("yellow")
      elements.progressMessage.classList.add("yellow")
      elements.progressMessage.textContent = "Bon score ! Vous êtes sur la bonne voie"
    } else {
      elements.progressFill.classList.add("green")
      elements.progressMessage.classList.add("green")
      elements.progressMessage.textContent = "Excellent score ! Profil très compétitif"
    }
  })
}

// Handle email form submission with data capture
function handleEmailSubmit(event) {
  event.preventDefault()

  const email = document.getElementById("email-input-field")?.value
  const privacy = document.getElementById("privacy-checkbox")?.checked

  if (email && privacy) {
    // Update hidden fields before submission
    updateHiddenFields()

    showResults = true
    if (elements.emailFormContainer) {
      elements.emailFormContainer.style.display = "none"
    }
    if (elements.resultsContent) {
      elements.resultsContent.style.display = "block"
      elements.resultsContent.classList.add("show")
    }
    
    const recommendationsElement = document.getElementById("recommendations")
    if (recommendationsElement) {
      recommendationsElement.style.display = "block"
    }

    updateFinancialStatus()
    generateRecommendations()

    // GTM event tracking is handled by the onclick attribute in the HTML
  }
}

// Update financial status
function updateFinancialStatus() {
  const financialStatus = document.getElementById("financial-status")
  if (!showResults || !financialStatus) return

  financialStatus.style.display = "block"

  if (!financialAutonomyAccepted) {
    financialStatus.innerHTML = `
      <div class="financial-warning">
        <p><strong>⚠️ ATTENTION :</strong> Vous n'avez pas confirmé votre compréhension de l'exigence d'autonomie financière. Cette condition est OBLIGATOIRE pour obtenir le CSQ et la résidence permanente. Veuillez cocher cette case dans la section précédente.</p>
      </div>
    `
  } else {
    financialStatus.innerHTML = `
      <div class="financial-confirmed">
        <p><strong>✅ Autonomie financière confirmée :</strong> Vous avez confirmé votre compréhension de cette exigence obligatoire.</p>
      </div>
    `
  }
}

// Generate recommendations with optimized performance
function generateRecommendations() {
  const baseScore = totalScore - scores.jobOffer
  const frenchTotal =
    scores.frenchOralComprehension +
    scores.frenchOralProduction +
    scores.frenchWrittenComprehension +
    scores.frenchWrittenProduction

  // Generate score interpretation
  let scoreInterpretation = ""
  const minimumRequired = hasSpouse ? 59 : 50

  if (totalScore < minimumRequired) {
    scoreInterpretation = `Avec un score de ${totalScore} points, vous n'atteignez pas le minimum requis de ${minimumRequired} points pour soumettre un profil Arrima ${hasSpouse ? "(avec conjoint)" : "(candidat seul)"}. Il est essentiel d'améliorer votre profil avant de pouvoir postuler.`
  } else if (scores.jobOffer > 0) {
    if (totalScore >= 800) {
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont TRÈS ÉLEVÉES. Les candidats avec une offre d'emploi validée sont souvent priorisés, surtout si elle est hors de la CMM. Assurez-vous que votre offre est bien validée par le MIFI.`
    } else if (totalScore >= 600) {
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont ÉLEVÉES. Votre offre d'emploi vous donne un avantage significatif.`
    } else {
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points (score de base sans offre: ${baseScore}), vos chances d'invitation sont MODÉRÉES. Bien que l'offre d'emploi soit un atout, il serait bénéfique d'améliorer d'autres aspects de votre profil.`
    }
  } else {
    if (totalScore >= 620) {
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont TRÈS ÉLEVÉES. Votre profil est très compétitif pour les tirages généraux.`
    } else if (totalScore >= 570) {
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont ÉLEVÉES. Votre score se situe dans la fourchette souvent observée lors des tirages généraux.`
    } else if (totalScore >= 400) {
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont MODÉRÉES. Il serait recommandé d'améliorer certains aspects de votre profil pour augmenter vos chances.`
    } else {
      scoreInterpretation = `Avec un score de ${totalScore} points, vos chances d'invitation sont FAIBLES. Il est important d'améliorer significativement votre profil avant de soumettre votre candidature.`
    }
  }

  // Update score interpretation
  const scoreInterpretationElement = document.getElementById("score-interpretation")
  if (scoreInterpretationElement) {
    scoreInterpretationElement.innerHTML = `<p>${scoreInterpretation}</p>`
  }

  // Generate specific recommendations
  const recommendations = []

  if (frenchTotal < 200) {
    recommendations.push({
      title: "Améliorer le français",
      description:
        "Votre score en français est faible. Concentrez-vous sur l'amélioration de vos compétences linguistiques, particulièrement l'oral qui rapporte plus de points.",
      priority: "high",
      icon: "🗣️",
    })
  }

  if (scores.age < 100) {
    recommendations.push({
      title: "Facteur âge",
      description:
        "L'âge impacte votre score. Si vous avez plus de 35 ans, concentrez-vous sur d'autres facteurs pour compenser.",
      priority: "medium",
      icon: "👤",
    })
  }

  if (scores.education < 90) {
    recommendations.push({
      title: "Niveau d'éducation",
      description:
        "Considérez obtenir une reconnaissance de diplôme ou poursuivre des études supérieures pour augmenter vos points.",
      priority: "medium",
      icon: "🎓",
    })
  }

  if (scores.workExperience < 80) {
    recommendations.push({
      title: "Expérience professionnelle",
      description: "Accumulez plus d'expérience de travail qualifiée dans votre domaine avant de postuler.",
      priority: "medium",
      icon: "💼",
    })
  }

  if (scores.quebecDiploma === 0 && scores.quebecWorkExperience === 0) {
    recommendations.push({
      title: "Connexion au Québec",
      description:
        "Considérez obtenir un diplôme québécois ou une expérience de travail au Québec pour des points bonus significatifs.",
      priority: "high",
      icon: "🏠",
    })
  }

  if (scores.jobOffer === 0 && totalScore < 600) {
    recommendations.push({
      title: "Offre d'emploi",
      description:
        "Une offre d'emploi validée peut considérablement améliorer vos chances. Recherchez des opportunités, surtout hors de Montréal.",
      priority: "high",
      icon: "💼",
    })
  }

  if (hasSpouse && scores.spouseFrenchOral < 20) {
    recommendations.push({
      title: "Français du conjoint",
      description: "Votre conjoint peut contribuer des points en améliorant ses compétences orales en français.",
      priority: "medium",
      icon: "👥",
    })
  }

  // Update recommendations list
  const recommendationsList = document.getElementById("recommendations-list")
  if (recommendationsList && recommendations.length > 0) {
    let recommendationsHTML = "<h4>Recommandations personnalisées :</h4><div class='recommendations-grid'>"

    recommendations.forEach((rec) => {
      recommendationsHTML += `
        <div class="recommendation-item ${rec.priority}">
          <span class="recommendation-icon">${rec.icon}</span>
          <div class="recommendation-content">
            <h5>${rec.title}</h5>
            <p>${rec.description}</p>
          </div>
        </div>
      `
    })

    recommendationsHTML += "</div>"
    recommendationsList.innerHTML = recommendationsHTML
  } else if (recommendationsList) {
    recommendationsList.innerHTML = `
      <h4>Recommandations personnalisées :</h4>
      <div class="recommendation-item">
        <span class="recommendation-icon">🎉</span>
        <div class="recommendation-content">
          <h5>Excellent profil !</h5>
          <p>Votre profil est très solide. Continuez à maintenir vos compétences et restez informé des tirages Arrima.</p>
        </div>
      </div>
    `
  }
}

// Reset calculator
function resetCalculator() {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser le calculateur ? Toutes vos données seront perdues.")) {
    // Reset all scores
    Object.keys(scores).forEach((key) => {
      scores[key] = 0
    })

    // Reset state variables
    currentStep = 0
    totalScore = 0
    hasSpouse = false
    showResults = false
    financialAutonomyAccepted = false

    // Reset UI elements
    document.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("active"))
    if (elements.ageInput) {
      elements.ageInput.value = ""
    }
    if (elements.financialCheckbox) {
      elements.financialCheckbox.checked = false
    }
    if (elements.spouseSection) {
      elements.spouseSection.style.display = "none"
    }
    if (elements.fieldExplanation) {
      elements.fieldExplanation.style.display = "none"
    }
    if (elements.emailFormContainer) {
      elements.emailFormContainer.style.display = "block"
    }
    if (elements.resultsContent) {
      elements.resultsContent.style.display = "none"
      elements.resultsContent.classList.remove("show")
    }

    // Reset form
    if (elements.emailForm) {
      elements.emailForm.reset()
    }

    // Set default active states
    const defaultSpouseBtn = document.querySelector('[data-field="hasSpouse"][data-value="false"]')
    if (defaultSpouseBtn) {
      defaultSpouseBtn.classList.add("active")
    }

    // Update display
    updateDisplay()
    updateProgress()
    updateHiddenFields()
    scrollToTop()
  }
}

// Download results as high-quality JPEG screenshot
async function downloadResults() {
  try {
    // Show loading state
    const downloadBtn = elements.downloadBtn
    if (!downloadBtn) return

    const originalText = downloadBtn.textContent
    downloadBtn.textContent = "Génération de l'image..."
    downloadBtn.disabled = true

    // Check if html2canvas is available
    if (!window.html2canvas) {
      throw new Error("html2canvas library not loaded")
    }

    // Get the score breakdown area which now contains everything
    const scoreBreakdownArea = document.getElementById("score-breakdown-area")
    if (!scoreBreakdownArea) {
      throw new Error("Score breakdown area not found")
    }

    // Temporarily remove any blur effects and ensure content is visible
    scoreBreakdownArea.style.filter = "none"
    scoreBreakdownArea.style.pointerEvents = "auto"

    // Wait a moment for any transitions to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Configure html2canvas options for high quality
    const options = {
      backgroundColor: "#ffffff",
      scale: 3, // High resolution
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: scoreBreakdownArea.scrollWidth,
      height: scoreBreakdownArea.scrollHeight,
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
    }

    // Generate the canvas
    const canvas = await window.html2canvas(scoreBreakdownArea, options)

    // Convert to high-quality JPEG
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `Resultats-Arrima-${new Date().toLocaleDateString("fr-CA")}.jpg`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)

          // Track download event
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "results_download",
              download_type: "jpeg_screenshot",
              score_total: totalScore,
              has_spouse: hasSpouse,
            })
          }
        } else {
          throw new Error("Failed to generate image blob")
        }
      },
      "image/jpeg",
      0.95, // High quality JPEG
    )

    // Reset button
    downloadBtn.textContent = originalText
    downloadBtn.disabled = false
  } catch (error) {
    console.error("Error generating screenshot:", error)

    // Fallback: try with different options
    try {
      const scoreBreakdownArea = document.getElementById("score-breakdown-area")
      if (scoreBreakdownArea && window.html2canvas) {
        const simpleCanvas = await window.html2canvas(scoreBreakdownArea, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        })

        simpleCanvas.toBlob(
          (blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `Resultats-Arrima-${new Date().toLocaleDateString("fr-CA")}.jpg`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    } catch (fallbackError) {
      console.error("Fallback screenshot also failed:", fallbackError)
      alert("Erreur lors de la génération de l'image. Veuillez réessayer ou utiliser un navigateur différent.")
    }

    // Reset button
    const downloadBtn = elements.downloadBtn
    if (downloadBtn) {
      downloadBtn.textContent = "📥 Télécharger les résultats"
      downloadBtn.disabled = false
    }
  }
}
