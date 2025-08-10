// Arrima Calculator JavaScript
class ArrimaCalculator {
  constructor() {
    this.currentStep = 0
    this.scores = {
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
    this.hasSpouse = false
    this.showResults = false
    this.financialAutonomyAccepted = false
    this.totalScore = 0
    this.isMobile = window.innerWidth < 768

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateUI()
    this.checkMobile()

    // Initialize GTM data layer
    if (typeof window.dataLayer === "undefined") {
      window.dataLayer = []
    }

    window.dataLayer.push({
      event: "calculator_loaded",
      calculator_type: "arrima",
      page_title: "Simulateur Arrima 2025",
    })
  }

  bindEvents() {
    // Navigation buttons
    document.querySelectorAll(".nav-btn-mobile, .nav-btn-desktop").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const step = Number.parseInt(e.currentTarget.dataset.step)
        this.goToStep(step)
      })
    })

    // Previous/Next buttons
    document.getElementById("prev-btn").addEventListener("click", () => {
      this.goToStep(Math.max(0, this.currentStep - 1))
    })

    document.getElementById("next-btn").addEventListener("click", () => {
      if (this.currentStep === 4) {
        this.goToStep(5)
      } else {
        this.goToStep(Math.min(5, this.currentStep + 1))
      }
    })

    // Age input
    document.getElementById("age-input").addEventListener("input", (e) => {
      const age = Number.parseInt(e.target.value) || 0
      this.calculateAgeScore(age)
    })

    // Spouse toggle
    document.querySelectorAll('[data-field="hasSpouse"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const value = e.currentTarget.dataset.value === "true"
        this.hasSpouse = value
        this.updateSpouseSection()
        this.updateOptionButtons(e.currentTarget.parentElement, e.currentTarget)
      })
    })

    // Email form
    document.getElementById("email-gate-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.showResults = true
      this.updateResultsDisplay()

      // GTM tracking
      window.dataLayer.push({
        event: "email_submitted",
        email_source: "arrima_calculator",
        total_score: this.totalScore,
        has_spouse: this.hasSpouse,
      })
    })

    // Reset button
    document.getElementById("reset-btn").addEventListener("click", () => {
      this.resetCalculator()
    })

    // Download button
    document.getElementById("download-btn").addEventListener("click", () => {
      this.downloadResults()
    })

    // Window resize
    window.addEventListener("resize", () => {
      this.checkMobile()
    })
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768
  }

  goToStep(step) {
    if (step >= 0 && step < 6) {
      this.currentStep = step
      this.updateUI()
      this.scrollToTop()

      if (step === 5) {
        setTimeout(() => {
          this.scrollToResults()
        }, 100)
      }

      // GTM tracking
      window.dataLayer.push({
        event: "step_navigation",
        step_number: step + 1,
        step_name: this.getStepName(step),
      })
    }
  }

  getStepName(step) {
    const names = ["Profil", "Français", "Anglais", "Québec", "Autres", "Résultats"]
    return names[step] || "Unknown"
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  scrollToResults() {
    const resultsContainer = document.getElementById("results-container")
    if (resultsContainer) {
      if (this.isMobile) {
        const elementPosition = resultsContainer.offsetTop
        const offsetPosition = elementPosition - 180
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      } else {
        resultsContainer.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  scrollToProfil() {
    const profilSection = document.getElementById("step-0")
    if (profilSection) {
      if (this.isMobile) {
        const elementPosition = profilSection.offsetTop
        const offsetPosition = elementPosition - 240 // Account for mobile nav height
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      } else {
        profilSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  calculateAgeScore(age) {
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

    this.scores.age = ageScore
    this.updateTotalScore()
  }

  updateSpouseSection() {
    const spouseSection = document.getElementById("spouse-section")
    if (spouseSection) {
      spouseSection.style.display = this.hasSpouse ? "block" : "none"
    }
  }

  updateOptionButtons(container, activeButton) {
    container.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    activeButton.classList.add("active")
  }

  updateTotalScore() {
    this.totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0)
    this.updateProgressBar()
    this.updateHiddenFields()
  }

  updateHiddenFields() {
    // Update hidden form fields for data capture
    const totalField = document.getElementById("arrima_score_total")
    const languageField = document.getElementById("arrima_score_language")
    const jobOfferField = document.getElementById("job_offer_status")

    if (totalField) totalField.value = this.totalScore
    if (languageField) {
      const languageScore =
        this.scores.frenchOralComprehension +
        this.scores.frenchOralProduction +
        this.scores.frenchWrittenComprehension +
        this.scores.frenchWrittenProduction +
        this.scores.englishOralComprehension +
        this.scores.englishOralProduction +
        this.scores.englishWrittenComprehension +
        this.scores.englishWrittenProduction
      languageField.value = languageScore
    }
    if (jobOfferField) jobOfferField.value = this.scores.jobOffer > 0 ? "Yes" : "No"
  }

  updateProgressBar() {
    const progressFill = document.getElementById("progress-fill")
    const progressScore = document.getElementById("progress-score")
    const progressMessage = document.getElementById("progress-message")

    if (progressFill && progressScore && progressMessage) {
      const percentage = Math.min((this.totalScore / 1346) * 100, 100)
      progressFill.style.width = `${percentage}%`
      progressScore.textContent = `${this.totalScore} points`

      // Update colors and messages based on score
      progressFill.className = "progress-fill"
      progressMessage.className = "progress-message"

      if (this.totalScore < 50) {
        progressFill.classList.add("red")
        progressMessage.classList.add("red")
        progressMessage.textContent = "Score insuffisant pour soumettre un profil Arrima"
      } else if (this.totalScore < 300) {
        progressFill.classList.add("red")
        progressMessage.classList.add("red")
        progressMessage.textContent = "Score minimal atteint, mais des améliorations sont nécessaires"
      } else if (this.totalScore < 600) {
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

  updateUI() {
    // Update step panels
    document.querySelectorAll(".step-panel").forEach((panel, index) => {
      panel.classList.toggle("active", index === this.currentStep)
    })

    // Update navigation buttons
    document.querySelectorAll(".nav-btn-mobile, .nav-btn-desktop").forEach((btn, index) => {
      btn.classList.toggle("active", index === this.currentStep)
    })

    // Update navigation controls
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")
    const stepIndicator = document.getElementById("step-indicator")

    if (prevBtn) prevBtn.disabled = this.currentStep === 0
    if (nextBtn) {
      nextBtn.disabled = this.currentStep === 5
      nextBtn.textContent = this.currentStep === 4 ? "Voir les résultats" : "Suivant"

      // Update next button icon
      const nextIcon = nextBtn.querySelector("svg")
      if (nextIcon && this.currentStep !== 4) {
        nextBtn.appendChild(nextIcon)
      }
    }
    if (stepIndicator) stepIndicator.textContent = `${this.currentStep + 1} / 6`

    // Update results display
    if (this.currentStep === 5) {
      this.updateResultsDisplay()
    }
  }

  updateResultsDisplay() {
    const emailContainer = document.getElementById("email-form-container")
    const resultsContent = document.getElementById("results-content")

    if (emailContainer && resultsContent) {
      emailContainer.style.display = this.showResults ? "none" : "block"
      resultsContent.style.display = this.showResults ? "block" : "none"

      if (this.showResults) {
        this.updateScoreDisplay()
        this.updateRecommendations()
      }
    }
  }

  updateScoreDisplay() {
    // Calculate totals
    const frenchTotal =
      this.scores.frenchOralComprehension +
      this.scores.frenchOralProduction +
      this.scores.frenchWrittenComprehension +
      this.scores.frenchWrittenProduction
    const englishTotal =
      this.scores.englishOralComprehension +
      this.scores.englishOralProduction +
      this.scores.englishWrittenComprehension +
      this.scores.englishWrittenProduction

    // Update individual scores
    this.updateScoreElement("score-french-oral-comp", this.scores.frenchOralComprehension)
    this.updateScoreElement("score-french-oral-prod", this.scores.frenchOralProduction)
    this.updateScoreElement("score-french-written-comp", this.scores.frenchWrittenComprehension)
    this.updateScoreElement("score-french-written-prod", this.scores.frenchWrittenProduction)
    this.updateScoreElement("score-french-total", frenchTotal)
    this.updateScoreElement("score-english-total", englishTotal)
    this.updateScoreElement("score-age", this.scores.age)
    this.updateScoreElement("score-education", this.scores.education)
    this.updateScoreElement("score-field", this.scores.fieldOfStudy)
    this.updateScoreElement("score-work", this.scores.workExperience)
    this.updateScoreElement("score-quebec-diploma", this.scores.quebecDiploma)
    this.updateScoreElement("score-quebec-work", this.scores.quebecWorkExperience)
    this.updateScoreElement("score-spouse-french", this.scores.spouseFrenchOral)
    this.updateScoreElement("score-spouse-age", this.scores.spouseAge)
    this.updateScoreElement("score-spouse-education", this.scores.spouseEducation)
    this.updateScoreElement("score-spouse-field", this.scores.spouseFieldOfStudy)
    this.updateScoreElement("score-job-offer", this.scores.jobOffer)
    this.updateScoreElement("score-children", this.scores.children)
    this.updateScoreElement("score-family", this.scores.familyInQuebec)

    // Update total score
    const totalScoreElement = document.getElementById("total-score")
    if (totalScoreElement) {
      totalScoreElement.textContent = `${this.totalScore} points`
      totalScoreElement.className = "total-score-text"

      if (this.totalScore < 300) {
        totalScoreElement.classList.add("red")
      } else if (this.totalScore < 600) {
        totalScoreElement.classList.add("yellow")
      } else {
        totalScoreElement.classList.add("green")
      }
    }
  }

  updateScoreElement(elementId, score) {
    const element = document.getElementById(elementId)
    if (element) {
      element.textContent = `${score} pts`
    }
  }

  updateRecommendations() {
    const recommendationsSection = document.getElementById("recommendations")
    const scoreInterpretation = document.getElementById("score-interpretation")
    const recommendationsList = document.getElementById("recommendations-list")

    if (recommendationsSection && scoreInterpretation && recommendationsList) {
      recommendationsSection.style.display = "block"

      // Score interpretation
      let interpretation = ""
      if (this.totalScore < 50) {
        interpretation =
          "Votre score actuel ne permet pas de soumettre un profil dans le système Arrima. Il faut un minimum de 50 points pour être éligible."
      } else if (this.totalScore < 300) {
        interpretation =
          "Votre score permet de soumettre un profil, mais il est encore faible. Les chances d'invitation sont limitées avec ce score."
      } else if (this.totalScore < 600) {
        interpretation =
          "Votre score est dans la moyenne. Avec quelques améliorations, vous pourriez augmenter vos chances d'être invité."
      } else {
        interpretation = "Excellent score ! Vous avez un profil très compétitif pour l'immigration au Québec."
      }

      scoreInterpretation.innerHTML = `<p>${interpretation}</p>`

      // Generate recommendations
      const recommendations = this.generateRecommendations()
      recommendationsList.innerHTML = recommendations
        .map(
          (rec) => `
                <div class="recommendation-item">
                    <svg class="recommendation-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div class="recommendation-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                    </div>
                </div>
            `,
        )
        .join("")
    }
  }

  generateRecommendations() {
    const recommendations = []

    // French language recommendations
    const frenchTotal =
      this.scores.frenchOralComprehension +
      this.scores.frenchOralProduction +
      this.scores.frenchWrittenComprehension +
      this.scores.frenchWrittenProduction
    if (frenchTotal < 200) {
      recommendations.push({
        title: "Améliorer votre français",
        description:
          "Votre score en français peut être amélioré. Considérez prendre des cours ou passer un test de français reconnu.",
      })
    }

    // Age recommendations
    if (this.scores.age < 100) {
      recommendations.push({
        title: "Facteur âge",
        description: "Les points pour l'âge diminuent avec le temps. Si possible, soumettez votre demande rapidement.",
      })
    }

    // Education recommendations
    if (this.scores.education < 100) {
      recommendations.push({
        title: "Niveau d'éducation",
        description: "Considérez obtenir un diplôme d'études supérieures pour augmenter vos points.",
      })
    }

    // Work experience recommendations
    if (this.scores.workExperience < 50) {
      recommendations.push({
        title: "Expérience de travail",
        description: "Accumulez plus d'expérience de travail dans votre domaine pour augmenter vos points.",
      })
    }

    // Quebec factors
    if (this.scores.quebecDiploma === 0 && this.scores.quebecWorkExperience === 0) {
      recommendations.push({
        title: "Expérience au Québec",
        description: "Considérez étudier ou travailler au Québec pour obtenir des points additionnels importants.",
      })
    }

    return recommendations.slice(0, 3) // Limit to top 3 recommendations
  }

  resetCalculator() {
    if (confirm("Êtes-vous sûr de vouloir refaire le test ? Toutes vos données seront perdues.")) {
      // Reset all scores
      Object.keys(this.scores).forEach((key) => {
        this.scores[key] = 0
      })

      // Reset state variables
      this.currentStep = 0
      this.hasSpouse = false
      this.showResults = false
      this.financialAutonomyAccepted = false
      this.totalScore = 0

      // Reset form inputs
      document.getElementById("age-input").value = ""
      document.getElementById("email-input-field").value = ""
      document.getElementById("privacy-checkbox").checked = false

      // Reset spouse buttons
      document.querySelectorAll('[data-field="hasSpouse"]').forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === "false")
      })

      // Update UI
      this.updateUI()
      this.updateTotalScore()

      // Go to Profil section and scroll to top
      setTimeout(() => {
        this.scrollToProfil()
      }, 100)

      // GTM tracking
      window.dataLayer.push({
        event: "calculator_reset",
        reset_from_step: this.currentStep + 1,
      })
    }
  }

  downloadResults() {
    try {
      // Check if html2canvas is available
      if (typeof window.html2canvas === "undefined") {
        // Load html2canvas dynamically
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        script.onload = () => this.downloadResultsWithCanvas()
        document.head.appendChild(script)
        return
      }
      this.downloadResultsWithCanvas()
    } catch (error) {
      console.error("Error downloading results:", error)
      this.downloadResultsAsHTML()
    }
  }

  downloadResultsWithCanvas() {
    const resultsContainer = document.getElementById("results-container")
    if (!resultsContainer) {
      alert("Aucun résultat à télécharger.")
      return
    }

    // Show loading state
    const downloadBtn = document.getElementById("download-btn")
    const originalText = downloadBtn.innerHTML
    downloadBtn.innerHTML =
      '<svg class="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Génération...'
    downloadBtn.disabled = true

    const options = {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: resultsContainer.scrollWidth,
      height: resultsContainer.scrollHeight,
    }

    window
      .html2canvas(resultsContainer, options)
      .then((canvas) => {
        const link = document.createElement("a")
        link.download = `Resultats-Arrima-${new Date().toLocaleDateString("fr-CA")}.png`
        link.href = canvas.toDataURL("image/png", 1.0)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // GTM tracking
        window.dataLayer.push({
          event: "results_download",
          download_type: "image",
          score_total: this.totalScore,
          has_spouse: this.hasSpouse,
        })

        // Reset button
        downloadBtn.innerHTML = originalText
        downloadBtn.disabled = false
      })
      .catch((error) => {
        console.error("Canvas download failed:", error)
        this.downloadResultsAsHTML()

        // Reset button
        downloadBtn.innerHTML = originalText
        downloadBtn.disabled = false
      })
  }

  downloadResultsAsHTML() {
    const frenchTotal =
      this.scores.frenchOralComprehension +
      this.scores.frenchOralProduction +
      this.scores.frenchWrittenComprehension +
      this.scores.frenchWrittenProduction
    const englishTotal =
      this.scores.englishOralComprehension +
      this.scores.englishOralProduction +
      this.scores.englishWrittenComprehension +
      this.scores.englishWrittenProduction

    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Résultats Simulateur Arrima - ${new Date().toLocaleDateString("fr-CA")}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
                    .score-section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
                    .total-score { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
                    .score-item { display: flex; justify-content: space-between; margin: 8px 0; }
                    .category-title { font-weight: bold; color: #1d4ed8; margin: 15px 0 10px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Simulateur Arrima Gratuit 2025</h1>
                    <p>Par J'arrive Québec - www.jarrivequebec.com</p>
                    <p>Résultats générés le ${new Date().toLocaleDateString("fr-CA")}</p>
                </div>
                <div class="total-score">SCORE TOTAL: ${this.totalScore} points</div>
                <div class="score-section">
                    <div class="category-title">Compétences linguistiques</div>
                    <div class="score-item"><span>Français total:</span><span>${frenchTotal} pts</span></div>
                    <div class="score-item"><span>Anglais total:</span><span>${englishTotal} pts</span></div>
                </div>
                <div class="score-section">
                    <div class="category-title">Capital humain</div>
                    <div class="score-item"><span>Âge:</span><span>${this.scores.age} pts</span></div>
                    <div class="score-item"><span>Éducation:</span><span>${this.scores.education} pts</span></div>
                    <div class="score-item"><span>Domaine d'études:</span><span>${this.scores.fieldOfStudy} pts</span></div>
                    <div class="score-item"><span>Expérience de travail:</span><span>${this.scores.workExperience} pts</span></div>
                </div>
            </body>
            </html>
        `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Resultats-Arrima-${new Date().toLocaleDateString("fr-CA")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    // GTM tracking
    window.dataLayer.push({
      event: "results_download",
      download_type: "html",
      score_total: this.totalScore,
      has_spouse: this.hasSpouse,
    })
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ArrimaCalculator()
})

// Performance optimization: Preload critical resources
document.addEventListener("DOMContentLoaded", () => {
  // Preload html2canvas for faster downloads
  const link = document.createElement("link")
  link.rel = "preload"
  link.as = "script"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
  document.head.appendChild(link)
})
