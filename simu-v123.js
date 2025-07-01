const pointsSystem = {
  age: {
    "18-35": 16,
    "36-42": 14,
    "43-45": 12,
    "46-50": 10,
    "51+": 0,
  },
  education: {
    secondary: 2,
    diploma: 6,
    college: 12,
    bachelor: 14,
    bachelor4: 15,
    master: 17,
    phd: 22,
  },
  workExperience: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 10,
    5: 12,
    "6+": 14,
  },
  frenchLevel: {
    none: 0,
    beginner: 1,
    intermediate: 7,
    advanced: 16,
  },
  englishLevel: {
    none: 0,
    beginner: 1,
    intermediate: 2,
    advanced: 6,
  },
  maritalStatus: {
    single: 0,
    married: 3,
    divorced: 0,
    widowed: 0,
  },
  children: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    "4+": 16,
  },
  jobOffer: {
    yes: 14,
    no: 0,
  },
  quebecStay: {
    none: 0,
    tourist: 1,
    student: 5,
    worker: 5,
  },
  quebecEducation: {
    no: 0,
    yes: 5,
  },
}

const categoryNames = {
  age: "Âge",
  education: "Niveau d'éducation",
  workExperience: "Expérience de travail",
  frenchLevel: "Niveau de français",
  englishLevel: "Niveau d'anglais",
  maritalStatus: "État civil",
  children: "Enfants à charge",
  jobOffer: "Offre d'emploi",
  quebecStay: "Séjour au Québec",
  quebecEducation: "Études au Québec",
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("arrimaForm")
  const result = document.getElementById("result")
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const resetBtn = document.querySelector(".reset-btn")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  resetBtn.addEventListener("click", () => {
    form.reset()
    result.classList.add("hidden")
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    calculatePoints()
  })
})

function calculatePoints() {
  const formData = new FormData(document.getElementById("arrimaForm"))
  let totalPoints = 0
  const breakdown = {}

  for (const [category, value] of formData.entries()) {
    if (pointsSystem[category] && pointsSystem[category][value] !== undefined) {
      const points = pointsSystem[category][value]
      breakdown[category] = points
      totalPoints += points
    }
  }

  displayResults(totalPoints, breakdown)

  setTimeout(() => {
    showLeadMagnet()
  }, 3000)
}

function displayResults(totalPoints, breakdown) {
  const resultDiv = document.getElementById("result")
  const totalScoreElement = document.getElementById("totalScore")
  const scoreDetailsElement = document.getElementById("scoreDetails")
  const recommendationElement = document.getElementById("recommendationText")
  const nextStepsElement = document.getElementById("nextStepsList")

  totalScoreElement.textContent = totalPoints

  scoreDetailsElement.innerHTML = ""
  for (const [category, points] of Object.entries(breakdown)) {
    const li = document.createElement("li")
    li.innerHTML = `
            <span class="category-name">${categoryNames[category]}</span>
            <span class="category-points">${points} points</span>
        `
    scoreDetailsElement.appendChild(li)
  }

  let recommendation = ""
  let nextSteps = []

  if (totalPoints >= 50) {
    recommendation =
      "Excellent! Avec " +
      totalPoints +
      " points, vous avez de très bonnes chances d'être invité à présenter une demande d'immigration au Québec. Votre profil est très compétitif."
    nextSteps = [
      "Préparez tous vos documents officiels",
      "Faites traduire vos diplômes si nécessaire",
      "Soumettez votre déclaration d'intérêt dans Arrima",
      "Attendez une invitation du gouvernement du Québec",
    ]
  } else if (totalPoints >= 35) {
    recommendation =
      "Bien! Avec " +
      totalPoints +
      " points, vous avez des chances raisonnables d'être invité. Considérez améliorer certains aspects de votre profil pour augmenter vos chances."
    nextSteps = [
      "Améliorez votre niveau de français",
      "Recherchez une offre d'emploi au Québec",
      "Considérez obtenir une qualification supplémentaire",
      "Soumettez votre déclaration d'intérêt dans Arrima",
    ]
  } else {
    recommendation =
      "Avec " +
      totalPoints +
      " points, vos chances actuelles sont limitées. Il est recommandé d'améliorer significativement votre profil avant de soumettre votre déclaration d'intérêt."
    nextSteps = [
      "Améliorez considérablement votre français",
      "Obtenez plus d'expérience de travail",
      "Considérez poursuivre des études supérieures",
      "Recherchez activement une offre d'emploi au Québec",
      "Consultez un conseiller en immigration",
    ]
  }

  recommendationElement.textContent = recommendation

  nextStepsElement.innerHTML = ""
  nextSteps.forEach((step) => {
    const li = document.createElement("li")
    li.textContent = step
    nextStepsElement.appendChild(li)
  })

  resultDiv.classList.remove("hidden")
  resultDiv.scrollIntoView({ behavior: "smooth" })
}

function showLeadMagnet() {
  const leadMagnet = document.getElementById("leadMagnet")
  leadMagnet.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeLead() {
  const leadMagnet = document.getElementById("leadMagnet")
  leadMagnet.classList.add("hidden")
  document.body.style.overflow = "auto"
}

document.getElementById("leadForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)
  const data = Object.fromEntries(formData)

  console.log("Lead form submitted:", data)

  alert("Merci! Votre guide sera envoyé à votre adresse e-mail dans quelques minutes.")
  closeLead()
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLead()
  }
})

document.getElementById("leadMagnet").addEventListener("click", function (e) {
  if (e.target === this) {
    closeLead()
  }
})
