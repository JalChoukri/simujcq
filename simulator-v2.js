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
            { key: "none_NCLC_1_4_sp_o", text: "NCLC 1-4 / Non testé", points: 0, icon: "🔇" }, { key: "NCLC_5_6_sp_o", text: "NCLC 5-6", points: 10, icon: "💬" }, { key: "NCLC_7_PLUS_sp_o", text: "NCLC 7+", points: 20, icon: "🗣️" }
        ],
        educationLevelsSP: [
            { key: "none_edu_sp", text: "Aucun / Secondaire non terminé", points: 0, icon: "🚫" }, { key: "SEC_SP", text: "Secondaire", points: 5, icon: "🎓" }, { key: "POST_SEC_SP_BAC", text: "Post-secondaire / DEC / BAC", points: 10, icon: "📚" }, { key: "UNIV_MASTER_DOC_SP", text: "Universitaire 2e/3e cycle", points: 20, icon: "🌟" }
        ],
        domaineFormationSP: [
            { key: "none_dom_sp", text: "Non applicable / Domaine non listé", points: 0, icon: "❓" }, { key: "DOM_DEMANDE_SP", text: "Domaine en demande (similaire au DP)", points: 10, icon: "👍" }
        ],
        offreEmploiValidee: [
            { key: "none_offre", text: "Aucune offre d'emploi validée", points: 0, icon: "🚫" }, { key: "OFFRE_CMM", text: "Offre validée DANS la CMM (Montréal)", points: 180, icon: "🏙️" }, { key: "OFFRE_HORS_CMM", text: "Offre validée HORS de la CMM", points: 380, icon: "🏞️" }
        ],
        familleQC: [
            { key: "none_fam_qc", text: "Non", points: 0, icon: "🚫" }, { key: "oui_fam_qc", text: "Oui, famille proche au Québec", points: 20, icon: "👨‍👩‍👧" }
        ]
    };

    const scoreTiers = [
        { threshold: 0, text: "Début", className: 'status-low' },
        { threshold: 450, text: "Amélioration Nécessaire", className: 'status-low' },
        { threshold: 550, text: "Score passable", className: 'status-medium' },
        { threshold: 600, text: "Bon score", className: 'status-good' },
        { threshold: 700, text: "Excellent profil", className: 'status-excellent' }
    ];

    function getPointsFromRadio(groupName) {
        const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
        if (!selectedRadio) return 0;
        const selectedKey = selectedRadio.value;
        const groupDataKey = groupName.replace(/_radio.*$/, '');
        const dataArray = D_ARRIMA[groupDataKey];
        if (!dataArray) return 0;
        const selectedOption = dataArray.find(item => item.key === selectedKey);
        return selectedOption ? (Number(selectedOption.points) || 0) : 0;
    }

    function getNumericInputVal(elementId) {
        const inputElement = document.getElementById(elementId);
        return inputElement ? (Number(inputElement.value) || 0) : 0;
    }

    function getArrimaAgePoints(age, isSpouse = false) {
        if (!age || age < 18) return 0;
        if (isSpouse) {
            if (age <= 35) return 20; if (age <= 40) return 10; return 0;
        } else {
            if (age <= 30) return 130; if (age === 31) return 124; if (age === 32) return 118; if (age === 33) return 112; if (age === 34) return 106; if (age === 35) return 100; if (age === 36) return 88; if (age === 37) return 76; if (age === 38) return 64; if (age === 39) return 52; if (age === 40) return 40; if (age === 41) return 26; if (age === 42) return 13; return 0;
        }
    }
    
    function calculatePoints() {
        let totalScore = 0;
        const maritalStatusRadio = document.querySelector('input[name="marital_status_radio"]:checked');
        const isWithSpouse = maritalStatusRadio ? (maritalStatusRadio.value === 'true') : false;

        const factors = ['fr_co_radio_dp', 'fr_po_radio_dp', 'fr_ce_radio_dp', 'fr_pe_radio_dp', 'en_co_radio_dp', 'en_po_radio_dp', 'en_ce_radio_dp', 'en_pe_radio_dp', 'education_radio_dp', 'domaine_formation_radio_dp', 'experience_radio_dp', 'diplome_qc_radio_dp', 'experience_qc_radio_dp', 'offre_emploi_radio', 'famille_qc_radio'];
        factors.forEach(factor => totalScore += getPointsFromRadio(factor));
        
        totalScore += getArrimaAgePoints(getNumericInputVal('age_dp'), false);
        const childrenCount = getNumericInputVal('enfants_total');
        if (childrenCount === 1) totalScore += 30;
        else if (childrenCount >= 2) totalScore += 55;

        if (isWithSpouse) {
            totalScore += getPointsFromRadio('fr_co_radio_sp');
            totalScore += getPointsFromRadio('fr_po_radio_sp');
            totalScore += getPointsFromRadio('education_radio_sp');
            totalScore += getPointsFromRadio('domaine_formation_radio_sp');
            totalScore += getArrimaAgePoints(getNumericInputVal('age_sp'), true);
        }

        return Math.round(totalScore);
    }

    function updateStickyBar() {
        const score = calculatePoints();
        finalNumericScore = score;
        const elements = {
            score: document.getElementById('sticky_arrima_score'),
            status: document.getElementById('sticky_overall_status'),
            tierBar: document.getElementById('compact_score_tier_bar')
        };
        if (!elements.score || !elements.status || !elements.tierBar) return;

        let currentTier = scoreTiers[0];
        for (let i = scoreTiers.length - 1; i >= 0; i--) {
            if (score >= scoreTiers[i].threshold) {
                currentTier = scoreTiers[i];
                break;
            }
        }
        
        elements.score.textContent = "Profil :";
        elements.status.textContent = currentTier.text;

        const allStatusClasses = scoreTiers.map(t => t.className);
        elements.status.classList.remove(...allStatusClasses);
        elements.tierBar.classList.remove(...allStatusClasses);
        elements.status.classList.add(currentTier.className);
        elements.tierBar.classList.add(currentTier.className);

        const percentage = Math.min((score / 800) * 100, 100);
        elements.tierBar.style.width = `${percentage}%`;
    }

    function updateInterpretationText() {
        // This function should be expanded with your full interpretation logic
        const score = finalNumericScore;
        const display = document.getElementById('interpretation_intro_no_job_offer_pdf');
        if (display) {
            if (score > 600) {
                display.textContent = `Félicitations ! Avec un score de ${score}, votre profil est très compétitif.`;
            } else if (score > 550) {
                display.textContent = `Avec un score de ${score}, votre profil a un bon potentiel. L'amélioration de quelques facteurs clés pourrait être décisive.`;
            } else {
                display.textContent = `Avec un score de ${score}, des améliorations significatives sont nécessaires pour être compétitif.`;
            }
        }
    }

    function handleRevealScore() {
        const emailInput = document.getElementById('user-email-input');
        const formMessage = document.getElementById('form-message');
        const email = emailInput.value;

        formMessage.textContent = '';
        if (!email || !email.includes('@') || !email.includes('.')) {
            formMessage.textContent = 'Veuillez entrer une adresse e-mail valide.';
            return;
        }

        const revealBtn = document.getElementById('reveal-score-btn');
        revealBtn.disabled = true;
        revealBtn.textContent = 'Vérification...';

        // NOTE: We are skipping the Make.com call for now, as requested.
        // This part will be enabled later.
        setTimeout(() => { // Using a small delay to simulate a network request
            const emailGateSection = document.getElementById('email-gate-section');
            const resultsSection = document.getElementById('results_summary_section_capture_pdf');
            const finalScoreDisplay = document.getElementById('arrima_total_score_display_pdf');

            finalScoreDisplay.textContent = `${finalNumericScore} points`;
            
            emailGateSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            
            updateInterpretationText();
        }, 500); // 0.5 second delay
    }

    function toggleSpouseSection() {
        const maritalStatusRadio = document.querySelector('input[name="marital_status_radio"]:checked');
        const spouseSection = document.getElementById('spouse_section_wrapper');
        if (spouseSection) {
            spouseSection.style.display = (maritalStatusRadio && maritalStatusRadio.value === 'true') ? 'block' : 'none';
        }
    }

    function populateRadioGroup(groupId, data, groupName) {
        const groupElement = document.getElementById(groupId);
        if (!groupElement) return;
        groupElement.innerHTML = '';
        data.forEach((item, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'radio-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `${groupName}_${item.key}`;
            input.name = groupName;
            input.value = item.key;
            if (index === 0) input.checked = true;

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.innerHTML = `<span class="radio-icon">${item.icon || "▫️"}</span><span class="radio-text">${item.text}</span>`;
            
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            groupElement.appendChild(wrapper);
        });
    }

    // Main Initialization
    function initialize() {
        const allRadioGroups = {
            'marital_status_radiogroup': { data: D_ARRIMA.maritalStatus, name: 'marital_status_radio' },
            'fr_co_radiogroup_dp': { data: D_ARRIMA.frLangLevelsDP_Oral, name: 'fr_co_radio_dp' },
            'fr_po_radiogroup_dp': { data: D_ARRIMA.frLangLevelsDP_Oral, name: 'fr_po_radio_dp' },
            'fr_ce_radiogroup_dp': { data: D_ARRIMA.frLangLevelsDP_Ecrit, name: 'fr_ce_radio_dp' },
            'fr_pe_radiogroup_dp': { data: D_ARRIMA.frLangLevelsDP_Ecrit, name: 'fr_pe_radio_dp' },
            'en_co_radiogroup_dp': { data: D_ARRIMA.enLangLevelsDP, name: 'en_co_radio_dp' },
            'en_po_radiogroup_dp': { data: D_ARRIMA.enLangLevelsDP, name: 'en_po_radio_dp' },
            'en_ce_radiogroup_dp': { data: D_ARRIMA.enLangLevelsDP, name: 'en_ce_radio_dp' },
            'en_pe_radiogroup_dp': { data: D_ARRIMA.enLangLevelsDP, name: 'en_pe_radio_dp' },
            'education_radiogroup_dp': { data: D_ARRIMA.educationLevelsDP, name: 'education_radio_dp' },
            'domaine_formation_radiogroup_dp': { data: D_ARRIMA.domaineFormationDP, name: 'domaine_formation_radio_dp' },
            'experience_radiogroup_dp': { data: D_ARRIMA.experienceLevelsDP, name: 'experience_radio_dp' },
            'diplome_qc_radiogroup_dp': { data: D_ARRIMA.diplomeQC_DP, name: 'diplome_qc_radio_dp' },
            'experience_qc_radiogroup_dp': { data: D_ARRIMA.experienceQC_DP, name: 'experience_qc_radio_dp' },
            'offre_emploi_radiogroup': { data: D_ARRIMA.offreEmploiValidee, name: 'offre_emploi_radio' },
            'famille_qc_radiogroup': { data: D_ARRIMA.familleQC, name: 'famille_qc_radio' }
        };

        for (const [id, config] of Object.entries(allRadioGroups)) {
            populateRadioGroup(id, config.data, config.name);
        }

        document.querySelectorAll('.app-wrapper input, .app-wrapper select').forEach(input => {
            input.addEventListener('change', updateStickyBar);
            input.addEventListener('input', updateStickyBar);
        });

        document.getElementById('marital_status_radiogroup').addEventListener('change', toggleSpouseSection);
        document.getElementById('reveal-score-btn').addEventListener('click', handleRevealScore);
        
        // Populate spouse section dynamically as well if not hardcoded.
        // For now, assuming the containers exist.

        toggleSpouseSection();
        updateStickyBar();
    }

    initialize();
});
