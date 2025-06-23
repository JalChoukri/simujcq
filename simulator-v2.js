// --- BARÈMES ESTIMATIFS ARRIMA 2025 ---
const D_ARRIMA = {
    maritalStatus: [ 
        { key: "seul", text: "Je soumets seul(e)", value: "false", icon: "👤" },
        { key: "avec_conjoint", text: "Avec époux/conjoint de fait", value: "true", icon: "👥" }
    ],
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
        { key: "NCLC_7_PLUS_e", text: "NCLC 7+", points: 30, icon: "✒️" } 
    ],
    enLangLevelsDP: [ 
        { key: "none_CLB_1_4", text: "CLB 1-4 / Non testé", points: 0, icon: "➖" },
        { key: "CLB_5_8", text: "CLB 5-8 (par compétence)", points: 6, icon: "💬" }, 
        { key: "CLB_9_PLUS", text: "CLB 9+ (par compétence)", points: 12, icon: "📢" } 
    ],
    educationLevelsDP: [
        { key: "none_edu", text: "Aucun diplôme / Secondaire non terminé", points: 0, icon: "🚫" },
        { key: "SEC_GEN_PRO", text: "Secondaire général ou professionnel", points: 20, icon: "🎓" }, 
        { key: "POST_SEC_TECH_1_2", text: "Post-secondaire technique (1-2 ans)", points: 40, icon: "🧑‍🔧" },
        { key: "DEC_TECH_POST_SEC_3", text: "DEC technique / Post-secondaire technique (3 ans)", points: 70, icon: "🔩" },
        { key: "UNIV_BAC", text: "Universitaire 1er cycle (BAC 3 ans+)", points: 90, icon: "🏛️" },
        { key: "UNIV_MAITRISE", text: "Universitaire 2e cycle (Maîtrise)", points: 110, icon: "🌟" },
        { key: "UNIV_DOCTORAT", text: "Universitaire 3e cycle (Doctorat)", points: 130, icon: "🏆" } 
    ],
    domaineFormationDP: [ 
        { 
            key: "none_dom", 
            text: "Non applicable / Mon domaine n'est pas listé ici ➕", 
            points: 0, icon: "❓",
            examplesHTML: `<h4>Domaine Non Listé ou Non Applicable</h4><p>Si votre domaine d'études ne semble correspondre à aucune des catégories ci-dessous, ou si vous n'êtes pas certain.</p><p><em>Il est recommandé de consulter les listes de professions (CNP) régulièrement ciblées par Arrima pour évaluer la demande pour votre profil spécifique.</em></p>`
        },
        { 
            key: "DOM_NEUTRE_PEU", 
            text: "Domaine général / Peu en demande ➕", 
            points: 10, icon: "🤏",
            examplesHTML: `<h4>Domaine général / Peu en demande : Exemples indicatifs</h4><p>Concerne souvent des formations plus générales sans spécialisation technique pointue ou expérience directement applicable dans un secteur actuellement en pénurie au Québec. Exemples :</p><ul><li>Certaines branches des sciences humaines (histoire générale, philosophie sans application spécifique)</li><li>Arts (sans lien avec le numérique ou des métiers d'artisanat en demande)</li><li>Administration générale sans spécialisation technique ou expérience sectorielle recherchée.</li></ul><p><em><strong>Note :</strong> L'important est souvent la transférabilité des compétences et l'expérience. Ce domaine peut quand même être valorisé par votre expérience professionnelle.</em></p>` 
        },
        { 
            key: "DOM_DEMANDE_TI_GENIE_GESTION", 
            text: "TI, Génie, Gestion Spécialisée, Finance ➕", 
            points: 40, icon: "💻",
            examplesHTML: `<h4>TI, Génie, Gestion Spécialisée, Finance : Exemples indicatifs</h4><ul><li><strong>TI/Logiciel :</strong> Développeurs (web, mobile, logiciel, jeux), Ingénieurs logiciel, Analystes de données, Spécialistes cybersécurité, Administrateurs systèmes/réseaux.</li><li><strong>Génie (autre) :</strong> Ingénieurs (civil, mécanique, électrique, industriel), Techniciens en génie.</li><li><strong>Gestion/Finance :</strong> Gestionnaires de projet (surtout TI/Génie), Comptables (CPA), Analystes financiers, Spécialistes RH (avec exp. pertinente).</li></ul><p><em><strong>Note :</strong> Les certifications et l'expérience spécifique sont clés.</em></p>`
        },
        { 
            key: "DOM_FORTE_DEMANDE_SANTE_ENSEIGNEMENT", 
            text: "Santé, Services Sociaux, Enseignement, Éducation ➕", 
            points: 70, icon: "❤️",
            examplesHTML: `<h4>Santé, Services Sociaux, Enseignement, Éducation : Exemples indicatifs</h4><ul><li><strong>Santé :</strong> Infirmiers/Infirmières (autorisés/auxiliaires), Préposés aux bénéficiaires, Médecins (certaines spécialités), Pharmaciens, Technologues médicaux.</li><li><strong>Services Sociaux :</strong> Travailleurs sociaux, Psychologues.</li><li><strong>Enseignement/Éducation :</strong> Enseignants (primaire/secondaire, surtout maths, sciences, français), Éducateurs/Éducatrices de la petite enfance.</li></ul><p><em><strong>Note :</strong> Beaucoup de ces professions sont réglementées au Québec. Une reconnaissance professionnelle peut être nécessaire.</em></p>`
        } 
    ],
    experienceLevelsDP: [ 
        { key: "none_exp", text: "< 6 mois / Aucune", points: 0, icon: "⏳" },
        { key: "EXP_6_11M", text: "6–11 mois", points: 20, icon: "💼" },
        { key: "EXP_12_23M", text: "12–23 mois", points: 40, icon: "🗓️" },
        { key: "EXP_24_35M", text: "24–35 mois", points: 60, icon: "📈" },
        { key: "EXP_36_47M", text: "36–47 mois", points: 80, icon: "📊" },
        { key: "EXP_48M_PLUS", text: "≥ 48 mois", points: 100, icon: "🏆" } 
    ],
    diplomeQC_DP: [
        { key: "none_dip_qc", text: "Non", points: 0, icon: "🚫" },
        { key: "DEP_1800H_AEC_DEC_TECH_QC", text: "DEP (≥1800h) / AEC / DEC technique du Québec", points: 70, icon: "🍁" }, 
        { key: "UNIV_QC_BAC_PLUS", text: "Diplôme universitaire du Québec (BAC, Maîtrise, Doc)", points: 100, icon: "🏛️" } 
    ],
    experienceQC_DP: [
        { key: "none_exp_qc", text: "Non", points: 0, icon: "🚫" },
        { key: "EXP_QC_6_11M", text: "6 à 11 mois", points: 70, icon: "💼" }, 
        { key: "EXP_QC_12M_PLUS", text: "12 mois et plus", points: 110, icon: "🏆" }
    ],
    frLangLevelsSP_Oral: [ 
        { key: "none_NCLC_1_4_sp_o", text: "NCLC 1-4 / Non testé", points: 0, icon: "🔇" },
        { key: "NCLC_5_6_sp_o", text: "NCLC 5-6", points: 10, icon: "💬" },
        { key: "NCLC_7_PLUS_sp_o", text: "NCLC 7+", points: 20, icon: "🗣️" } 
    ],
    educationLevelsSP: [
        { key: "none_edu_sp", text: "Aucun / Secondaire non terminé", points: 0, icon: "🚫" },
        { key: "SEC_SP", text: "Secondaire", points: 5, icon: "🎓" },
        { key: "POST_SEC_SP_BAC", text: "Post-secondaire / DEC / BAC", points: 10, icon: "📚" }, 
        { key: "UNIV_MASTER_DOC_SP", text: "Universitaire 2e/3e cycle", points: 20, icon: "🌟" } 
    ],
     domaineFormationSP: [ 
        { 
            key: "none_dom_sp", 
            text: "Non applicable / Domaine non listé ➕", 
            points: 0, icon: "❓",
            examplesHTML: `<h4>Domaine Non Listé ou Non Applicable (Conjoint)</h4><p>Si le domaine d'études de votre conjoint(e) ne semble pas correspondre à la catégorie ci-dessous ou si vous n'êtes pas certain.</p>`
        },
        { 
            key: "DOM_DEMANDE_SP", 
            text: "Domaine en demande (similaire au DP) ➕", 
            points: 10, icon: "👍",
            examplesHTML: `<h4>Domaine en Demande (Conjoint) : Exemples indicatifs</h4><p>Concerne généralement les mêmes secteurs porteurs que pour le demandeur principal (TI, Génie, Santé, Enseignement, Gestion spécialisée), mais l'impact sur les points est moindre.</p><ul><li>L'objectif est de démontrer une bonne capacité d'intégration professionnelle du conjoint.</li></ul>`
        } 
    ],
    offreEmploiValidee: [
        { key: "none_offre", text: "Aucune offre d'emploi validée", points: 0, icon: "🚫" },
        { key: "OFFRE_CMM", text: "Offre validée DANS la CMM (Montréal)", points: 180, icon: "🏙️" }, 
        { key: "OFFRE_HORS_CMM", text: "Offre validée HORS de la CMM", points: 380, icon: "🏞️" } 
    ],
    familleQC: [ 
        { key: "none_fam_qc", text: "Non", points: 0, icon: "🚫" },
        { key: "oui_fam_qc", text: "Oui, famille proche au Québec", points: 20, icon: "👨‍👩‍👧" }
    ]
};

// --- HELPER FUNCTIONS ---

function toggleAccordionContent(groupId, accordionId) { 
    const accordionContent = document.getElementById(accordionId);
    if (!accordionContent) return;
    const groupElement = document.getElementById(groupId);
    if (!groupElement) return;
    const allAccordionsInGroup = groupElement.querySelectorAll('.radio-accordion-content');
    const isCurrentlyOpen = accordionContent.style.display === 'block';
    allAccordionsInGroup.forEach(acc => {
        if (acc.id !== accordionId) { acc.style.display = 'none'; }
    });
    accordionContent.style.display = isCurrentlyOpen ? 'none' : 'block';
}

document.addEventListener('click', function(event) { 
    let targetElement = event.target;
    let isClickInsideAccordionSystem = false;
    while (targetElement != null) {
        if (targetElement.classList && (targetElement.classList.contains('radio-accordion-content') || targetElement.classList.contains('radio-option') || targetElement.classList.contains('radio-option-wrapper'))) {
            isClickInsideAccordionSystem = true;
            break;
        }
        targetElement = targetElement.parentElement;
    }
    if (!isClickInsideAccordionSystem) {
        document.querySelectorAll('.radio-accordion-content').forEach(acc => { acc.style.display = 'none'; });
    }
});

function populateRadioGroup(groupId, data, groupName, isSingleColumn = false, isMaritalStatus = false) { 
    const groupElement = document.getElementById(groupId);
    if (!groupElement) { console.warn("Radio group element not found: " + groupId); return; }
    if (isSingleColumn) groupElement.classList.add('single-column');
    if (isMaritalStatus) groupElement.classList.add('two-column-desktop');
    groupElement.innerHTML = ""; 
    data.forEach((item, index) => {
        const optionWrapper = document.createElement('div'); 
        optionWrapper.className = 'radio-option-wrapper';
        const optionDiv = document.createElement('div');
        optionDiv.className = 'radio-option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `${groupName}_${item.key}`;
        input.name = groupName;
        input.value = isMaritalStatus ? item.value.toString() : item.key;
        input.checked = index === 0; 
        input.onchange = () => { 
            if (isMaritalStatus) { toggleSpouseSection(); }
            calculatePoints();
        };
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.innerHTML = `<span class="radio-icon">${item.icon || "▫️"}</span><span class="radio-text">${item.text}</span>`;
        if (item.examplesHTML) {
            label.setAttribute('data-has-accordion', 'true');
            label.addEventListener('click', function(event) {
                if (event.target.classList.contains('radio-text') || event.target.classList.contains('radio-icon') || event.target === this) {
                    if (!input.checked) { 
                        input.checked = true;
                        if (isMaritalStatus) toggleSpouseSection();
                        calculatePoints(); 
                    }
                    toggleAccordionContent(groupId, `${groupName}_${item.key}_accordion`);
                }
            });
        }
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionWrapper.appendChild(optionDiv);
        if (item.examplesHTML) {
            const accordionContentDiv = document.createElement('div');
            accordionContentDiv.id = `${groupName}_${item.key}_accordion`;
            accordionContentDiv.className = 'radio-accordion-content';
            accordionContentDiv.innerHTML = item.examplesHTML;
            optionWrapper.appendChild(accordionContentDiv);
        }
        groupElement.appendChild(optionWrapper);
    });
}

function getPointsFromRadio(groupName, dataArray) {  
    const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
    if (!selectedRadio) return 0;
    const selectedOption = dataArray.find(item => item.key === selectedRadio.value);
    return selectedOption ? (Number(selectedOption.points) || 0) : 0;
}

function getNumericInputVal(elementId) { 
    const inputElement = document.getElementById(elementId);
    if (!inputElement) { return 0; }
    let val = Number(inputElement.value) || 0;
    return val < 0 ? 0 : val;
}

function getArrimaAgePoints(ageInput, isSpouse = false) { 
    const age = Number(ageInput) || 0; 
    const ageValidationMsgEl = document.getElementById(isSpouse ? 'age_validation_message_sp' : 'age_validation_message_dp');
    if(ageValidationMsgEl) ageValidationMsgEl.textContent = '';
    if (age < 0 || age > 120) { 
        if(age !== 0 && ageValidationMsgEl) ageValidationMsgEl.textContent = 'Âge invalide (18-120).';
        return 0;
    }
    if (age !==0 && age < 18) { 
        if(ageValidationMsgEl) ageValidationMsgEl.textContent = 'L\'âge doit être de 18 ans ou plus.';
        return 0;
    }
    if (age === 0) return 0; 
    if (isSpouse) { 
        if (age >= 18 && age <= 35) return 20; 
        if (age >= 36 && age <= 40) return 10;
        return 0;
    } else { 
        if (age >= 18 && age <= 30) return 130; 
        if (age === 31) return 124; if (age === 32) return 118;  if (age === 33) return 112;
        if (age === 34) return 106; if (age === 35) return 100;
        if (age === 36) return 88;  if (age === 37) return 76;  if (age === 38) return 64;
        if (age === 39) return 52;  if (age === 40) return 40;
        if (age === 41) return 26;  if (age === 42) return 13;
        return age >= 43 ? 0 : 0;
    }
}

function toggleSpouseSection() {
    const maritalStatusRadio = document.querySelector('input[name="marital_status_radio"]:checked');
    const isWithSpouse = maritalStatusRadio ? (maritalStatusRadio.value === 'true') : false; 
    document.getElementById('spouse_section_wrapper').style.display = isWithSpouse ? 'block' : 'none';
    if (!isWithSpouse) { 
        document.querySelectorAll('#spouse_section input[type="radio"]').forEach(radio => {
            const firstInGroup = document.querySelector(`input[name="${radio.name}"]`);
            if (firstInGroup) firstInGroup.checked = true;
        });
        document.querySelectorAll('#spouse_section input[type="number"]').forEach(numInput => numInput.value = 0);
    }
}

function updatePointsDisplay(elementId, points) {  
    const display = document.getElementById(elementId);
    if (display) display.innerText = "Points: " + (Number(points) || 0);
}

// --- MAIN CALCULATION LOGIC ---

function calculatePoints() { 
    // This function calculates all points but does not display the final results section yet.
    // That will be handled by the email gate.
    const isWithSpouse = (document.querySelector('input[name="marital_status_radio"]:checked')?.value === 'true');
    let totalArrimaScore = 0;
    const getSanitizedRadioPoints = (groupName, dataArr) => Number(getPointsFromRadio(groupName, dataArr)) || 0;
    const getSanitizedAgePoints = (elId, isSp) => Number(getArrimaAgePoints(getNumericInputVal(elId), isSp)) || 0;

    let dp_score_capital_humain = 0;
    dp_score_capital_humain += getSanitizedRadioPoints('fr_co_radio_dp', D_ARRIMA.frLangLevelsDP_Oral);
    dp_score_capital_humain += getSanitizedRadioPoints('fr_po_radio_dp', D_ARRIMA.frLangLevelsDP_Oral);
    dp_score_capital_humain += getSanitizedRadioPoints('fr_ce_radio_dp', D_ARRIMA.frLangLevelsDP_Ecrit);
    dp_score_capital_humain += getSanitizedRadioPoints('fr_pe_radio_dp', D_ARRIMA.frLangLevelsDP_Ecrit);
    dp_score_capital_humain += getSanitizedRadioPoints('en_co_radio_dp', D_ARRIMA.enLangLevelsDP);
    dp_score_capital_humain += getSanitizedRadioPoints('en_po_radio_dp', D_ARRIMA.enLangLevelsDP);
    dp_score_capital_humain += getSanitizedRadioPoints('en_ce_radio_dp', D_ARRIMA.enLangLevelsDP); 
    dp_score_capital_humain += getSanitizedRadioPoints('en_pe_radio_dp', D_ARRIMA.enLangLevelsDP);
    dp_score_capital_humain += getSanitizedAgePoints('age_dp', false);
    dp_score_capital_humain += getSanitizedRadioPoints('education_radio_dp', D_ARRIMA.educationLevelsDP);
    dp_score_capital_humain += getSanitizedRadioPoints('domaine_formation_radio_dp', D_ARRIMA.domaineFormationDP);
    dp_score_capital_humain += getSanitizedRadioPoints('experience_radio_dp', D_ARRIMA.experienceLevelsDP);
    totalArrimaScore += dp_score_capital_humain;

    // Update individual point displays
    updatePointsDisplay('fr_co_points_dp', getSanitizedRadioPoints('fr_co_radio_dp', D_ARRIMA.frLangLevelsDP_Oral));
    updatePointsDisplay('fr_po_points_dp', getSanitizedRadioPoints('fr_po_radio_dp', D_ARRIMA.frLangLevelsDP_Oral));
    updatePointsDisplay('fr_ce_points_dp', getSanitizedRadioPoints('fr_ce_radio_dp', D_ARRIMA.frLangLevelsDP_Ecrit));
    updatePointsDisplay('fr_pe_points_dp', getSanitizedRadioPoints('fr_pe_radio_dp', D_ARRIMA.frLangLevelsDP_Ecrit));
    updatePointsDisplay('en_co_points_dp', getSanitizedRadioPoints('en_co_radio_dp', D_ARRIMA.enLangLevelsDP));
    updatePointsDisplay('en_po_points_dp', getSanitizedRadioPoints('en_po_radio_dp', D_ARRIMA.enLangLevelsDP));
    updatePointsDisplay('en_ce_points_dp', getSanitizedRadioPoints('en_ce_radio_dp', D_ARRIMA.enLangLevelsDP));
    updatePointsDisplay('en_pe_points_dp', getSanitizedRadioPoints('en_pe_radio_dp', D_ARRIMA.enLangLevelsDP));
    updatePointsDisplay('age_points_dp', getSanitizedAgePoints('age_dp', false));
    updatePointsDisplay('education_points_dp', getSanitizedRadioPoints('education_radio_dp', D_ARRIMA.educationLevelsDP));
    updatePointsDisplay('domaine_formation_points_dp', getSanitizedRadioPoints('domaine_formation_radio_dp', D_ARRIMA.domaineFormationDP));
    updatePointsDisplay('experience_points_dp', getSanitizedRadioPoints('experience_radio_dp', D_ARRIMA.experienceLevelsDP));

    let dp_score_marche_qc = 0;
    dp_score_marche_qc += getSanitizedRadioPoints('diplome_qc_radio_dp', D_ARRIMA.diplomeQC_DP);
    dp_score_marche_qc += getSanitizedRadioPoints('experience_qc_radio_dp', D_ARRIMA.experienceQC_DP);
    totalArrimaScore += dp_score_marche_qc;
    updatePointsDisplay('diplome_qc_points_dp', getSanitizedRadioPoints('diplome_qc_radio_dp', D_ARRIMA.diplomeQC_DP));
    updatePointsDisplay('experience_qc_points_dp', getSanitizedRadioPoints('experience_qc_radio_dp', D_ARRIMA.experienceQC_DP));

    if (isWithSpouse) {
        let sp_score = 0;
        sp_score += getSanitizedRadioPoints('fr_co_radio_sp', D_ARRIMA.frLangLevelsSP_Oral);
        sp_score += getSanitizedRadioPoints('fr_po_radio_sp', D_ARRIMA.frLangLevelsSP_Oral);
        sp_score += getSanitizedAgePoints('age_sp', true);
        sp_score += getSanitizedRadioPoints('education_radio_sp', D_ARRIMA.educationLevelsSP);
        sp_score += getSanitizedRadioPoints('domaine_formation_radio_sp', D_ARRIMA.domaineFormationSP);
        totalArrimaScore += sp_score;
        updatePointsDisplay('fr_co_points_sp', getSanitizedRadioPoints('fr_co_radio_sp', D_ARRIMA.frLangLevelsSP_Oral));
        updatePointsDisplay('fr_po_points_sp', getSanitizedRadioPoints('fr_po_radio_sp', D_ARRIMA.frLangLevelsSP_Oral));
        updatePointsDisplay('age_points_sp', getSanitizedAgePoints('age_sp', true));
        updatePointsDisplay('education_points_sp', getSanitizedRadioPoints('education_radio_sp', D_ARRIMA.educationLevelsSP));
        updatePointsDisplay('domaine_formation_points_sp', getSanitizedRadioPoints('domaine_formation_radio_sp', D_ARRIMA.domaineFormationSP));
    } else { 
        ['fr_co_points_sp', 'fr_po_points_sp', 'age_points_sp', 'education_points_sp', 'domaine_formation_points_sp'].forEach(id => updatePointsDisplay(id, 0));
    }

    let offre_emploi_pts = getSanitizedRadioPoints('offre_emploi_radio', D_ARRIMA.offreEmploiValidee);
    updatePointsDisplay('offre_emploi_points', offre_emploi_pts); 
    let score_sans_offre_emploi = totalArrimaScore; 

    let enfants_pts = 0;
    const enfants_total_val = getNumericInputVal('enfants_total');
    if (enfants_total_val === 1) enfants_pts = 30; 
    else if (enfants_total_val >= 2) enfants_pts = 55; 
    updatePointsDisplay('enfants_points', enfants_pts); 
    score_sans_offre_emploi += enfants_pts; 

    let famille_qc_pts = getSanitizedRadioPoints('famille_qc_radio', D_ARRIMA.familleQC);
    updatePointsDisplay('famille_qc_points', famille_qc_pts); 
    score_sans_offre_emploi += famille_qc_pts; 

    totalArrimaScore = score_sans_offre_emploi + offre_emploi_pts; 

    document.getElementById('autonomie_financiere_points_display').innerText = 
        document.getElementById('autonomie_financiere_checkbox').checked ? "Exigence Comprise" : "Doit être comprise";

    totalArrimaScore = Math.round(totalArrimaScore); 

    // ---- UPDATE UI ELEMENTS ----
    const stickyScoreEl = document.getElementById('sticky_arrima_score');
    if (stickyScoreEl) stickyScoreEl.innerHTML = `Score Arrima: ${totalArrimaScore}`;
    
    // The following elements are inside the gated content, so we just prepare their content.
    const scoreDisplayPdfEl = document.getElementById('arrima_total_score_display_pdf');
    if (scoreDisplayPdfEl) scoreDisplayPdfEl.innerText = `Score Total Estimé : ${totalArrimaScore} points`; 

    // Update interpretation text (this will be hidden until the gate is passed)
    updateInterpretationText(totalArrimaScore, score_sans_offre_emploi, offre_emploi_pts);
}

function updateInterpretationText(totalArrimaScore, score_sans_offre_emploi, offre_emploi_pts) {
    const interpretationNoJobOfferDiv = document.getElementById('interpretation_no_job_offer_text_pdf');
    const interpretationWithJobOfferDiv = document.getElementById('interpretation_with_job_offer_text_pdf');
    const introNoJobEl = document.getElementById('interpretation_intro_no_job_offer_pdf');
    const adviceNoJobEl = document.getElementById('interpretation_advice_list_no_job_offer_pdf');
    const perspectiveWithJobEl = document.getElementById('interpretation_perspective_with_job_offer_pdf');
    const introWithJobEl = document.getElementById('interpretation_intro_with_job_offer_pdf');
    const autonomyReminderElPDF = document.getElementById('autonomy_reminder_pdf');

    // Reset content
    introNoJobEl.innerHTML = ""; adviceNoJobEl.innerHTML = "";
    perspectiveWithJobEl.innerHTML = ""; introWithJobEl.innerHTML = "";
    autonomyReminderElPDF.style.display = 'none';

    let stickyOverallStatusText = "Amélioration Nécessaire";
    let stickyOverallStatusClass = 'status-low';
    let resultsBgColor = '#fdecea'; 

    const typicalHighInvitationScore = 620;
    const typicalMidInvitationScore = 595; 
    const typicalLowInvitationScore = 570; 
    const scoreForJobOfferPerspective = 450; 

    if (offre_emploi_pts > 0) {
        interpretationNoJobOfferDiv.style.display = 'none';
        interpretationWithJobOfferDiv.style.display = 'block';
        introWithJobEl.innerHTML = `Avec une offre d'emploi validée et un score total de ${totalArrimaScore} points (score de base sans offre: ${score_sans_offre_emploi}), vos chances d'invitation sont <strong>TRÈS ÉLEVÉES</strong>. Les candidats avec une offre d'emploi validée sont souvent priorisés, surtout si elle est hors de la CMM. Assurez-vous que votre offre est bien validée par le MIFI.`;
        stickyOverallStatusText = "Excellent (Offre Emploi)";
        stickyOverallStatusClass = 'status-high';
        resultsBgColor = '#e6f9ee';
    } else {
        interpretationNoJobOfferDiv.style.display = 'block';
        interpretationWithJobOfferDiv.style.display = 'none';
        let tempAdvice = "";
        if (score_sans_offre_emploi >= typicalHighInvitationScore) {
            introNoJobEl.innerHTML = `Félicitations ! Votre score estimé de ${score_sans_offre_emploi} points (sans offre d'emploi) est <strong>EXCELLENT</strong>. Vous vous placez parmi les candidats très compétitifs pour les tirages généraux basés sur le profil.`;
            tempAdvice += "<li>Assurez-vous que toutes vos informations sont exactes et vos documents prêts.</li><li>Continuez à surveiller les rondes d'invitation.</li>";
            stickyOverallStatusText = "Score Très Compétitif";
            stickyOverallStatusClass = 'status-high';
            resultsBgColor = '#e6f9ee';
        } else if (score_sans_offre_emploi >= typicalMidInvitationScore) {
            introNoJobEl.innerHTML = `Votre score estimé de ${score_sans_offre_emploi} points (sans offre d'emploi) est <strong>BON et COMPÉTITIF</strong>. Vous êtes dans une zone où des invitations pour profils généraux ont été observées.`;
            tempAdvice += "<li>Toute amélioration (ex: français, expérience ciblée) est un plus.</li>";
            stickyOverallStatusText = "Score Compétitif";
            stickyOverallStatusClass = 'status-medium';
            resultsBgColor = '#fff9e6';
        } else if (score_sans_offre_emploi >= typicalLowInvitationScore) {
            introNoJobEl.innerHTML = `Votre score estimé de ${score_sans_offre_emploi} points (sans offre d'emploi) est <strong>PROMETTEUR</strong> mais pourrait nécessiter quelques améliorations pour atteindre solidement les seuils d'invitation les plus courants pour les profils généraux.`;
            tempAdvice += "<li>Concentrez-vous sur l'amélioration de votre niveau de français (NCLC 7+ à l'oral ET à l'écrit est crucial).</li><li>Vérifiez si votre domaine de formation et expérience sont en forte demande.</li>";
            stickyOverallStatusText = "Potentiel Intéressant";
            stickyOverallStatusClass = 'status-medium'; 
            resultsBgColor = '#fff9e6';
        } else {
            introNoJobEl.innerHTML = `Votre score estimé de ${score_sans_offre_emploi} points (sans offre d'emploi) est actuellement <strong>inférieur</strong> aux seuils d'invitation généralement observés pour les profils généraux. Des améliorations significatives sont nécessaires.`;
            tempAdvice += "<li><strong>Priorité #1 : Français.</strong> Visez NCLC 7+ à l'oral ET à l'écrit.</li><li>Si possible, explorez des études ou une expérience de travail qualifiée au Québec.</li>";
        }
        if (score_sans_offre_emploi + 180 >= scoreForJobOfferPerspective ) { 
             perspectiveWithJobEl.innerHTML = `<strong>Perspective avec Offre d'Emploi :</strong> Notez qu'une offre d'emploi validée par le MIFI augmente considérablement vos chances (ajoutant entre 180 et 380 points). Si vous obteniez une telle offre, votre profil deviendrait hautement compétitif pour les tirages ciblant ce critère. Votre score total pourrait alors atteindre environ <strong>${score_sans_offre_emploi + 180} à ${score_sans_offre_emploi + 380} points</strong>.`;
        } else {
             perspectiveWithJobEl.innerHTML = `<strong>Perspective avec Offre d'Emploi :</strong> L'obtention d'une offre d'emploi validée par le MIFI est le facteur le plus puissant pour augmenter vos chances (ajoutant entre 180 et 380 points). Même si votre score actuel est bas, une offre peut changer radicalement la donne et vous rendre compétitif (score potentiel : <strong>${score_sans_offre_emploi + 180} à ${score_sans_offre_emploi + 380} points</strong>).`;
        }
        adviceNoJobEl.innerHTML = tempAdvice;
    }
    
    if (!document.getElementById('autonomie_financiere_checkbox').checked) {
        autonomyReminderElPDF.style.display = 'block';
    } else {
        autonomyReminderElPDF.style.display = 'none';
    }

    const resultsSectionForPDF = document.getElementById('results_summary_section_capture_pdf');
    resultsSectionForPDF.style.backgroundColor = resultsBgColor; 
    const borderColor = stickyOverallStatusClass === 'status-high' ? 'var(--success-color)' :
                      stickyOverallStatusClass === 'status-medium' ? 'var(--accent-color)' : 'var(--error-color)';
    resultsSectionForPDF.style.borderLeftColor = borderColor;
    resultsSectionForPDF.style.borderLeftWidth = '5px';
    resultsSectionForPDF.style.borderLeftStyle = 'solid';

    const stickyOverallStatusEl = document.getElementById('sticky_overall_status');
    stickyOverallStatusEl.textContent = stickyOverallStatusText;
    stickyOverallStatusEl.className = stickyOverallStatusClass;

    const tierBar = document.getElementById('compact_score_tier_bar');
    const MAX_ARRIMA_SCORE_FOR_BAR = 750; 
    const tierPercentage = Math.min(100, (totalArrimaScore / MAX_ARRIMA_SCORE_FOR_BAR) * 100);
    tierBar.style.width = tierPercentage + '%';
    tierBar.style.backgroundColor = borderColor;
}


// --- NEW: EMAIL GATE & WEBHOOK FUNCTION ---

function setupEmailGateAndWebhook() {
    // !!! IMPORTANT: PASTE YOUR MAKE.COM WEBHOOK URL HERE !!!
    const webhookUrl = 'PASTE_YOUR_MAKE_COM_WEBHOOK_URL_HERE'; 
    // Example: 'https://hook.eu1.make.com/xxxxxxxxxxxxxxxx'

    const emailGateForm = document.getElementById('email-gate-form');
    if (!emailGateForm) return;

    emailGateForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the form from reloading the page

        const emailInput = document.getElementById('user-email');
        const emailError = document.getElementById('email-gate-error');
        const emailGateSection = document.getElementById('email-gate-section');
        const gatedContent = document.getElementById('gated-content');
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput.value && emailRegex.test(emailInput.value)) {
            // --- Email is valid ---
            emailError.textContent = ''; // Clear any error message

            // 1. Immediately hide the form and show the results for the best user experience.
            emailGateSection.style.display = 'none';
            gatedContent.style.display = 'block';

            // 2. Send the email to the Make.com webhook in the background.
            if (webhookUrl.startsWith('https://hook.')) {
                const data = {
                    email: emailInput.value
                };

                fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Webhook Success: Email sent to Make.com');
                    } else {
                        console.error('Webhook Error: Response not OK.', response.status, response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Webhook Fetch Error:', error);
                });
            } else {
                console.warn('Webhook URL is not configured. Please paste your Make.com URL in script.js.');
            }

        } else {
            // --- Email is not valid ---
            emailError.textContent = 'Veuillez entrer une adresse courriel valide.';
        }
    });
}


// --- PDF GENERATION FUNCTION ---

function generatePDF() { 
    // This function remains largely the same
    const { jsPDF } = window.jspdf;
    const pdfStatus = document.getElementById('pdf_generation_status');
    pdfStatus.textContent = "Génération du PDF en cours...";

    const resultsSectionToCapture = document.getElementById('results_summary_section_capture_pdf');
    
    html2canvas(resultsSectionToCapture, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const imgProps= pdf.getImageProperties(imgData);
        const canvasAspectRatio = imgProps.width / imgProps.height;
        let imgInPdfWidth = pdfWidth - 2 * margin;
        let imgInPdfHeight = imgInPdfWidth / canvasAspectRatio;

        if (imgInPdfHeight > pdfHeight - 2 * margin) {
            imgInPdfHeight = pdfHeight - 2 * margin;
            imgInPdfWidth = imgInPdfHeight * canvasAspectRatio;
        }
        const x = (pdfWidth - imgInPdfWidth) / 2;
        const y = (pdfHeight - imgInPdfHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, imgInPdfWidth, imgInPdfHeight);
        
        const pageCount = pdf.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(100);
            pdf.text(`Récapitulatif J'arrive Québec - Simulateur Arrima (Estimation) - Page ${i} de ${pageCount}`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });
        }

        pdf.save('Recapitulatif_Simulation_Arrima_JarriveQuebec.pdf');
        pdfStatus.textContent = "PDF généré !";
        setTimeout(() => { pdfStatus.textContent = ""; }, 3000);
    }).catch(error => {
        console.error("Erreur lors de la génération du PDF:", error);
        pdfStatus.textContent = "Erreur lors de la génération.";
    });
}


// --- INITIALIZATION ON PAGE LOAD ---

window.onload = () => {
    // Populate all the radio button groups
    populateRadioGroup('marital_status_radiogroup', D_ARRIMA.maritalStatus, 'marital_status_radio', false, true); 
    populateRadioGroup('fr_co_radiogroup_dp', D_ARRIMA.frLangLevelsDP_Oral, 'fr_co_radio_dp');
    populateRadioGroup('fr_po_radiogroup_dp', D_ARRIMA.frLangLevelsDP_Oral, 'fr_po_radio_dp');
    populateRadioGroup('fr_ce_radiogroup_dp', D_ARRIMA.frLangLevelsDP_Ecrit, 'fr_ce_radio_dp', true);
    populateRadioGroup('fr_pe_radiogroup_dp', D_ARRIMA.frLangLevelsDP_Ecrit, 'fr_pe_radio_dp', true);
    populateRadioGroup('en_co_radiogroup_dp', D_ARRIMA.enLangLevelsDP, 'en_co_radio_dp');
    populateRadioGroup('en_po_radiogroup_dp', D_ARRIMA.enLangLevelsDP, 'en_po_radio_dp');
    populateRadioGroup('en_ce_radiogroup_dp', D_ARRIMA.enLangLevelsDP, 'en_ce_radio_dp', true);
    populateRadioGroup('en_pe_radiogroup_dp', D_ARRIMA.enLangLevelsDP, 'en_pe_radio_dp', true);
    populateRadioGroup('education_radiogroup_dp', D_ARRIMA.educationLevelsDP, 'education_radio_dp');
    populateRadioGroup('domaine_formation_radiogroup_dp', D_ARRIMA.domaineFormationDP, 'domaine_formation_radio_dp');
    populateRadioGroup('experience_radiogroup_dp', D_ARRIMA.experienceLevelsDP, 'experience_radio_dp');
    populateRadioGroup('diplome_qc_radiogroup_dp', D_ARRIMA.diplomeQC_DP, 'diplome_qc_radio_dp', true);
    populateRadioGroup('experience_qc_radiogroup_dp', D_ARRIMA.experienceQC_DP, 'experience_qc_radio_dp', true);
    populateRadioGroup('fr_co_radiogroup_sp', D_ARRIMA.frLangLevelsSP_Oral, 'fr_co_radio_sp');
    populateRadioGroup('fr_po_radiogroup_sp', D_ARRIMA.frLangLevelsSP_Oral, 'fr_po_radio_sp');
    populateRadioGroup('education_radiogroup_sp', D_ARRIMA.educationLevelsSP, 'education_radio_sp');
    populateRadioGroup('domaine_formation_radiogroup_sp', D_ARRIMA.domaineFormationSP, 'domaine_formation_radio_sp');
    populateRadioGroup('offre_emploi_radiogroup', D_ARRIMA.offreEmploiValidee, 'offre_emploi_radio', true);
    populateRadioGroup('famille_qc_radiogroup', D_ARRIMA.familleQC, 'famille_qc_radio', true);

    // Initial setup and calculation
    toggleSpouseSection(); 
    calculatePoints();
    
    // NEW: Activate the email gate logic
    setupEmailGateAndWebhook(); 
};
