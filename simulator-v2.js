// =======================================================================
// ▼▼▼ CONFIGURATION - METTEZ VOTRE URL DE WEBHOOK ICI ▼▼▼
// =======================================================================
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_UNIQUE_WEBHOOK_URL_HERE';
// =======================================================================
// ▲▲▲ FIN DE LA CONFIGURATION ▲▲▲
// =======================================================================

document.addEventListener('DOMContentLoaded', () => {

    // This variable will hold the final numerical score.
    let finalNumericScore = 0;

    // All the data for the simulator questions and points
    const D_ARRIMA = {
        maritalStatus: [
            { key: "seul", text: "Je soumets seul(e)", value: "false", icon: "👤" },
            { key: "avec_conjoint", text: "Avec époux/conjoint de fait", value: "true", icon: "👥" }
        ],
        frLangLevelsDP_Oral: [
            { key: "none_NCLC_1_4_o", text: "NCLC 1-4 / Non testé", points: 0, icon: "🔇" }, { key: "NCLC_5_o", text: "NCLC 5", points: 20, icon: "💬" }, { key: "NCLC_6_o", text: "NCLC 6", points: 40, icon: "🗣️" }, { key: "NCLC_7_o", text: "NCLC 7", points: 80, icon: "📢" }, { key: "NCLC_8_o", text: "NCLC 8", points: 90, icon: "🔥" }, { key: "NCLC_9_o", text: "NCLC 9", points: 100, icon: "🌟" }, { key: "NCLC_10_PLUS_o", text: "NCLC 10+", points: 110, icon: "🏆" }
        ],
        frLangLevelsDP_Ecrit: [
            { key: "none_NCLC_1_4_e", text: "NCLC 1-4 / Non testé", points: 0, icon: "📝" }, { key: "NCLC_5_e", text: "NCLC 5", points: 10, icon: "✍️" }, { key: "NCLC_6_e", text: "NCLC 6", points: 20, icon: "📜" }, { key: "NCLC_7_PLUS_e", text: "NCLC 7+", points: 30, icon: "✒️" }
        ],
        enLangLevelsDP: [
            { key: "none_CLB_1_4", text: "CLB 1-4 / Non testé", points: 0, icon: "➖" }, { key: "CLB_5_8", text: "CLB 5-8 (par compétence)", points: 6, icon: "💬" }, { key: "CLB_9_PLUS", text: "CLB 9+ (par compétence)", points: 12, icon: "📢" }
        ],
        educationLevelsDP: [
            { key: "none_edu", text: "Aucun diplôme / Secondaire non terminé", points: 0, icon: "🚫" }, { key: "SEC_GEN_PRO", text: "Secondaire général ou professionnel", points: 20, icon: "🎓" }, { key: "POST_SEC_TECH_1_2", text: "Post-secondaire technique (1-2 ans)", points: 40, icon: "🧑‍🔧" }, { key: "DEC_TECH_POST_SEC_3", text: "DEC technique / Post-secondaire technique (3 ans)", points: 70, icon: "🔩" }, { key: "UNIV_BAC", text: "Universitaire 1er cycle (BAC 3 ans+)", points: 90, icon: "🏛️" }, { key: "UNIV_MAITRISE", text: "Universitaire 2e cycle (Maîtrise)", points: 110, icon: "🌟" }, { key: "UNIV_DOCTORAT", text: "Universitaire 3e cycle (Doctorat)", points: 130, icon: "🏆" }
        ],
        domaineFormationDP: [
            { key: "none_dom", text: "Non applicable / Mon domaine n'est pas listé ici", points: 0, icon: "❓" }, { key: "DOM_NEUTRE_PEU", text: "Domaine général / Peu en demande", points: 10, icon: "🤏" }, { key: "DOM_DEMANDE_TI_GENIE_GESTION", text: "TI, Génie, Gestion Spécialisée, Finance", points: 40, icon: "💻" }, { key: "DOM_FORTE_DEMANDE_SANTE_ENSEIGNEMENT", text: "Santé, Services Sociaux, Enseignement, Éducation", points: 70, icon: "❤️" }
        ],
        experienceLevelsDP: [
            { key: "none_exp", text: "< 6 mois / Aucune", points: 0, icon: "⏳" }, { key: "EXP_6_11M", text: "6–11 mois", points: 20, icon: "💼" }, { key: "EXP_12_23M", text: "12–23 mois", points: 40, icon: "🗓️" }, { key: "EXP_24_35M", text: "24–35 mois", points: 60, icon: "📈" }, { key: "EXP_36_47M", text: "36–47 mois", points: 80, icon: "📊" }, { key: "EXP_48M_PLUS", text: "≥ 48 mois", points: 100, icon: "🏆" }
        ],
        diplomeQC_DP: [
            { key: "none_dip_qc", text: "Non", points: 0, icon: "🚫" }, { key: "DEP_1800H_AEC_DEC_TECH_QC", text: "DEP (≥1800h) / AEC / DEC technique du Québec", points: 70, icon: "🍁" }, { key: "UNIV_QC_BAC_PLUS", text: "Diplôme universitaire du Québec (BAC, Maîtrise, Doc)", points: 100, icon: "🏛️" }
        ],
        experienceQC_DP: [
            { key: "none_exp_qc", text: "Non", points: 0, icon: "🚫" }, { key: "EXP_QC_6_11M", text: "6 à 11 mois", points: 70, icon: "💼" }, { key: "EXP_QC_12M_PLUS", text: "12 mois et plus", points: 110, icon: "🏆" }
        ],
        frLangLevelsSP_Oral: [
            { key: "
