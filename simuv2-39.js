// Application State
let currentSection = 0
let showResults = false
let disclaimerAccepted = false

// Form Data
const formData = {
  hasSpouse: false,
  frenchOral: "",
  frenchOralProduction: "",
  frenchWritten: "",
  frenchWrittenProduction: "",
  age: "",
  spouseAge: "",
  workExperience: "",
  education: "",
  professionDiagnostic: "",
  professionExperience: "",
  quebecDiploma: "",
  quebecWorkExperience: "",
  residenceOutsideMontreal: "",
  workOutsideMontreal: "",
  studyOutsideMontreal: "",
  jobOffer: "",
  professionAuthorization: false,
  studyWithoutDiploma: "",
  studyStatus: "",
  familyMember: "",
  spouseFrenchOral: "",
  spouseFrenchOralProduction: "",
  spouseFrenchWritten: "",
  spouseFrenchWrittenProduction: "",
  spouseQuebecWork: "",
  spouseEducation: "",
  spouseQuebecDiploma: "",
}

// Sections configuration
const sections = [
  { id: "profil", title: "Profil", icon: "👤" },
  { id: "francais", title: "Français", icon: "🗣️" },
  { id: "formation", title: "Formation", icon: "🎓" },
  { id: "quebec", title: "Québec", icon: "🍁" },
  { id: "emploi", title: "Emploi", icon: "💼" },
  { id: "conjoint", title: "Conjoint", icon: "👫" },
]

// DOM Elements
const disclaimerScreen = document.getElementById("disclaimer-screen")
const mainApp = document.getElementById("main-app")
const disclaimerCheckbox = document.getElementById("disclaimer-checkbox")
const acceptButton = document.getElementById("accept-disclaimer")
const resultsPage = document.getElementById("results-page")
const formPages = document.getElementById("form-pages")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  updateUI()
})

// Event Listeners
function initializeEventListeners() {
  // Disclaimer
  disclaimerCheckbox.addEventListener("change", function () {
    acceptButton.disabled = !this.checked
    if (this.checked) {
      acceptButton.classList.remove("disabled")
    } else {
      acceptButton.classList.add("disabled")
    }
  })

  acceptButton.addEventListener("click", () => {
    if (!disclaimerCheckbox.checked) return
    disclaimerAccepted = true
    disclaimerScreen.style.display = "none"
    mainApp.style.display = "block"
    updateUI()
  })

  // Navigation
  document.querySelectorAll(".nav-button, .mobile-nav-button").forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.dataset.section
      if (section === "results") {
        showResults = true
      } else {
        currentSection = Number.parseInt(section)
        showResults = false
      }
      updateUI()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  // Form navigation
  document.getElementById("prev-button").addEventListener("click", () => {
    if (currentSection > 0) {
      currentSection--
      updateUI()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  })

  document.getElementById("next-button").addEventListener("click", () => {
    if (currentSection < sections.length - 1) {
      currentSection++
      updateUI()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  })

  document.getElementById("calculate-button").addEventListener("click", () => {
    showResults = true
    updateUI()
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  // Results actions
  document.getElementById("download-results").addEventListener("click", downloadResults)
  document.getElementById("reset-calculator").addEventListener("click", resetCalculator)

  // Form inputs
  setupFormInputs()

  // Email form
  document.getElementById("email-form").addEventListener("submit", (e) => {
    e.preventDefault()
    const emailInput = document.getElementById("email-input")
    if (!emailInput.validity.valid) {
      alert("Veuillez entrer une adresse courriel valide.")
      return
    }
    alert("Merci ! Vous recevrez bientôt votre guide PDF gratuit.")
    emailInput.value = ""
  })
}

// Setup form inputs
function setupFormInputs() {
  // Spouse status
  document.querySelectorAll('input[name="hasSpouse"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      formData.hasSpouse = this.value === "true"
      updateSpouseRelatedUI()
      calculateAndUpdateScore()
    })
  })

  // Age
  document.getElementById("age").addEventListener("change", function () {
    formData.age = this.value
    calculateAndUpdateScore()
  })

  document
    .getElementById("spouseAge")
    .addEventListener("change", function () {
      formData.spouseAge = this.value
      calculateAndUpdateScore()
    })

  // French skills
  ;["frenchOral", "frenchOralProduction", "frenchWritten", "frenchWrittenProduction"].forEach((field) => {
    document.getElementById(field).addEventListener("change", function () {
      formData[field] = this.value
      calculateAndUpdateScore()
    })
  })

  // Education and work experience
  ;["education", "workExperience"].forEach((field) => {
    document.getElementById(field).addEventListener("change", function () {
      formData[field] = this.value
      calculateAndUpdateScore()
    })
  })

  // Quebec factors
  ;[
    "quebecDiploma",
    "quebecWorkExperience",
    "residenceOutsideMontreal",
    "workOutsideMontreal",
    "studyOutsideMontreal",
    "familyMember",
  ].forEach((field) => {
    document.getElementById(field).addEventListener("change", function () {
      formData[field] = this.value
      calculateAndUpdateScore()
    })
  })

  // Study status and duration
  document.getElementById("studyStatus").addEventListener("change", function () {
    formData.studyStatus = this.value
    const durationGroup = document.getElementById("study-duration-group")
    if (this.value && this.value !== "aucun") {
      durationGroup.style.display = "block"
      updateStudyDurationOptions()
    } else {
      durationGroup.style.display = "none"
      formData.studyWithoutDiploma = ""
    }
    calculateAndUpdateScore()
  })

  document
    .getElementById("studyWithoutDiploma")
    .addEventListener("change", function () {
      formData.studyWithoutDiploma = this.value
      calculateAndUpdateScore()
    })

  // Employment factors
  ;["professionDiagnostic", "professionExperience", "jobOffer"].forEach((field) => {
    document.getElementById(field).addEventListener("change", function () {
      formData[field] = this.value
      updateProfessionPoints()
      calculateAndUpdateScore()
    })
  })

  // Professional authorization
  document
    .querySelectorAll('input[name="professionAuthorization"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        formData.professionAuthorization = this.value === "true"
        calculateAndUpdateScore()
      })
    })

  // Spouse factors
  ;[
    "spouseFrenchOral",
    "spouseFrenchOralProduction",
    "spouseFrenchWritten",
    "spouseFrenchWrittenProduction",
    "spouseQuebecWork",
    "spouseEducation",
    "spouseQuebecDiploma",
  ].forEach((field) => {
    const element = document.getElementById(field)
    if (element) {
      element.addEventListener("change", function () {
        formData[field] = this.value
        calculateAndUpdateScore()
      })
    }
  })
}

// Update UI based on current state
function updateUI() {
  if (!disclaimerAccepted) return

  // Update navigation
  updateNavigation()

  // Show/hide pages
  if (showResults) {
    resultsPage.style.display = "block"
    formPages.style.display = "none"
    calculateAndUpdateScore()
  } else {
    resultsPage.style.display = "none"
    formPages.style.display = "block"
    updateFormPage()
  }
}

// Update navigation state
function updateNavigation() {
  // Desktop navigation
  document.querySelectorAll(".nav-button").forEach((button, index) => {
    button.classList.remove("active")
    if (showResults && button.dataset.section === "results") {
      button.classList.add("active")
    } else if (!showResults && Number.parseInt(button.dataset.section) === currentSection) {
      button.classList.add("active")
    }
  })

  // Mobile navigation
  document.querySelectorAll(".mobile-nav-button").forEach((button, index) => {
    button.classList.remove("active")
    if (showResults && button.dataset.section === "results") {
      button.classList.add("active")
    } else if (!showResults && Number.parseInt(button.dataset.section) === currentSection) {
      button.classList.add("active")
    }
  })

  // Auto-scroll mobile navigation
  if (!showResults) {
    const mobileNavScroll = document.getElementById("mobile-nav-scroll")
    const activeButton = mobileNavScroll.children[currentSection]
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }
}

// Update form page
function updateFormPage() {
  // Update section title and progress
  document.getElementById("section-icon").textContent = sections[currentSection].icon
  document.getElementById("section-name").textContent = sections[currentSection].title
  document.getElementById("progress-fill").style.width = `${((currentSection + 1) / sections.length) * 100}%`
  document.getElementById("progress-text").textContent = `Section ${currentSection + 1} sur ${sections.length}`

  // Show/hide sections
  document.querySelectorAll(".form-section").forEach((section, index) => {
    section.classList.remove("active")
    if (index === currentSection) {
      section.classList.add("active")
    }
  })

  // Update navigation buttons
  const prevButton = document.getElementById("prev-button")
  const nextButton = document.getElementById("next-button")
  const calculateButton = document.getElementById("calculate-button")

  prevButton.disabled = currentSection === 0

  if (currentSection < sections.length - 1) {
    nextButton.style.display = "flex"
    calculateButton.style.display = "none"
  } else {
    nextButton.style.display = "none"
    calculateButton.style.display = "flex"
  }

  // Update spouse-related UI
  updateSpouseRelatedUI()
}

// Update spouse-related UI elements
function updateSpouseRelatedUI() {
  const spouseAgeGroup = document.getElementById("spouse-age-group")
  const spouseContent = document.getElementById("spouse-content")
  const noSpouseContent = document.getElementById("no-spouse-content")

  // Show/hide spouse age in profile section
  if (formData.hasSpouse) {
    spouseAgeGroup.style.display = "block"
  } else {
    spouseAgeGroup.style.display = "none"
    formData.spouseAge = ""
  }

  // Show/hide spouse section content
  if (currentSection === 5) {
    // Conjoint section
    if (formData.hasSpouse) {
      spouseContent.style.display = "block"
      noSpouseContent.style.display = "none"
    } else {
      spouseContent.style.display = "none"
      noSpouseContent.style.display = "block"
    }
  }

  // Update max points displays based on spouse status
  updateMaxPointsDisplays()

  // Update age options based on spouse status
  updateAgeOptions()

  // Update French options based on spouse status
  updateFrenchOptions()

  // Update education options based on spouse status
  updateEducationOptions()

  // Update work experience options based on spouse status
  updateWorkExperienceOptions()
}

// Update max points displays
function updateMaxPointsDisplays() {
  document.getElementById("age-max-points").textContent = formData.hasSpouse ? "100 points" : "120 points"
  document.getElementById("french-max-points").textContent = formData.hasSpouse ? "160 points" : "200 points"
  document.getElementById("education-max-points").textContent = formData.hasSpouse ? "110 points" : "130 points"
  document.getElementById("work-experience-max-points").textContent = formData.hasSpouse ? "50 points" : "70 points"
}

// Update age options
function updateAgeOptions() {
  const ageSelect = document.getElementById("age")
  const currentValue = ageSelect.value

  const ageOptions = formData.hasSpouse
    ? {
        "18-19": "18 à 19 ans (90 points)",
        "20-30": "20 à 30 ans (100 points)",
        31: "31 ans (95 points)",
        32: "32 ans (90 points)",
        33: "33 ans (81 points)",
        34: "34 ans (72 points)",
        35: "35 ans (68 points)",
        36: "36 ans (63 points)",
        37: "37 ans (59 points)",
        38: "38 ans (54 points)",
        39: "39 ans (50 points)",
        40: "40 ans (45 points)",
        41: "41 ans (36 points)",
        42: "42 ans (27 points)",
        43: "43 ans (18 points)",
        44: "44 ans (9 points)",
        "45+": "45 ans ou plus (0 points)",
      }
    : {
        "18-19": "18 à 19 ans (110 points)",
        "20-30": "20 à 30 ans (120 points)",
        31: "31 ans (110 points)",
        32: "32 ans (100 points)",
        33: "33 ans (90 points)",
        34: "34 ans (80 points)",
        35: "35 ans (75 points)",
        36: "36 ans (70 points)",
        37: "37 ans (65 points)",
        38: "38 ans (60 points)",
        39: "39 ans (55 points)",
        40: "40 ans (50 points)",
        41: "41 ans (40 points)",
        42: "42 ans (30 points)",
        43: "43 ans (20 points)",
        44: "44 ans (10 points)",
        "45+": "45 ans ou plus (0 points)",
      }

  // Clear and rebuild options
  ageSelect.innerHTML = '<option value="">Sélectionnez votre tranche d\'âge</option>'
  Object.entries(ageOptions).forEach(([value, text]) => {
    const option = document.createElement("option")
    option.value = value
    option.textContent = text
    ageSelect.appendChild(option)
  })

  // Restore value if it still exists
  if (currentValue && ageOptions[currentValue]) {
    ageSelect.value = currentValue
  }
}

// Update French options
function updateFrenchOptions() {
  const frenchFields = ["frenchOral", "frenchOralProduction", "frenchWritten", "frenchWrittenProduction"]

  frenchFields.forEach((fieldId) => {
    const select = document.getElementById(fieldId)
    const currentValue = select.value

    const frenchOptions = formData.hasSpouse
      ? {
          "1-4": "Niveau 1 à 4 (0 points)",
          "5-6": "Niveau 5 ou 6 (30 points)",
          "7-8": "Niveau 7 ou 8 (35 points)",
          "9-10": "Niveau 9 ou 10 (40 points)",
          "11-12": "Niveau 11 ou 12 (40 points)",
        }
      : {
          "1-4": "Niveau 1 à 4 (0 points)",
          "5-6": "Niveau 5 ou 6 (38 points)",
          "7-8": "Niveau 7 ou 8 (44 points)",
          "9-10": "Niveau 9 ou 10 (50 points)",
          "11-12": "Niveau 11 ou 12 (50 points)",
        }

    // Clear and rebuild options
    select.innerHTML = '<option value="">Sélectionnez votre niveau</option>'
    Object.entries(frenchOptions).forEach(([value, text]) => {
      const option = document.createElement("option")
      option.value = value
      option.textContent = text
      select.appendChild(option)
    })

    // Restore value
    if (currentValue && frenchOptions[currentValue]) {
      select.value = currentValue
    }
  })
}

// Update education options
function updateEducationOptions() {
  const educationSelect = document.getElementById("education")
  const currentValue = educationSelect.value

  const educationOptions = formData.hasSpouse
    ? {
        "secondaire-general": "Secondaire général complété (11 points)",
        "secondaire-pro-600": "Secondaire professionnel 600-899h (Québec) (11 points)",
        "secondaire-pro-900": "Secondaire professionnel 900h+ (Québec) (22 points)",
        "secondaire-pro-1an": "Secondaire professionnel 1 an+ (hors Québec) (22 points)",
        "postsecondaire-general": "Postsecondaire général 2 ans (33 points)",
        "postsecondaire-tech-900": "Postsecondaire technique 900h+ (Québec) (44 points)",
        "postsecondaire-tech-1-2": "Postsecondaire technique 1-2 ans (hors Québec) (44 points)",
        "postsecondaire-tech-3": "Postsecondaire technique 3 ans (66 points)",
        "universitaire-1-1": "Universitaire 1er cycle 1 an (66 points)",
        "universitaire-1-2": "Universitaire 1er cycle 2 ans (77 points)",
        "universitaire-1-3-4": "Universitaire 1er cycle 3-4 ans (88 points)",
        "universitaire-1-5": "Universitaire 1er cycle 5 ans+ (93 points)",
        "universitaire-2-1": "Universitaire 2e cycle 1 an (93 points)",
        "universitaire-2-2": "Universitaire 2e cycle 2 ans+ (99 points)",
        "universitaire-medical": "Universitaire spécialisation médicale 2 ans+ (110 points)",
        "universitaire-3": "Universitaire 3e cycle (110 points)",
      }
    : {
        "secondaire-general": "Secondaire général complété (13 points)",
        "secondaire-pro-600": "Secondaire professionnel 600-899h (Québec) (13 points)",
        "secondaire-pro-900": "Secondaire professionnel 900h+ (Québec) (26 points)",
        "secondaire-pro-1an": "Secondaire professionnel 1 an+ (hors Québec) (26 points)",
        "postsecondaire-general": "Postsecondaire général 2 ans (39 points)",
        "postsecondaire-tech-900": "Postsecondaire technique 900h+ (Québec) (52 points)",
        "postsecondaire-tech-1-2": "Postsecondaire technique 1-2 ans (hors Québec) (52 points)",
        "postsecondaire-tech-3": "Postsecondaire technique 3 ans (78 points)",
        "universitaire-1-1": "Universitaire 1er cycle 1 an (78 points)",
        "universitaire-1-2": "Universitaire 1er cycle 2 ans (91 points)",
        "universitaire-1-3-4": "Universitaire 1er cycle 3-4 ans (104 points)",
        "universitaire-1-5": "Universitaire 1er cycle 5 ans+ (110 points)",
        "universitaire-2-1": "Universitaire 2e cycle 1 an (110 points)",
        "universitaire-2-2": "Universitaire 2e cycle 2 ans+ (117 points)",
        "universitaire-medical": "Universitaire spécialisation médicale 2 ans+ (130 points)",
        "universitaire-3": "Universitaire 3e cycle (130 points)",
      }

  // Clear and rebuild options
  educationSelect.innerHTML = '<option value="">Sélectionnez votre niveau</option>'
  Object.entries(educationOptions).forEach(([value, text]) => {
    const option = document.createElement("option")
    option.value = value
    option.textContent = text
    educationSelect.appendChild(option)
  })

  // Restore value
  if (currentValue && educationOptions[currentValue]) {
    educationSelect.value = currentValue
  }
}

// Update work experience options
function updateWorkExperienceOptions() {
  const workExpSelect = document.getElementById("workExperience")
  const currentValue = workExpSelect.value

  const workExpOptions = formData.hasSpouse
    ? {
        "0-11": "Moins de 12 mois (0 points)",
        "12-23": "12 à 23 mois (15 points)",
        "24-35": "24 à 35 mois (30 points)",
        "36-47": "36 à 47 mois (35 points)",
        "48+": "48 mois et plus (50 points)",
      }
    : {
        "0-11": "Moins de 12 mois (0 points)",
        "12-23": "12 à 23 mois (20 points)",
        "24-35": "24 à 35 mois (40 points)",
        "36-47": "36 à 47 mois (50 points)",
        "48+": "48 mois et plus (70 points)",
      }

  // Clear and rebuild options
  workExpSelect.innerHTML = '<option value="">Sélectionnez la durée</option>'
  Object.entries(workExpOptions).forEach(([value, text]) => {
    const option = document.createElement("option")
    option.value = value
    option.textContent = text
    workExpSelect.appendChild(option)
  })

  // Restore value
  if (currentValue && workExpOptions[currentValue]) {
    workExpSelect.value = currentValue
  }
}

// Update study duration options based on study status
function updateStudyDurationOptions() {
  const studyDurationSelect = document.getElementById("studyWithoutDiploma")
  const studyStatus = formData.studyStatus

  if (!studyStatus || studyStatus === "aucun") return

  const currentValue = studyDurationSelect.value

  // Clear existing options
  studyDurationSelect.innerHTML = '<option value="">Sélectionnez la durée</option>'

  const baseDurations = [
    { value: "0-5", text: "Moins de 6 mois (0 points)" },
    { value: "6-11", text: "6 à 11 mois" },
    { value: "12-23", text: "12 à 23 mois" },
    { value: "24-35", text: "24 à 35 mois" },
    { value: "36-47", text: "36 à 47 mois" },
    { value: "48+", text: "48 mois et plus" },
  ]

  baseDurations.forEach((duration) => {
    const option = document.createElement("option")
    option.value = duration.value

    if (duration.value === "0-5") {
      option.textContent = duration.text
    } else {
      const points = getStudyPoints(studyStatus, duration.value)
      option.textContent = `${duration.text} (${points} points)`
    }

    studyDurationSelect.appendChild(option)
  })

  // Restore value
  if (currentValue) {
    studyDurationSelect.value = currentValue
  }
}

// Get study points based on status and duration
function getStudyPoints(status, duration) {
  const studyScores = {
    termine: { "6-11": 1, "12-23": 3, "24-35": 5, "36-47": 8, "48+": 10 },
    "en-cours": { "6-11": 5, "12-23": 12, "24-35": 18, "36-47": 24, "48+": 30 },
  }

  return studyScores[status]?.[duration] || 0
}

// Update profession points display
function updateProfessionPoints() {
  const diagnostic = formData.professionDiagnostic
  const experience = formData.professionExperience
  const pointsBox = document.getElementById("profession-points")
  const pointsValue = document.getElementById("profession-points-value")

  if (diagnostic && experience) {
    const points = getProfessionPoints(diagnostic, experience)
    pointsValue.textContent = `${points} points`
    pointsBox.style.display = "block"
  } else {
    pointsBox.style.display = "none"
  }
}

// Get profession points
function getProfessionPoints(diagnostic, experience) {
  const professionScores = {
    equilibre: { "0-11": 0, "12-23": 5, "24-35": 10, "36-47": 15, "48-60": 25 },
    "leger-deficit": { "0-11": 0, "12-23": 70, "24-35": 80, "36-47": 90, "48-60": 100 },
    deficit: { "0-11": 0, "12-23": 90, "24-35": 100, "36-47": 110, "48-60": 120 },
  }

  return professionScores[diagnostic]?.[experience] || 0
}

// Calculate score and update displays
function calculateAndUpdateScore() {
  const { totalScore, breakdown } = calculateScore()

  if (showResults) {
    updateResultsDisplay(totalScore, breakdown)
  }
}

// Calculate the total score
function calculateScore() {
  let totalScore = 0
  const breakdown = {}

  // Capital humain - Français (200 points max)
  const frenchScores = {
    "1-4": 0,
    "5-6": formData.hasSpouse ? 30 : 38,
    "7-8": formData.hasSpouse ? 35 : 44,
    "9-10": formData.hasSpouse ? 40 : 50,
    "11-12": formData.hasSpouse ? 40 : 50,
  }

  const frenchOralScore = frenchScores[formData.frenchOral] || 0
  const frenchOralProdScore = frenchScores[formData.frenchOralProduction] || 0
  const frenchWrittenScore = frenchScores[formData.frenchWritten] || 0
  const frenchWrittenProdScore = frenchScores[formData.frenchWrittenProduction] || 0

  const frenchTotal = frenchOralScore + frenchOralProdScore + frenchWrittenScore + frenchWrittenProdScore
  breakdown.french = frenchTotal
  breakdown.frenchOral = frenchOralScore
  breakdown.frenchOralProd = frenchOralProdScore
  breakdown.frenchWritten = frenchWrittenScore
  breakdown.frenchWrittenProd = frenchWrittenProdScore
  totalScore += frenchTotal

  // Capital humain - Âge (120/100 points max)
  const ageScores = formData.hasSpouse
    ? {
        "18-19": 90,
        "20-30": 100,
        31: 95,
        32: 90,
        33: 81,
        34: 72,
        35: 68,
        36: 63,
        37: 59,
        38: 54,
        39: 50,
        40: 45,
        41: 36,
        42: 27,
        43: 18,
        44: 9,
        "45+": 0,
      }
    : {
        "18-19": 110,
        "20-30": 120,
        31: 110,
        32: 100,
        33: 90,
        34: 80,
        35: 75,
        36: 70,
        37: 65,
        38: 60,
        39: 55,
        40: 50,
        41: 40,
        42: 30,
        43: 20,
        44: 10,
        "45+": 0,
      }

  const ageScore = ageScores[formData.age] || 0
  breakdown.age = ageScore
  totalScore += ageScore

  // Capital humain - Expérience (70/50 points max)
  const workExpScores = formData.hasSpouse
    ? {
        "0-11": 0,
        "12-23": 15,
        "24-35": 30,
        "36-47": 35,
        "48+": 50,
      }
    : {
        "0-11": 0,
        "12-23": 20,
        "24-35": 40,
        "36-47": 50,
        "48+": 70,
      }

  const workExpScore = workExpScores[formData.workExperience] || 0
  breakdown.workExperience = workExpScore
  totalScore += workExpScore

  // Capital humain - Scolarité (130/110 points max)
  const educationScores = formData.hasSpouse
    ? {
        "secondaire-general": 11,
        "secondaire-pro-600": 11,
        "secondaire-pro-900": 22,
        "secondaire-pro-1an": 22,
        "postsecondaire-general": 33,
        "postsecondaire-tech-900": 44,
        "postsecondaire-tech-1-2": 44,
        "postsecondaire-tech-3": 66,
        "universitaire-1-1": 66,
        "universitaire-1-2": 77,
        "universitaire-1-3-4": 88,
        "universitaire-1-5": 93,
        "universitaire-2-1": 93,
        "universitaire-2-2": 99,
        "universitaire-medical": 110,
        "universitaire-3": 110,
      }
    : {
        "secondaire-general": 13,
        "secondaire-pro-600": 13,
        "secondaire-pro-900": 26,
        "secondaire-pro-1an": 26,
        "postsecondaire-general": 39,
        "postsecondaire-tech-900": 52,
        "postsecondaire-tech-1-2": 52,
        "postsecondaire-tech-3": 78,
        "universitaire-1-1": 78,
        "universitaire-1-2": 91,
        "universitaire-1-3-4": 104,
        "universitaire-1-5": 110,
        "universitaire-2-1": 110,
        "universitaire-2-2": 117,
        "universitaire-medical": 130,
        "universitaire-3": 130,
      }

  const educationScore = educationScores[formData.education] || 0
  breakdown.education = educationScore
  totalScore += educationScore

  // Facteurs Québec - Diplôme (200 points max)
  const quebecDiplomaScores = {
    aucun: 0,
    "secondaire-general": 20,
    "secondaire-pro-600": 20,
    "secondaire-pro-900": 40,
    "postsecondaire-general": 60,
    "postsecondaire-tech-900": 80,
    "postsecondaire-tech-3": 120,
    "universitaire-1-1": 120,
    "universitaire-1-2": 140,
    "universitaire-1-3-4": 160,
    "universitaire-1-5": 170,
    "universitaire-2-1": 170,
    "universitaire-2-2": 180,
    "universitaire-medical": 200,
    "universitaire-3": 200,
  }

  const quebecDiplomaScore = quebecDiplomaScores[formData.quebecDiploma] || 0
  breakdown.quebecDiploma = quebecDiplomaScore
  totalScore += quebecDiplomaScore

  // Facteurs Québec - Expérience (160 points max)
  const quebecWorkScores = {
    "0-11": 0,
    "12-23": 40,
    "24-35": 80,
    "36-47": 120,
    "48-60": 160,
  }

  const quebecWorkScore = quebecWorkScores[formData.quebecWorkExperience] || 0
  breakdown.quebecWork = quebecWorkScore
  totalScore += quebecWorkScore

  // Facteurs additionnels - Profession
  const professionScore = getProfessionPoints(formData.professionDiagnostic, formData.professionExperience)
  breakdown.profession = professionScore
  totalScore += professionScore

  // Facteurs additionnels - Offre d'emploi (50 points max)
  const jobOfferScores = {
    aucun: 0,
    "exterieur-cmm": 50,
    "interieur-cmm": 30,
  }

  const jobOfferScore = jobOfferScores[formData.jobOffer] || 0
  breakdown.jobOffer = jobOfferScore
  totalScore += jobOfferScore

  // Facteurs additionnels - Autorisation professionnelle (50 points max)
  const authorizationScore = formData.professionAuthorization ? 50 : 0
  breakdown.authorization = authorizationScore
  totalScore += authorizationScore

  // Facteurs additionnels - Études au Québec (30 points max)
  const studyScore = getStudyPoints(formData.studyStatus, formData.studyWithoutDiploma)
  breakdown.study = studyScore
  totalScore += studyScore

  // Facteurs additionnels - Séjour hors CMM (120 points max)
  const outsideMontrealScores = {
    "0-5": 0,
    "6-11": 6,
    "12-23": 16,
    "24-35": 24,
    "36-47": 32,
    "48+": 40,
  }

  const workOutsideScores = {
    "0-5": 0,
    "6-11": 9,
    "12-23": 24,
    "24-35": 36,
    "36-47": 48,
    "48+": 60,
  }

  const studyOutsideScores = {
    "0-5": 0,
    "6-11": 3,
    "12-23": 8,
    "24-35": 12,
    "36-47": 16,
    "48+": 20,
  }

  const residenceOutsideScore = outsideMontrealScores[formData.residenceOutsideMontreal] || 0
  const workOutsideScore = workOutsideScores[formData.workOutsideMontreal] || 0
  const studyOutsideScore = studyOutsideScores[formData.studyOutsideMontreal] || 0

  const outsideMontrealTotal = residenceOutsideScore + workOutsideScore + studyOutsideScore
  breakdown.outsideMontreal = outsideMontrealTotal
  totalScore += outsideMontrealTotal

  // Facteurs additionnels - Famille (10 points max)
  const familyScores = {
    aucun: 0,
    "lie-ressortissant": 10,
    "lie-conjoint": 5,
  }

  const familyScore = familyScores[formData.familyMember] || 0
  breakdown.family = familyScore
  totalScore += familyScore

  // Facteurs conjoint (si applicable)
  if (formData.hasSpouse) {
    // Français conjoint (40 points max)
    const spouseFrenchScores = {
      "1-3": 0,
      4: 4,
      "5-6": 6,
      "7-8": 8,
      "9-10": 10,
      "11-12": 10,
    }

    const spouseFrenchOralScore = spouseFrenchScores[formData.spouseFrenchOral] || 0
    const spouseFrenchOralProdScore = spouseFrenchScores[formData.spouseFrenchOralProduction] || 0
    const spouseFrenchWrittenScore = spouseFrenchScores[formData.spouseFrenchWritten] || 0
    const spouseFrenchWrittenProdScore = spouseFrenchScores[formData.spouseFrenchWrittenProduction] || 0

    const spouseFrenchTotal =
      spouseFrenchOralScore + spouseFrenchOralProdScore + spouseFrenchWrittenScore + spouseFrenchWrittenProdScore
    breakdown.spouseFrench = spouseFrenchTotal
    totalScore += spouseFrenchTotal

    // Âge conjoint (10 points max)
    const spouseAgeScores = {
      "18-19": 10,
      "20-30": 10,
      31: 9,
      32: 8,
      33: 7,
      34: 6,
      35: 5,
      36: 4,
      37: 3,
      38: 2,
      39: 1,
      "40+": 0,
    }

    const spouseAgeScore = spouseAgeScores[formData.spouseAge] || 0
    breakdown.spouseAge = spouseAgeScore
    totalScore += spouseAgeScore

    // Expérience conjoint au Québec (30 points max)
    const spouseQuebecWorkScores = {
      "0-5": 0,
      "6-11": 5,
      "12-23": 10,
      "24-35": 15,
      "36-47": 23,
      "48-60": 30,
    }

    const spouseQuebecWorkScore = spouseQuebecWorkScores[formData.spouseQuebecWork] || 0
    breakdown.spouseQuebecWork = spouseQuebecWorkScore
    totalScore += spouseQuebecWorkScore

    // Scolarité conjoint (20 points max)
    const spouseEducationScores = {
      "secondaire-general": 2,
      "secondaire-pro-600": 2,
      "secondaire-pro-900": 4,
      "secondaire-pro-1an": 4,
      "postsecondaire-general": 6,
      "postsecondaire-tech-900": 8,
      "postsecondaire-tech-1-2": 8,
      "postsecondaire-tech-3": 12,
      "universitaire-1-1": 12,
      "universitaire-1-2": 14,
      "universitaire-1-3-4": 16,
      "universitaire-1-5": 17,
      "universitaire-2-1": 17,
      "universitaire-2-2": 18,
      "universitaire-medical": 20,
      "universitaire-3": 20,
    }

    const spouseEducationScore = spouseEducationScores[formData.spouseEducation] || 0
    breakdown.spouseEducation = spouseEducationScore
    totalScore += spouseEducationScore

    // Diplôme Québec conjoint (30 points max)
    const spouseQuebecDiplomaScores = {
      aucun: 0,
      "secondaire-general": 3,
      "secondaire-pro-600": 3,
      "secondaire-pro-900": 6,
      "postsecondaire-general": 9,
      "postsecondaire-tech-900": 12,
      "postsecondaire-tech-3": 18,
      "universitaire-1-1": 18,
      "universitaire-1-2": 21,
      "universitaire-1-3-4": 24,
      "universitaire-1-5": 25,
      "universitaire-2-1": 25,
      "universitaire-2-2": 27,
      "universitaire-medical": 30,
      "universitaire-3": 30,
    }

    const spouseQuebecDiplomaScore = spouseQuebecDiplomaScores[formData.spouseQuebecDiploma] || 0
    breakdown.spouseQuebecDiploma = spouseQuebecDiplomaScore
    totalScore += spouseQuebecDiplomaScore
  }

  return { totalScore, breakdown }
}

// Update results display
function updateResultsDisplay(totalScore, breakdown) {
  // Update total score
  document.getElementById("total-score").textContent = `${totalScore} points`

  // Update breakdown
  document.getElementById("french-oral").textContent = `${breakdown.frenchOral || 0} pts`
  document.getElementById("french-oral-prod").textContent = `${breakdown.frenchOralProd || 0} pts`
  document.getElementById("french-written").textContent = `${breakdown.frenchWritten || 0} pts`
  document.getElementById("french-written-prod").textContent = `${breakdown.frenchWrittenProd || 0} pts`
  document.getElementById("french-total").textContent = `${breakdown.french || 0} pts`

  document.getElementById("quebec-diploma").textContent = `${breakdown.quebecDiploma || 0} pts`
  document.getElementById("quebec-work").textContent = `${breakdown.quebecWork || 0} pts`

  document.getElementById("age-score").textContent = `${breakdown.age || 0} pts`
  document.getElementById("education-score").textContent = `${breakdown.education || 0} pts`
  document.getElementById("work-experience-score").textContent = `${breakdown.workExperience || 0} pts`

  document.getElementById("job-offer-score").textContent = `${breakdown.jobOffer || 0} pts`
  document.getElementById("family-score").textContent = `${breakdown.family || 0} pts`
  document.getElementById("profession-score").textContent = `${breakdown.profession || 0} pts`
  document.getElementById("authorization-score").textContent = `${breakdown.authorization || 0} pts`
  document.getElementById("study-score").textContent = `${breakdown.study || 0} pts`
  document.getElementById("outside-montreal-score").textContent = `${breakdown.outsideMontreal || 0} pts`

  // Update spouse breakdown
  const spouseBreakdown = document.getElementById("spouse-breakdown")
  if (formData.hasSpouse) {
    spouseBreakdown.style.display = "block"
    document.getElementById("spouse-french-score").textContent = `${breakdown.spouseFrench || 0} pts`
    document.getElementById("spouse-age-score").textContent = `${breakdown.spouseAge || 0} pts`
    document.getElementById("spouse-quebec-work-score").textContent = `${breakdown.spouseQuebecWork || 0} pts`
    document.getElementById("spouse-education-score").textContent = `${breakdown.spouseEducation || 0} pts`
    document.getElementById("spouse-quebec-diploma-score").textContent = `${breakdown.spouseQuebecDiploma || 0} pts`
  } else {
    spouseBreakdown.style.display = "none"
  }
}

// Download results as PDF
function downloadResults() {
  const { totalScore, breakdown } = calculateScore()

  // Create a simple text version for download
  let content = `RÉSULTATS DU CALCULATEUR ARRIMA PSTQ\n`
  content += `Basé sur la grille officielle mise à jour le 2 juillet 2025\n\n`
  content += `SCORE TOTAL: ${totalScore} points sur un maximum de 1400\n\n`

  content += `DÉTAIL DES POINTS:\n\n`

  content += `Compétences linguistiques (français):\n`
  content += `- Compréhension orale: ${breakdown.frenchOral || 0} pts\n`
  content += `- Production orale: ${breakdown.frenchOralProd || 0} pts\n`
  content += `- Compréhension écrite: ${breakdown.frenchWritten || 0} pts\n`
  content += `- Production écrite: ${breakdown.frenchWrittenProd || 0} pts\n`
  content += `- Sous-total français: ${breakdown.french || 0} pts\n\n`

  content += `Facteurs Québec:\n`
  content += `- Diplôme du Québec: ${breakdown.quebecDiploma || 0} pts\n`
  content += `- Expérience de travail au Québec: ${breakdown.quebecWork || 0} pts\n\n`

  content += `Capital humain:\n`
  content += `- Âge: ${breakdown.age || 0} pts\n`
  content += `- Niveau de scolarité: ${breakdown.education || 0} pts\n`
  content += `- Expérience de travail: ${breakdown.workExperience || 0} pts\n\n`

  content += `Facteurs additionnels:\n`
  content += `- Offre d'emploi: ${breakdown.jobOffer || 0} pts\n`
  content += `- Famille proche au Québec: ${breakdown.family || 0} pts\n`
  content += `- Profession: ${breakdown.profession || 0} pts\n`
  content += `- Autorisation professionnelle: ${breakdown.authorization || 0} pts\n`
  content += `- Études au Québec: ${breakdown.study || 0} pts\n`
  content += `- Séjour hors Montréal: ${breakdown.outsideMontreal || 0} pts\n`

  if (formData.hasSpouse) {
    content += `\nFacteurs conjoint:\n`
    content += `- Français conjoint: ${breakdown.spouseFrench || 0} pts\n`
    content += `- Âge conjoint: ${breakdown.spouseAge || 0} pts\n`
    content += `- Expérience conjoint: ${breakdown.spouseQuebecWork || 0} pts\n`
    content += `- Scolarité conjoint: ${breakdown.spouseEducation || 0} pts\n`
    content += `- Diplôme QC conjoint: ${breakdown.spouseQuebecDiploma || 0} pts\n`
  }

  content += `\n\nDISCLAIMER:\n`
  content += `Ce simulateur est un outil d'estimation basé sur la grille officielle du MIFI.\n`
  content += `Il ne constitue pas un avis juridique ou en immigration.\n`
  content += `Pour les informations officielles, consultez le MIFI et l'IRCC.\n`

  // Create and download file
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `resultats-arrima-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Reset calculator
function resetCalculator() {
  if (confirm("Êtes-vous sûr de vouloir recommencer le simulateur ? Toutes vos données seront perdues.")) {
    // Reset form data
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "boolean") {
        formData[key] = key === "hasSpouse" ? false : false
      } else {
        formData[key] = ""
      }
    })

    // Reset form inputs
    document.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0
    })

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = radio.value === "false"
    })

    // Reset state
    currentSection = 0
    showResults = false

    // Update UI
    updateUI()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
