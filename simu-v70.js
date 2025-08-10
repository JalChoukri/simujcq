/**
 * Arrima Calculator - Clean and Optimized Version
 * Calculates Quebec immigration scores based on user input
 */

class ArrimaCalculator {
  constructor() {
    // State management
    this.currentStep = 0
    this.totalSteps = 6
    this.showResults = false

    // Score tracking
    this.scores = {
      age: 0,
      frenchOralComp: 0,
      frenchOralProd: 0,
      frenchWrittenComp: 0,
      frenchWrittenProd: 0,
      englishLevel: 0,
      quebecDiploma: 0,
      quebecWork: 0,
      jobOffer: 0,
      children: 0,
    }

    // User data
    this.userData = {
      maritalStatus: "single",
      age: 0,
      email: "",
    }

    // DOM elements cache
    this.elements = {}

    // Initialize
    this.init()
  }

  /**
   * Initialize the calculator
   */
  init() {
    this.cacheElements()
    this.bindEvents()
    this.updateUI()
    this.initializeGTM()

    console.log("Arrima Calculator initialized")
  }

  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    this.elements = {
      // Navigation
      navSteps: document.querySelectorAll(".nav-step"),
      currentStepIndicator: document.getElementById("current-step"),

      // Step panels
      stepPanels: document.querySelectorAll(".step-panel"),

      // Navigation controls
      prevBtn: document.getElementById("prev-btn"),
      nextBtn: document.getElementById("next-btn"),

      // Form inputs
      ageInput: document.getElementById("age-input"),
      emailInput: document.getElementById("email-input"),
      privacyCheckbox: document.getElementById("privacy-checkbox"),
      emailForm: document.getElementById("email-form"),

      // Results
      emailFormContainer: document.getElementById("email-form-container"),
      resultsContent: document.getElementById("results-content"),
      finalScore: document.getElementById("final-score"),
      scoreInterpretation: document.getElementById("score-interpretation"),

      // Action buttons
      resetBtn: document.getElementById("reset-btn"),
      downloadBtn: document.getElementById("download-btn"),

      // Progress
      progressFill: document.getElementById("progress-fill"),
      progressScore: document.getElementById("progress-score"),
      progressMessage: document.getElementById("progress-message"),

      // Hidden fields
      totalScoreHidden: document.getElementById("total-score-hidden"),
      languageScoreHidden: document.getElementById("language-score-hidden"),
      hasJobOfferHidden: document.getElementById("has-job-offer-hidden"),
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Navigation steps
    this.elements.navSteps.forEach((step, index) => {
      step.addEventListener("click", () => this.goToStep(index))
    })

    // Navigation controls
    this.elements.prevBtn.addEventListener("click", () => this.previousStep())
    this.elements.nextBtn.addEventListener("click", () => this.nextStep())

    // Age input
    this.elements.ageInput.addEventListener("input", (e) => this.handleAgeInput(e))

    // Option buttons (marital status, job offer, etc.)
    document.addEventListener("click", (e) => {
      if (e.target.matches(".option-btn")) {
        this.handleOptionClick(e)
      }
      if (e.target.matches(".skill-btn")) {
        this.handleSkillClick(e)
      }
    })

    // Email form
    this.elements.emailForm.addEventListener("submit", (e) => this.handleEmailSubmit(e))

    // Action buttons
    this.elements.resetBtn.addEventListener("click", () => this.resetCalculator())
    this.elements.downloadBtn.addEventListener("click", () => this.downloadResults())

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyboardNavigation(e))
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    if (e.key === "ArrowLeft" && !this.elements.prevBtn.disabled) {
      this.previousStep()
    } else if (e.key === "ArrowRight" && !this.elements.nextBtn.disabled) {
      this.nextStep()
    }
  }

  /**
   * Navigate to specific step
   */
  goToStep(step) {
    if (step >= 0 && step < this.totalSteps) {
      this.currentStep = step
      this.updateUI()
      this.scrollToTop()

      // GTM tracking
      this.trackEvent("step_navigation", {
        step_number: step + 1,
        step_name: this.getStepName(step),
      })
    }
  }

  /**
   * Go to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1)
    }
  }

  /**
   * Go to next step
   */
  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.goToStep(this.currentStep + 1)
    } else if (this.currentStep === 4) {
      // From "Autres" to "Résultats"
      this.goToStep(5)
    }
  }

  /**
   * Get step name for tracking
   */
  getStepName(step) {
    const names = ["Profil", "Français", "Anglais", "Québec", "Autres", "Résultats"]
    return names[step] || "Unknown"
  }

  /**
   * Handle age input
   */
  handleAgeInput(e) {
    const age = Number.parseInt(e.target.value) || 0
    this.userData.age = age
    this.scores.age = this.calculateAgeScore(age)
    this.updateTotalScore()
  }

  /**
   * Calculate age score based on Quebec immigration rules
   */
  calculateAgeScore(age) {
    if (age < 18) return 0
    if (age <= 30) return 130
    if (age === 31) return 124
    if (age === 32) return 118
    if (age === 33) return 112
    if (age === 34) return 106
    if (age === 35) return 100
    if (age === 36) return 88
    if (age === 37) return 76
    if (age === 38) return 64
    if (age === 39) return 52
    if (age === 40) return 40
    if (age === 41) return 26
    if (age === 42) return 13
    return 0
  }

  /**
   * Handle option button clicks (marital status, job offer, etc.)
   */
  handleOptionClick(e) {
    const button = e.target.closest(".option-btn")
    const field = button.dataset.field
    const value = button.dataset.value

    // Update active state
    const container = button.parentElement
    container.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Update data
    if (field === "maritalStatus") {
      this.userData.maritalStatus = value
    } else if (field in this.scores) {
      this.scores[field] = Number.parseInt(value) || 0
      this.updateTotalScore()
    }
  }

  /**
   * Handle skill button clicks (language levels, education, etc.)
   */
  handleSkillClick(e) {
    const button = e.target.closest(".skill-btn")
    const field = button.dataset.field
    const value = Number.parseInt(button.dataset.value) || 0

    // Update active state
    const container = button.parentElement
    container.querySelectorAll(".skill-btn").forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Update scores
    if (field === "englishLevel") {
      // English level affects all 4 English skills equally
      this.scores.englishLevel = value * 4 // Total for all 4 skills
    } else if (field in this.scores) {
      this.scores[field] = value
    }

    this.updateTotalScore()
  }

  /**
   * Calculate and update total score
   */
  updateTotalScore() {
    const total = Object.values(this.scores).reduce((sum, score) => sum + score, 0)
    this.updateProgressBar(total)
    this.updateHiddenFields(total)
  }

  /**
   * Update progress bar
   */
  updateProgressBar(score) {
    const maxScore = 1346 // Maximum possible score
    const percentage = Math.min((score / maxScore) * 100, 100)

    // Update progress fill
    this.elements.progressFill.style.width = `${percentage}%`
    this.elements.progressScore.textContent = `${score} points`

    // Update colors and message based on score
    let level = "low"
    let message = "Score insuffisant pour soumettre un profil Arrima"

    if (score >= 50 && score < 300) {
      level = "low"
      message = "Score minimal atteint, mais des améliorations sont nécessaires"
    } else if (score >= 300 && score < 600) {
      level = "medium"
      message = "Bon score ! Vous êtes sur la bonne voie"
    } else if (score >= 600) {
      level = "high"
      message = "Excellent score ! Profil très compétitif"
    }

    // Update classes
    this.elements.progressFill.className = `progress-fill ${level}`
    this.elements.progressMessage.className = `progress-message ${level}`
    this.elements.progressMessage.textContent = message
  }

  /**
   * Update hidden form fields for data capture
   */
  updateHiddenFields(totalScore) {
    const languageScore =
      this.scores.frenchOralComp +
      this.scores.frenchOralProd +
      this.scores.frenchWrittenComp +
      this.scores.frenchWrittenProd +
      this.scores.englishLevel

    this.elements.totalScoreHidden.value = totalScore
    this.elements.languageScoreHidden.value = languageScore
    this.elements.hasJobOfferHidden.value = this.scores.jobOffer > 0 ? "true" : "false"
  }

  /**
   * Handle email form submission
   */
  handleEmailSubmit(e) {
    e.preventDefault()

    const email = this.elements.emailInput.value
    const privacyAccepted = this.elements.privacyCheckbox.checked

    if (!email || !privacyAccepted) {
      alert("Veuillez remplir tous les champs requis.")
      return
    }

    this.userData.email = email
    this.showResults = true
    this.displayResults()

    // GTM tracking
    this.trackEvent("email_submitted", {
      email_source: "arrima_calculator",
      total_score: this.getTotalScore(),
      has_spouse: this.userData.maritalStatus === "married",
    })
  }

  /**
   * Display results
   */
  displayResults() {
    const totalScore = this.getTotalScore()

    // Hide email form, show results
    this.elements.emailFormContainer.style.display = "none"
    this.elements.resultsContent.style.display = "block"

    // Update score display
    this.elements.finalScore.textContent = totalScore

    // Update interpretation
    this.updateScoreInterpretation(totalScore)

    // Scroll to results
    this.elements.resultsContent.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Update score interpretation
   */
  updateScoreInterpretation(score) {
    let level = "low"
    let message = ""

    if (score < 50) {
      level = "low"
      message =
        "Votre score actuel ne permet pas de soumettre un profil dans le système Arrima. Il faut un minimum de 50 points pour être éligible."
    } else if (score < 300) {
      level = "low"
      message =
        "Votre score permet de soumettre un profil, mais il est encore faible. Les chances d'invitation sont limitées avec ce score."
    } else if (score < 600) {
      level = "medium"
      message =
        "Votre score est dans la moyenne. Avec quelques améliorations, vous pourriez augmenter vos chances d'être invité."
    } else {
      level = "high"
      message = "Excellent score ! Vous avez un profil très compétitif pour l'immigration au Québec."
    }

    this.elements.scoreInterpretation.className = `score-interpretation ${level}`
    this.elements.scoreInterpretation.innerHTML = `<p>${message}</p>`
  }

  /**
   * Get total score
   */
  getTotalScore() {
    return Object.values(this.scores).reduce((sum, score) => sum + score, 0)
  }

  /**
   * Reset calculator
   */
  resetCalculator() {
    if (!confirm("Êtes-vous sûr de vouloir refaire le test ? Toutes vos données seront perdues.")) {
      return
    }

    // Reset scores
    Object.keys(this.scores).forEach((key) => {
      this.scores[key] = 0
    })

    // Reset user data
    this.userData = {
      maritalStatus: "single",
      age: 0,
      email: "",
    }

    // Reset UI
    this.currentStep = 0
    this.showResults = false

    // Reset form inputs
    this.elements.ageInput.value = ""
    this.elements.emailInput.value = ""
    this.elements.privacyCheckbox.checked = false

    // Reset active buttons
    document.querySelectorAll(".option-btn, .skill-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Set default active buttons
    document.querySelectorAll('[data-value="0"]').forEach((btn) => {
      if (btn.classList.contains("option-btn") || btn.classList.contains("skill-btn")) {
        btn.classList.add("active")
      }
    })

    // Update UI
    this.updateUI()
    this.updateTotalScore()
    this.scrollToTop()

    // GTM tracking
    this.trackEvent("calculator_reset", {
      reset_from_step: this.currentStep + 1,
    })
  }

  /**
   * Download results
   */
  downloadResults() {
    const totalScore = this.getTotalScore()
    const frenchTotal =
      this.scores.frenchOralComp +
      this.scores.frenchOralProd +
      this.scores.frenchWrittenComp +
      this.scores.frenchWrittenProd
    const englishTotal = this.scores.englishLevel

    const htmlContent = this.generateResultsHTML(totalScore, frenchTotal, englishTotal)

    // Create and download file
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Resultats-Arrima-${new Date().toLocaleDateString("fr-CA")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    // GTM tracking
    this.trackEvent("results_download", {
      download_type: "html",
      score_total: totalScore,
      has_spouse: this.userData.maritalStatus === "married",
    })
  }

  /**
   * Generate HTML content for download
   */
  generateResultsHTML(totalScore, frenchTotal, englishTotal) {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Résultats Simulateur Arrima - ${new Date().toLocaleDateString("fr-CA")}</title>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 20px; 
          }
          .header h1 {
            color: #111827;
            margin-bottom: 10px;
          }
          .header p {
            color: #6b7280;
            margin: 5px 0;
          }
          .score-section { 
            margin: 20px 0; 
            padding: 20px; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            background: #f9fafb;
          }
          .total-score { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            text-align: center; 
            margin: 30px 0; 
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .score-item { 
            display: flex; 
            justify-content: space-between; 
            margin: 12px 0; 
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .score-item:last-child {
            border-bottom: none;
          }
          .category-title { 
            font-weight: bold; 
            color: #1d4ed8; 
            margin: 20px 0 15px 0; 
            font-size: 18px;
          }
          .disclaimer {
            margin-top: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            font-size: 14px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Simulateur Arrima Gratuit 2025</h1>
          <p><strong>Par J'arrive Québec - www.jarrivequebec.com</strong></p>
          <p>Résultats générés le ${new Date().toLocaleDateString("fr-CA")} à ${new Date().toLocaleTimeString("fr-CA")}</p>
        </div>
        
        <div class="total-score">
          SCORE TOTAL: ${totalScore} points
        </div>
        
        <div class="score-section">
          <div class="category-title">🇫🇷 Compétences linguistiques</div>
          <div class="score-item">
            <span>Français (toutes compétences)</span>
            <span><strong>${frenchTotal} pts</strong></span>
          </div>
          <div class="score-item">
            <span>Anglais (toutes compétences)</span>
            <span><strong>${englishTotal} pts</strong></span>
          </div>
        </div>
        
        <div class="score-section">
          <div class="category-title">👤 Capital humain</div>
          <div class="score-item">
            <span>Âge</span>
            <span><strong>${this.scores.age} pts</strong></span>
          </div>
        </div>
        
        <div class="score-section">
          <div class="category-title">⭐ Facteurs Québec</div>
          <div class="score-item">
            <span>Diplôme du Québec</span>
            <span><strong>${this.scores.quebecDiploma} pts</strong></span>
          </div>
          <div class="score-item">
            <span>Expérience de travail au Québec</span>
            <span><strong>${this.scores.quebecWork} pts</strong></span>
          </div>
        </div>
        
        <div class="score-section">
          <div class="category-title">✅ Facteurs additionnels</div>
          <div class="score-item">
            <span>Offre d'emploi</span>
            <span><strong>${this.scores.jobOffer} pts</strong></span>
          </div>
          <div class="score-item">
            <span>Enfants à charge</span>
            <span><strong>${this.scores.children} pts</strong></span>
          </div>
        </div>
        
        <div class="disclaimer">
          <p><strong>Avertissement important :</strong></p>
          <p>Ce simulateur fournit une estimation basée sur les informations publiques disponibles. Les résultats sont à titre indicatif seulement et peuvent différer des calculs officiels du MIFI (Ministère de l'Immigration, de la Francisation et de l'Intégration).</p>
          <p>Pour des informations officielles et à jour, consultez toujours le site web du gouvernement du Québec.</p>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Update UI based on current state
   */
  updateUI() {
    // Update navigation steps
    this.elements.navSteps.forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep)
    })

    // Update step indicator
    this.elements.currentStepIndicator.textContent = this.currentStep + 1

    // Update step panels
    this.elements.stepPanels.forEach((panel, index) => {
      panel.classList.toggle("active", index === this.currentStep)
    })

    // Update navigation controls
    this.elements.prevBtn.disabled = this.currentStep === 0
    this.elements.nextBtn.disabled = this.currentStep === this.totalSteps - 1

    // Update next button text
    if (this.currentStep === 4) {
      this.elements.nextBtn.innerHTML = 'Voir les résultats <span class="btn-icon">→</span>'
    } else {
      this.elements.nextBtn.innerHTML = 'Suivant <span class="btn-icon">→</span>'
    }

    // Reset results display when entering results step
    if (this.currentStep === 5 && this.showResults) {
      this.elements.emailFormContainer.style.display = "none"
      this.elements.resultsContent.style.display = "block"
    } else if (this.currentStep === 5) {
      this.elements.emailFormContainer.style.display = "block"
      this.elements.resultsContent.style.display = "none"
    }
  }

  /**
   * Scroll to top of page
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /**
   * Initialize Google Tag Manager
   */
  initializeGTM() {
    if (typeof window.dataLayer === "undefined") {
      window.dataLayer = []
    }

    this.trackEvent("calculator_loaded", {
      calculator_type: "arrima",
      page_title: "Simulateur Arrima 2025",
    })
  }

  /**
   * Track events for analytics
   */
  trackEvent(eventName, parameters = {}) {
    if (typeof window.dataLayer !== "undefined") {
      window.dataLayer.push({
        event: eventName,
        ...parameters,
      })
    }

    // Console log for debugging
    console.log("Event tracked:", eventName, parameters)
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ArrimaCalculator()
})

// Performance optimization: Preload resources
document.addEventListener("DOMContentLoaded", () => {
  // Preload html2canvas for potential future use
  const link = document.createElement("link")
  link.rel = "preload"
  link.as = "script"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
  document.head.appendChild(link)
})
