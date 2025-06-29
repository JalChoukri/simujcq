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

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  updateDisplay()
  updateProgress()
})

// Initialize event listeners
function initializeEventListeners() {
  // Navigation buttons
  document.querySelectorAll(".nav-btn-mobile, .nav-btn-desktop").forEach((btn, index) => {
    btn.addEventListener("click", () => goToStep(index))
  })

  // Step navigation
  document.getElementById("prev-btn").addEventListener("click", previousStep)
  document.getElementById("next-btn").addEventListener("click", nextStep)

  // Option buttons
  document.addEventListener("click", (event) => {
    if (event.target.closest(".option-btn")) {
      handleOptionClick(event)
    }
  })

  // Age input
  document.getElementById("age-input").addEventListener("input", handleAgeInput)

  // Field info button
  document.getElementById("field-info-btn").addEventListener("click", toggleFieldExplanation)

  // Financial autonomy checkbox
  document.getElementById("financial-autonomy-checkbox").addEventListener("change", function () {
    financialAutonomyAccepted = this.checked
    updateProgress()
    updateFinancialStatus()
  })

  // Email form
  document.getElementById("email-gate-form").addEventListener("submit", handleEmailSubmit)

  // Reset button
  document.getElementById("reset-btn").addEventListener("click", resetCalculator)

  // Download button
  document.getElementById("download-btn").addEventListener("click", downloadResults)
}

// Handle option button clicks
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

  // Update button states
  document.querySelectorAll(`[data-field="${field}"]`).forEach((otherBtn) => {
    otherBtn.classList.remove("active")
  })
  btn.classList.add("active")

  // Update calculations
  calculateTotal()
  updateScoreDisplay()
  updateProgress()
  updateHiddenFields()
}

// Handle age input
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

  calculateTotal()
  updateScoreDisplay()
  updateProgress()
  updateHiddenFields()
}

// Toggle field explanation
function toggleFieldExplanation() {
  const fieldExplanation = document.getElementById("field-explanation")
  const isVisible = fieldExplanation.style.display !== "none"
  fieldExplanation.style.display = isVisible ? "none" : "block"
}

// Toggle spouse section
function toggleSpouseSection() {
  const spouseSection = document.getElementById("spouse-section")
  spouseSection.style.display = hasSpouse ? "block" : "none"
}

// Navigation functions
function goToStep(step) {
  if (step >= 0 && step < 6) {
    currentStep = step
    updateDisplay()
    scrollToTop()
    // Hide navigation buttons on results step
    const navButtons = document.getElementById("navigation-buttons")
    navButtons.style.display = step === 5 ? "none" : "flex"
  }
}

function previousStep() {
  if (currentStep > 0) {
    goToStep(currentStep - 1)
  }
}

function nextStep() {
  if (currentStep < 5) {
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

// Update display
function updateDisplay() {
  // Update step panels
  document.querySelectorAll(".step-panel").forEach((panel, index) => {
    panel.classList.toggle("active", index === currentStep)
  })

  // Update navigation buttons
  document.querySelectorAll(".nav-btn-mobile, .nav-btn-desktop").forEach((btn, index) => {
    btn.classList.toggle("active", index === currentStep)
  })

  // Update step indicator
  document.getElementById("step-indicator").textContent = `${currentStep + 1} / 6`

  // Update navigation button states
  document.getElementById("prev-btn").disabled = currentStep === 0
  document.getElementById("next-btn").disabled = currentStep === 5

  const nextBtn = document.getElementById("next-btn")
  if (currentStep === 4) {
    nextBtn.textContent = "Voir les résultats →"
  } else {
    nextBtn.textContent = "Suivant →"
  }
}

// Calculate total score
function calculateTotal() {
  totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
}

// Update score display
function updateScoreDisplay() {
  // Individual scores
  const elements = {
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

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = `${value} pts`
    }
  })

  // French total
  const frenchTotal =
    scores.frenchOralComprehension +
    scores.frenchOralProduction +
    scores.frenchWrittenComprehension +
    scores.frenchWrittenProduction

  const frenchTotalElement = document.getElementById("score-french-total")
  if (frenchTotalElement) {
    frenchTotalElement.textContent = `${frenchTotal} pts`
  }

  // English total
  const englishTotal =
    scores.englishOralComprehension +
    scores.englishOralProduction +
    scores.englishWrittenComprehension +
    scores.englishWrittenProduction

  const englishTotalElement = document.getElementById("score-english-total")
  if (englishTotalElement) {
    englishTotalElement.textContent = `${englishTotal} pts`
  }

  // Total score with color
  const totalScoreElement = document.getElementById("total-score")
  if (totalScoreElement) {
    totalScoreElement.textContent = `${totalScore} points`
    // Update total score color
    totalScoreElement.className = "total-score-text"
    if (totalScore < 300) {
      totalScoreElement.classList.add("red")
    } else if (totalScore < 600) {
      totalScoreElement.classList.add("yellow")
    } else {
      totalScoreElement.classList.add("green")
    }
  }
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

  const totalScoreField = document.getElementById("arrima_score_total")
  if (totalScoreField) {
    totalScoreField.value = totalScore
  }

  const languageScoreField = document.getElementById("arrima_score_language")
  if (languageScoreField) {
    languageScoreField.value = frenchTotal + englishTotal
  }

  const jobOfferField = document.getElementById("job_offer_status")
  if (jobOfferField) {
    jobOfferField.value = scores.jobOffer > 0 ? "Yes" : "No"
  }
}

// Update progress
function updateProgress() {
  const maxPossibleScore = 1346
  const pointsProgress = Math.min((totalScore / maxPossibleScore) * 100, 100)

  const progressFill = document.getElementById("progress-fill")
  const progressMessage = document.getElementById("progress-message")

  if (progressFill) {
    progressFill.style.width = `${pointsProgress}%`
  }

  // Update progress color and message
  if (progressFill && progressMessage) {
    progressFill.className = "progress-fill"
    progressMessage.className = "progress-message"

    const minimumRequired = hasSpouse ? 59 : 50

    if (totalScore < minimumRequired) {
      progressMessage.textContent = "Score insuffisant pour soumettre un profil Arrima"
      progressMessage.classList.add("red")
    } else if (totalScore < 300) {
      progressMessage.textContent = "Score minimal atteint, mais des améliorations sont nécessaires"
      progressMessage.classList.add("red")
    } else if (totalScore < 600) {
      progressFill.classList.add("yellow")
      progressMessage.classList.add("yellow")
      progressMessage.textContent = "Bon score ! Vous êtes sur la bonne voie"
    } else {
      progressFill.classList.add("green")
      progressMessage.classList.add("green")
      progressMessage.textContent = "Excellent score ! Profil très compétitif"
    }
  }
}

// Handle email form submission
function handleEmailSubmit(event) {
  event.preventDefault()

  const email = document.getElementById("email-input-field").value
  const privacy = document.getElementById("privacy-checkbox").checked

  if (email && privacy) {
    // Update hidden fields before submission
    updateHiddenFields()

    showResults = true
    document.getElementById("email-form-container").style.display = "none"
    const resultsContent = document.getElementById("results-content")
    resultsContent.style.display = "block"
    resultsContent.classList.add("show")
    document.getElementById("recommendations").style.display = "block"

    updateFinancialStatus()
    generateRecommendations()
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

// Generate recommendations
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
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points, vos chances d'invitation sont TRÈS ÉLEVÉES. Les candidats avec une offre d'emploi validée sont souvent priorisés, surtout si elle est hors de la CMM.`
    } else if (totalScore >= 600) {
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points, vos chances d'invitation sont ÉLEVÉES. Votre offre d'emploi vous donne un avantage significatif.`
    } else {
      scoreInterpretation = `Avec une offre d'emploi validée et un score total de ${totalScore} points, vos chances d'invitation sont MODÉRÉES. Bien que l'offre d'emploi soit un atout, il serait bénéfique d'améliorer d'autres aspects de votre profil.`
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
          <span>${rec.icon}</span>
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
        <span>🎉</span>
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
    document.getElementById("age-input").value = ""
    document.getElementById("financial-autonomy-checkbox").checked = false
    document.getElementById("spouse-section").style.display = "none"
    document.getElementById("field-explanation").style.display = "none"
    document.getElementById("email-form-container").style.display = "block"
    document.getElementById("results-content").style.display = "none"
    document.getElementById("results-content").classList.remove("show")

    // Reset form
    document.getElementById("email-gate-form").reset()

    // Set default active states
    document.querySelector('[data-field="hasSpouse"][data-value="false"]').classList.add("active")

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
    const downloadBtn = document.getElementById("download-btn")
    const originalText = downloadBtn.textContent
    downloadBtn.textContent = "Génération de l'image..."
    downloadBtn.disabled = true

    // Check if html2canvas is available
    if (!window.html2canvas) {
      throw new Error("html2canvas library not loaded")
    }

    // Get the score breakdown area which contains everything we want to capture
    const scoreBreakdownArea = document.getElementById("score-breakdown-area")
    if (!scoreBreakdownArea) {
      throw new Error("Score breakdown area not found")
    }

    // Configure html2canvas options for high quality
    const options = {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: scoreBreakdownArea.scrollWidth,
      height: scoreBreakdownArea.scrollHeight,
      logging: false,
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
        }
      },
      "image/jpeg",
      0.95,
    )

    // Reset button
    downloadBtn.textContent = originalText
    downloadBtn.disabled = false
  } catch (error) {
    console.error("Error generating screenshot:", error)
    alert("Erreur lors de la génération de l'image. Veuillez réessayer.")

    // Reset button
    const downloadBtn = document.getElementById("download-btn")
    downloadBtn.textContent = "📥 Télécharger les résultats"
    downloadBtn.disabled = false
  }
}
