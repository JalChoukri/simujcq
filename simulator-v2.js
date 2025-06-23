// =======================================================================
// ▼▼▼ CONFIGURATION - METTEZ VOTRE URL DE WEBHOOK ICI ▼▼▼
// =======================================================================
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_UNIQUE_WEBHOOK_URL_HERE';
// =======================================================================
// ▲▲▲ FIN DE LA CONFIGURATION ▲▲▲
// =======================================================================


// This variable will hold the final numerical score.
let finalNumericScore = 0;

// Define the qualitative score tiers for the sticky bar
const scoreTiers = [
    { threshold: 0, text: "Début", className: 'status-low' },
    { threshold: 450, text: "Amélioration Nécessaire", className: 'status-low' },
    { threshold: 550, text: "Score passable", className: 'status-medium' },
    { threshold: 600, text: "Bon score", className: 'status-good' },
    { threshold: 700, text: "Excellent profil", className: 'status-excellent' }
];

// This function needs to be your complete, original score calculation logic.
// It should read all the values from your form and return the total score as a number.
function calculatePoints() {
    // --- ▼▼▼ PASTE YOUR ENTIRE EXISTING SCORE CALCULATION LOGIC HERE ▼▼▼ ---
    // Make sure it reads all the values from the form inputs by their IDs 
    // (e.g., document.getElementById('age_dp').value) and returns a final number.
    // NOTE: I am adding basic error handling (try/catch) in case an element doesn't exist.
    
    let totalScore = 0;
    try {
      const ageInput = document.getElementById('age_dp');
      if (ageInput && ageInput.value) {
          // Your logic for converting age to points goes here
          // Example:
          const age = parseInt(ageInput.value, 10);
          if(age >= 18 && age <= 30) totalScore += 130;
          // ... etc
      }
    } catch(e) { /* ignore error if element not found */ }

    // --- You would repeat this for every single input field ---
    // For radio buttons, the logic might look like this:
    try {
        const selectedRadio = document.querySelector('input[name="fr_co_radio_dp"]:checked');
        if(selectedRadio){
            const selectedKey = selectedRadio.value;
            // Your logic to find the points for this key goes here...
            // totalScore += points;
        }
    } catch(e) { /* ignore error if element not found */ }


    return totalScore;
    // --- ▲▲▲ END OF YOUR CALCULATION LOGIC ▲▲▲ ---
}

// This function updates the dynamic sticky bar with the qualitative score
function updateStickyBar() {
    const score = calculatePoints();
    finalNumericScore = score; // Store the real score globally

    const stickyScoreElement = document.getElementById('sticky_arrima_score');
    const stickyStatusElement = document.getElementById('sticky_overall_status');
    const tierBar = document.getElementById('compact_score_tier_bar');

    let currentTier = scoreTiers[0];
    for (let i = scoreTiers.length - 1; i >= 0; i--) {
        if (score >= scoreTiers[i].threshold) {
            currentTier = scoreTiers[i];
            break;
        }
    }

    if (stickyScoreElement && stickyStatusElement && tierBar) {
        stickyScoreElement.textContent = "Profil :";
        stickyStatusElement.textContent = currentTier.text;
        
        const allStatusClasses = scoreTiers.map(t => t.className);
        stickyStatusElement.classList.remove(...allStatusClasses);
        stickyStatusElement.classList.add(currentTier.className);
        
        const percentage = Math.min((score / 800) * 100, 100); // Assuming 800 is a high score
        tierBar.style.width = `${percentage}%`;
        
        tierBar.classList.remove(...allStatusClasses);
        tierBar.classList.add(currentTier.className);
    }
}


// This function handles the email submission and reveals the score
function handleRevealScore() {
    const emailInput = document.getElementById('user-email-input');
    const formMessage = document.getElementById('form-message');
    const email = emailInput.value;

    formMessage.textContent =
