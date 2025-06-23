// =======================================================================
// ▼▼▼ CONFIGURATION - METTEZ VOTRE URL DE WEBHOOK ICI ▼▼▼
// =======================================================================
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_UNIQUE_WEBHOOK_URL_HERE';
// =======================================================================
// ▲▲▲ FIN DE LA CONFIGURATION ▲▲▲
// =======================================================================

// This variable will hold the final numerical score.
let finalNumericScore = 0;

// All the data for the simulator questions and points
const D_ARRIMA = {
    maritalStatus: [
        { key: "seul", text: "Je soumets seul(e)", value: "false", icon: "👤" },
        { key: "avec_conjoint", text: "Avec époux/conjoint de fait", value: "true", icon: "👥" }
    ],
    // ... (All your other data like frLangLevelsDP_Oral, educationLevelsDP, etc.)
    // I am pasting your full D_ARRIMA object here for completeness
    frLangLevelsDP_Oral: [ 
        { key: "none_NCLC_1_4_o", text: "NCLC 1-4 / Non testé", points: 0, icon: "🔇" },
        { key: "NCLC_5_o", text: "NCLC 5", points: 20, icon: "💬" }, 
        { key: "NCLC_6_o", text: "NCLC 6", points: 40, icon: "🗣️" },
        { key: "NCLC_7_o", text: "NCLC 7", points: 80, icon: "📢" }, 
        { key: "NCLC_8_o", text: "NCLC 8", points: 90, icon: "🔥" },
        { key: "NCLC_9_o", text: "NCLC 9", points: 100, icon: "🌟" },
        { key: "NCLC_10_PLUS_o", text: "NCLC 10+", points: 110, icon: "🏆" }
    ],
    frLangLevelsDP_Ecrit: [ 
        { key: "none_NCLC_1_4_e", text: "NCLC 1-4 / Non testé", points: 0, icon: "📝" },
        { key: "NCLC_5_e", text: "NCLC 5", points: 10, icon: "✍️" },
        { key: "NCLC_6_e", text: "NCLC 6", points: 20, icon: "📜" },
        {
