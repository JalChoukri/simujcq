// Global state
let currentStep = 0
let hasSpouse = false
let financialAutonomyAccepted = false

// Scores object
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

// Import html2canvas
const html2canvas = require("html2canvas")

// Initialize the calculator
function init() {
  updateNavigation()
  updateScoreDisplay()
  scrollToTop()
}

// Navigation functions
function goToStep(step) {
  if (step >= 0 && step < 6) {
    currentStep = step
    updateStepDisplay()
    updateNavigation()
    scrollToTop()
  }
}

function nextStep() {
  if (currentStep < 5) {
    currentStep++
    updateStepDisplay()
    updateNavigation()
    scrollToTop()
  }
}

function previousStep() {
  if (currentStep > 0) {
    currentStep--
    updateStepDisplay()
    updateNavigation()
    scrollToTop()
  }
}

function updateStepDisplay() {
  // Hide all step panels
  const panels = document.querySelectorAll(".step-panel")
  panels.forEach((panel) => panel.classList.remove("active"))

  // Show current step panel
  const currentPanel = document.getElementById(`step-${currentStep}`)
  if (currentPanel) {
    currentPanel.classList.add("active")
  }

  // Update navigation buttons visibility
  const navButtons = document.getElementById("navigation-buttons")
  if (currentStep === 5) {
    navButtons.style.display = "none"
  } else {
    navButtons.style.display = "flex"
  }
}

function updateNavigation() {
  // Update navigation button states for BOTH mobile and desktop
  const mobileNavButtons = document.querySelectorAll("#mobile-nav .nav-btn")
  const desktopNavButtons = document.querySelectorAll("#desktop-nav .nav-btn")

  // Update mobile nav buttons
  mobileNavButtons.forEach((btn, index) => {
    if (index === currentStep) {
      btn.classList.add("active")
      console.log("Added active class to mobile button", index) // Debug
    } else {
      btn.classList.remove("active")
    }
  })

  // Update desktop nav buttons
  desktopNavButtons.forEach((btn, index) => {
    if (index === currentStep) {
      btn.classList.add("active")
      console.log("Added active class to desktop button", index) // Debug
    } else {
      btn.classList.remove("active")
    }
  })

  // Update step indicator
  const stepIndicator = document.getElementById("step-indicator")
  if (stepIndicator) {
    stepIndicator.textContent = `${currentStep + 1} / 6`
  }

  // Update navigation buttons
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")

  if (prevBtn) {
    prevBtn.disabled = currentStep === 0
  }

  if (nextBtn) {
    nextBtn.disabled = currentStep === 5
    if (currentStep === 4) {
      nextBtn.textContent = "Voir les résultats →"
    } else {
      nextBtn.textContent = "Suivant →"
    }
  }

  updateStepDisplay()
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Score management functions
function setScore(category, value) {
  scores[category] = value
  updateOptionButtons(category, value)
  updateScoreDisplay()
}

function updateOptionButtons(category, value) {
  const buttons = document.querySelectorAll(`[data-score="${category}"]`)
  buttons.forEach((btn) => {
    if (Number.parseInt(btn.dataset.value) === value) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

function calculateAgeScore(age) {
  age = Number.parseInt(age) || 0
  let ageScore = 0

  if (age < 18) ageScore = 0
  else if (age <= 30) ageScore = 130
  else if (age === 31) ageScore = 124
  else if (age === 32) ageScore = 118
  else if (age === 33) ageScore = 112
  else if (age === 34) ageScore = 106
  else if (age === 35) ageScore = 100
  else if (age === 36) ageScore = 88
  else if (age === 37) ageScore = 76
  else if (age === 38) ageScore = 64
  else if (age === 39) ageScore = 52
  else if (age === 40) ageScore = 40
  else if (age === 41) ageScore = 26
  else if (age === 42) ageScore = 13
  else ageScore = 0

  setScore("age", ageScore)
}

function setHasSpouse(spouse) {
  hasSpouse = spouse
  const spouseSection = document.getElementById("spouse-section")
  const singleBtn = document.getElementById("single-btn")
  const marriedBtn = document.getElementById("married-btn")

  if (hasSpouse) {
    spouseSection.style.display = "block"
    marriedBtn.classList.add("active")
    singleBtn.classList.remove("active")
    document.getElementById("spouse-scores-section").style.display = "block"
  } else {
    spouseSection.style.display = "none"
    singleBtn.classList.add("active")
    marriedBtn.classList.remove("active")
    document.getElementById("spouse-scores-section").style.display = "none"
    // Reset spouse scores
    scores.spouseFrenchOral = 0
    scores.spouseAge = 0
    scores.spouseEducation = 0
    scores.spouseFieldOfStudy = 0
  }
  updateScoreDisplay()
}

function setFinancialAutonomy(accepted) {
  financialAutonomyAccepted = accepted
}

function updateScoreDisplay() {
  // Update individual score displays
  document.getElementById("score-french-oral-comp").textContent = `${scores.frenchOralComprehension} pts`
  document.getElementById("score-french-oral-prod").textContent = `${scores.frenchOralProduction} pts`
  document.getElementById("score-french-written-comp").textContent = `${scores.frenchWrittenComprehension} pts`
  document.getElementById("score-french-written-prod").textContent = `${scores.frenchWrittenProduction} pts`

  const frenchTotal =
    scores.frenchOralComprehension +
    scores.frenchOralProduction +
    scores.frenchWrittenComprehension +
    scores.frenchWrittenProduction
  document.getElementById("score-french-total").textContent = `${frenchTotal} pts`

  const englishTotal =
    scores.englishOralComprehension +
    scores.englishOralProduction +
    scores.englishWrittenComprehension +
    scores.englishWrittenProduction
  document.getElementById("score-english-total").textContent = `${englishTotal} pts`

  document.getElementById("score-age").textContent = `${scores.age} pts`
  document.getElementById("score-education").textContent = `${scores.education} pts`
  document.getElementById("score-field-of-study").textContent = `${scores.fieldOfStudy} pts`
  document.getElementById("score-work-experience").textContent = `${scores.workExperience} pts`
  document.getElementById("score-quebec-diploma").textContent = `${scores.quebecDiploma} pts`
  document.getElementById("score-quebec-work").textContent = `${scores.quebecWorkExperience} pts`
  document.getElementById("score-spouse-french").textContent = `${scores.spouseFrenchOral} pts`
  document.getElementById("score-spouse-age").textContent = `${scores.spouseAge} pts`
  document.getElementById("score-spouse-education").textContent = `${scores.spouseEducation} pts`
  document.getElementById("score-spouse-field").textContent = `${scores.spouseFieldOfStudy} pts`
  document.getElementById("score-job-offer").textContent = `${scores.jobOffer} pts`
  document.getElementById("score-children").textContent = `${scores.children} pts`
  document.getElementById("score-family").textContent = `${scores.familyInQuebec} pts`

  // Calculate and display total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const totalElement = document.getElementById("total-score")
  totalElement.textContent = `${totalScore} points`

  // Keep total score color as black
  totalElement.className = "text-lg md:text-xl font-bold text-black"
}

// Utility functions
function showFieldExplanation() {
  document.getElementById("field-explanation-popup").style.display = "flex"
}

function closeFieldExplanation() {
  document.getElementById("field-explanation-popup").style.display = "none"
}

function resetCalculator() {
  if (confirm("Êtes-vous sûr de vouloir refaire le test ? Toutes vos données seront perdues.")) {
    // Reset all scores
    Object.keys(scores).forEach((key) => {
      scores[key] = 0
    })

    // Reset other state
    currentStep = 0
    hasSpouse = false
    financialAutonomyAccepted = false

    // Reset form elements
    document.getElementById("age").value = ""
    document.getElementById("financial-autonomy").checked = false
    document.getElementById("lead-email").value = ""
    document.getElementById("consent-communications").checked = false
    document.getElementById("consent-privacy").checked = false

    // Reset button states
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Reset spouse section
    setHasSpouse(false)

    // Reset lead magnet
    document.getElementById("lead-form").style.display = "block"
    document.getElementById("success-message").style.display = "none"

    // Update displays
    updateScoreDisplay()
    updateNavigation()
    scrollToTop()
  }
}

async function downloadResults() {
  try {
    const element = document.getElementById("score-breakdown")
    if (!element) {
      alert("Aucun résultat à télécharger.")
      return
    }

    const options = {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
    }

    const canvas = await html2canvas(element, options)

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
  } catch (error) {
    console.error("Error downloading results:", error)
    alert("Erreur lors du téléchargement. Veuillez réessayer.")
  }
}

function handleLeadMagnetSubmit(event) {
  event.preventDefault()
  document.getElementById("lead-form").style.display = "none"
  document.getElementById("success-message").style.display = "block"
  // Here you would typically send the form data to your backend
}

// Initialize the calculator when the page loads
document.addEventListener("DOMContentLoaded", init)
