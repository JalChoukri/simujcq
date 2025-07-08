// Global variables
let currentSection = 0;
const totalSections = 6;
let hasSpouse = false;
let calculatorResults = null;

// Scoring data
const scoringData = {
    age: {'18-19':110,'20-30':120,'31':110,'32':100,'33':90,'34':80,'35':75,'36':70,'37':65,'38':60,'39':55,'40':50,'41':40,'42':30,'43':20,'44':10,'45+':0},
    ageWithSpouse: {'18-19':90,'20-30':100,'31':95,'32':90,'33':81,'34':72,'35':68,'36':63,'37':59,'38':54,'39':50,'40':45,'41':36,'42':27,'43':18,'44':9,'45+':0},
    spouseAge: {'16-19':18,'20-30':20,'31':18,'32':17,'33':16,'34':15,'35':14,'36':12,'37':10,'38':8,'39':7,'40':6,'41':5,'42':4,'43':3,'44':2,'45+':0},
    french: {'1-4':0,'5-6':38,'7-8':44,'9-10':50,'11-12':50},
    frenchWithSpouse: {'1-4':0,'5-6':30,'7-8':35,'9-10':40,'11-12':40},
    spouseFrench: {'1-3':0,'4':4,'5-6':6,'7-8':8,'9-10':10,'11-12':10},
    education: {'secondaire-general':13,'secondaire-pro-600':13,'secondaire-pro-900':26,'secondaire-pro-1an':26,'postsecondaire-general':39,'postsecondaire-tech-900':52,'postsecondaire-tech-1-2':52,'postsecondaire-tech-3':78,'universitaire-1-1':78,'universitaire-1-2':91,'universitaire-1-3-4':104,'universitaire-1-5':110,'universitaire-2-1':110,'universitaire-2-2':117,'universitaire-medical':130,'universitaire-3':130},
    educationWithSpouse: {'secondaire-general':11,'secondaire-pro-600':11,'secondaire-pro-900':22,'secondaire-pro-1an':22,'postsecondaire-general':33,'postsecondaire-tech-900':44,'postsecondaire-tech-1-2':44,'postsecondaire-tech-3':66,'universitaire-1-1':66,'universitaire-1-2':77,'universitaire-1-3-4':88,'universitaire-1-5':93,'universitaire-2-1':93,'universitaire-2-2':99,'universitaire-medical':110,'universitaire-3':110},
    spouseEducation: {'secondaire-general':2,'secondaire-pro-600':2,'secondaire-pro-900':4,'secondaire-pro-1an':4,'postsecondaire-general':6,'postsecondaire-tech-900':8,'postsecondaire-tech-1-2':8,'postsecondaire-tech-3':12,'universitaire-1-1':12,'universitaire-1-2':14,'universitaire-1-3-4':16,'universitaire-1-5':17,'universitaire-2-1':17,'universitaire-2-2':18,'universitaire-medical':20,'universitaire-3':20},
    workExperience: {'0-11':0,'12-23':20,'24-35':40,'36-47':50,'48+':70},
    workExperienceWithSpouse: {'0-11':0,'12-23':15,'24-35':30,'36-47':35,'48+':50},
    quebecDiploma: {'aucun':0,'secondaire-general':20,'secondaire-pro-600':20,'secondaire-pro-900':40,'postsecondaire-general':60,'postsecondaire-tech-900':80,'postsecondaire-tech-3':120,'universitaire-1-1':120,'universitaire-1-2':140,'universitaire-1-3-4':160,'universitaire-1-5':170,'universitaire-2-1':170,'universitaire-2-2':180,'universitaire-medical':200,'universitaire-3':200},
    spouseQuebecDiploma: {'aucun':0,'secondaire-general':3,'secondaire-pro-600':3,'secondaire-pro-900':6,'postsecondaire-general':9,'postsecondaire-tech-900':12,'postsecondaire-tech-3':18,'universitaire-1-1':18,'universitaire-1-2':21,'universitaire-1-3-4':24,'universitaire-1-5':25,'universitaire-2-1':25,'universitaire-2-2':27,'universitaire-medical':30,'universitaire-3':30},
    quebecWorkExperience: {'0-11':0,'12-23':40,'24-35':80,'36-47':120,'48-60':160},
    spouseQuebecWork: {'0-5':0,'6-11':5,'12-23':10,'24-35':15,'36-47':23,'48-60':30},
    jobOffer: {'aucun':0,'exterieur-cmm':50,'interieur-cmm':30},
    familyMember: {'aucun':0,'lie-ressortissant':10,'lie-conjoint':5}
};

const sectionData = [
    {icon:'👤',name:'Profil'},{icon:'🗣️',name:'Français'},{icon:'🎓',name:'Formation'},
    {icon:'🍁',name:'Québec'},{icon:'💼',name:'Emploi'},{icon:'👫',name:'Conjoint'}
];

document.addEventListener('DOMContentLoaded',function(){
    initializeDisclaimer();
    initializeApp();
});

function initializeDisclaimer(){
    const checkbox=document.getElementById('disclaimer-checkbox');
    const acceptButton=document.getElementById('accept-disclaimer');
    checkbox.addEventListener('change',function(){acceptButton.disabled=!this.checked});
    acceptButton.addEventListener('click',function(){
        if(checkbox.checked){
            document.getElementById('disclaimer-screen').style.display='none';
            document.getElementById('main-app').style.display='block';
            updateSectionDisplay();
        }
    });
}

function initializeApp(){
    initializeNavigation();
    initializeFormHandlers();
    initializeSpouseToggle();
    initializeResultsHandlers();
    updateSectionDisplay();
    updateNavigation();
    updateProgressBar();
}

function initializeNavigation(){
    document.querySelectorAll('.nav-button, .mobile-nav-button').forEach(button=>{
        button.addEventListener('click',function(){
            const section=this.dataset.section;
            if(section==='results'){showResults()}
            else{navigateToSection(parseInt(section))}
        });
    });
    document.getElementById('prev-btn').addEventListener('click',function(){if(currentSection>0){navigateToSection(currentSection-1)}});
    document.getElementById('next-btn').addEventListener('click',function(){if(currentSection<totalSections-1){navigateToSection(currentSection+1)}});
    document.getElementById('calculate-btn').addEventListener('click',function(){calculateAndShowResults()});
}

function initializeFormHandlers(){
    document.querySelectorAll('select, input[type="radio"]').forEach(input=>{input.addEventListener('change',function(){calculateScore()})});
}

function initializeSpouseToggle(){
    document.querySelectorAll('input[name="hasSpouse"]').forEach(radio=>{
        radio.addEventListener('change',function(){
            hasSpouse=this.value==='true';
            toggleSpouseFields();
            updateMaxPointsDisplays();
            calculateScore();
        });
    });
}

function initializeResultsHandlers(){
    document.getElementById('download-results').addEventListener('click',downloadResults);
    document.getElementById('reset-calculator').addEventListener('click',resetCalculator);
    document.getElementById('email-form').addEventListener('submit',handleEmailSubmit);
}

function toggleSpouseFields(){
    const spouseAgeGroup=document.getElementById('spouse-age-group');
    const spouseContent=document.getElementById('spouse-content');
    const noSpouseContent=document.getElementById('no-spouse-content');
    if(spouseAgeGroup){spouseAgeGroup.style.display=hasSpouse?'block':'none'}
    if(spouseContent&&noSpouseContent){
        spouseContent.style.display=hasSpouse?'block':'none';
        noSpouseContent.style.display=hasSpouse?'none':'block';
    }
}

function updateMaxPointsDisplays(){
    const ageMaxPoints=document.getElementById('age-max-points');
    const frenchMaxPoints=document.getElementById('french-max-points');
    const educationMaxPoints=document.getElementById('education-max-points');
    const workMaxPoints=document.getElementById('work-max-points');
    if(ageMaxPoints)ageMaxPoints.textContent=hasSpouse?'100 points':'120 points';
    if(frenchMaxPoints)frenchMaxPoints.textContent=hasSpouse?'160 points':'200 points';
    if(educationMaxPoints)educationMaxPoints.textContent=hasSpouse?'110 points':'130 points';
    if(workMaxPoints)workMaxPoints.textContent=hasSpouse?'50 points':'70 points';
}

function navigateToSection(sectionIndex){
    currentSection=sectionIndex;
    updateSectionDisplay();
    updateNavigation();
    updateProgressBar();
    document.getElementById('form-pages').style.display='block';
    document.getElementById('results-page').style.display='none';
    window.scrollTo({top:0,behavior:'smooth'});
}

function updateSectionDisplay(){
    document.querySelectorAll('.form-section').forEach(section=>{section.classList.remove('active')});
    const currentSectionElement=document.getElementById(`section-${currentSection}`);
    if(currentSectionElement){currentSectionElement.classList.add('active')}
    const sectionIcon=document.getElementById('section-icon');
    const sectionName=document.getElementById('section-name');
    if(sectionIcon&&sectionName&&sectionData[currentSection]){
        sectionIcon.textContent=sectionData[currentSection].icon;
        sectionName.textContent=sectionData[currentSection].name;
    }
}

function updateNavigation(){
    document.querySelectorAll('.nav-button, .mobile-nav-button').forEach((button,index)=>{
        button.classList.remove('active');
        if(parseInt(button.dataset.section)===currentSection){button.classList.add('active')}
    });
    const prevBtn=document.getElementById('prev-btn');
    const nextBtn=document.getElementById('next-btn');
    const calculateBtn=document.getElementById('calculate-btn');
    if(prevBtn)prevBtn.disabled=currentSection===0;
    if(currentSection===totalSections-1){
        if(nextBtn)nextBtn.style.display='none';
        if(calculateBtn)calculateBtn.style.display='flex';
    }else{
        if(nextBtn)nextBtn.style.display='flex';
        if(calculateBtn)calculateBtn.style.display='none';
    }
}

function updateProgressBar(){
    const progressFill=document.getElementById('progress-fill');
    const progressText=document.getElementById('progress-text');
    if(progressFill&&progressText){
        const progress=((currentSection+1)/totalSections)*100;
        progressFill.style.width=`${progress}%`;
        progressText.textContent=`Section ${currentSection+1} sur ${totalSections}`;
    }
}

function getFormValue(id){
    const element=document.getElementById(id);
    if(!element)return'';
    if(element.type==='radio'){
        const checked=document.querySelector(`input[name="${element.name}"]:checked`);
        return checked?checked.value:'';
    }
    return element.value;
}

function calculateScore(){
    let totalScore=0;
    let breakdown={};
    const age=getFormValue('age');
    const ageScoreData=hasSpouse?scoringData.ageWithSpouse:scoringData.age;
    const ageScore=ageScoreData[age]||0;
    breakdown.age=ageScore;
    totalScore+=ageScore;
    if(hasSpouse){
        const spouseAge=getFormValue('spouseAge');
        const spouseAgeScore=scoringData.spouseAge[spouseAge]||0;
        breakdown.spouseAge=spouseAgeScore;
        totalScore+=spouseAgeScore;
    }
    const frenchScoreData=hasSpouse?scoringData.frenchWithSpouse:scoringData.french;
    const frenchOral=getFormValue('frenchOral');
    const frenchOralProd=getFormValue('frenchOralProduction');
    const frenchWritten=getFormValue('frenchWritten');
    const frenchWrittenProd=getFormValue('frenchWrittenProduction');
    const frenchOralScore=frenchScoreData[frenchOral]||0;
    const frenchOralProdScore=frenchScoreData[frenchOralProd]||0;
    const frenchWrittenScore=frenchScoreData[frenchWritten]||0;
    const frenchWrittenProdScore=frenchScoreData[frenchWrittenProd]||0;
    breakdown.frenchOral=frenchOralScore;
    breakdown.frenchOralProd=frenchOralProdScore;
    breakdown.frenchWritten=frenchWrittenScore;
    breakdown.frenchWrittenProd=frenchWrittenProdScore;
    breakdown.frenchTotal=frenchOralScore+frenchOralProdScore+frenchWrittenScore+frenchWrittenProdScore;
    totalScore+=breakdown.frenchTotal;
    const education=getFormValue('education');
    const educationScoreData=hasSpouse?scoringData.educationWithSpouse:scoringData.education;
    const educationScore=educationScoreData[education]||0;
    breakdown.education=educationScore;
    totalScore+=educationScore;
    const workExperience=getFormValue('workExperience');
    const workScoreData=hasSpouse?scoringData.workExperienceWithSpouse:scoringData.workExperience;
    const workExperienceScore=workScoreData[workExperience]||0;
    breakdown.workExperience=workExperienceScore;
    totalScore+=workExperienceScore;
    const quebecDiploma=getFormValue('quebecDiploma');
    const quebecDiplomaScore=scoringData.quebecDiploma[quebecDiploma]||0;
    breakdown.quebecDiploma=quebecDiplomaScore;
    totalScore+=quebecDiplomaScore;
    const quebecWorkExperience=getFormValue('quebecWorkExperience');
    const quebecWorkScore=scoringData.quebecWorkExperience[quebecWorkExperience]||0;
    breakdown.quebecWork=quebecWorkScore;
    totalScore+=quebecWorkScore;
    const jobOffer=getFormValue('jobOffer');
    const jobOfferScore=scoringData.jobOffer[jobOffer]||0;
    breakdown.jobOffer=jobOfferScore;
    totalScore+=jobOfferScore;
    const familyMember=getFormValue('familyMember');
    const familyScore=scoringData.familyMember[familyMember]||0;
    breakdown.family=familyScore;
    totalScore+=familyScore;
    if(hasSpouse){
        const spouseFrench=getFormValue('spouseFrench');
        const spouseFrenchScore=scoringData.spouseFrench[spouseFrench]||0;
        breakdown.spouseFrench=spouseFrenchScore;
        totalScore+=spouseFrenchScore;
        const spouseEducation=getFormValue('spouseEducation');
        const spouseEducationScore=scoringData.spouseEducation[spouseEducation]||0;
        breakdown.spouseEducation=spouseEducationScore;
        totalScore+=spouseEducationScore;
        const spouseQuebecDiploma=getFormValue('spouseQuebecDiploma');
        const spouseQuebecDiplomaScore=scoringData.spouseQuebecDiploma[spouseQuebecDiploma]||0;
        breakdown.spouseQuebecDiploma=spouseQuebecDiplomaScore;
        totalScore+=spouseQuebecDiplomaScore;
        const spouseQuebecWork=getFormValue('spouseQuebecWork');
        const spouseQuebecWorkScore=scoringData.spouseQuebecWork[spouseQuebecWork]||0;
        breakdown.spouseQuebecWork=spouseQuebecWorkScore;
        totalScore+=spouseQuebecWorkScore;
    }
    calculatorResults={totalScore:totalScore,breakdown:breakdown,hasSpouse:hasSpouse};
    return totalScore;
}

function calculateAndShowResults(){
    calculateScore();
    showResults();
}

function showResults(){
    document.getElementById('form-pages').style.display='none';
    document.getElementById('results-page').style.display='block';
    document.querySelectorAll('.nav-button, .mobile-nav-button').forEach(button=>{
        button.classList.remove('active');
        if(button.dataset.section==='results'){button.classList.add('active')}
    });
    updateResultsDisplay();
    window.scrollTo({top:0,behavior:'smooth'});
}

function updateResultsDisplay(){
    if(!calculatorResults){calculateScore()}
    const results=calculatorResults;
    const breakdown=results.breakdown;
    const totalScoreElement=document.getElementById('total-score');
    if(totalScoreElement){totalScoreElement.textContent=`${results.totalScore} points`}
    const updateElement=(id,value)=>{
        const element=document.getElementById(id);
        if(element)element.textContent=`${value||0} pts`;
    };
    updateElement('french-oral',breakdown.frenchOral);
    updateElement('french-oral-prod',breakdown.frenchOralProd);
    updateElement('french-written',breakdown.frenchWritten);
    updateElement('french-written-prod',breakdown.frenchWrittenProd);
    updateElement('french-total',breakdown.frenchTotal);
    updateElement('quebec-diploma',breakdown.quebecDiploma);
    updateElement('quebec-work',breakdown.quebecWork);
    updateElement('age-score',breakdown.age);
    updateElement('education-score',breakdown.education);
    updateElement('work-experience-score',breakdown.workExperience);
    updateElement('job-offer-score',breakdown.jobOffer);
    updateElement('family-score',breakdown.family);
    updateElement('profession-score',0);
    updateElement('authorization-score',0);
    updateElement('study-score',0);
    updateElement('outside-montreal-score',0);
    const spouseBreakdown=document.getElementById('spouse-breakdown');
    if(spouseBreakdown){
        if(results.hasSpouse){
            spouseBreakdown.style.display='block';
            updateElement('spouse-french-score',breakdown.spouseFrench);
            updateElement('spouse-age-score',breakdown.spouseAge);
            updateElement('spouse-quebec-work-score',breakdown.spouseQuebecWork);
            updateElement('spouse-education-score',breakdown.spouseEducation);
            updateElement('spouse-quebec-diploma-score',breakdown.spouseQuebecDiploma);
        }else{
            spouseBreakdown.style.display='none';
        }
    }
}

function downloadResults(){
    if(!calculatorResults){alert('Veuillez d\'abord calculer votre score.');return}
    const results=calculatorResults;
    const breakdown=results.breakdown;
    let content=`RÉSULTATS DU CALCULATEUR ARRIMA PSTQ 2025\n`;
    content+=`===========================================\n\n`;
    content+=`Score total: ${results.totalScore} points sur 1400\n\n`;
    content+=`DÉTAIL DES POINTS:\n\n`;
    content+=`Compétences linguistiques (Français):\n`;
    content+=`- Compréhension orale: ${breakdown.frenchOral||0} pts\n`;
    content+=`- Production orale: ${breakdown.frenchOralProd||0} pts\n`;
    content+=`- Compréhension écrite: ${breakdown.frenchWritten||0} pts\n`;
    content+=`- Production écrite: ${breakdown.frenchWrittenProd||0} pts\n`;
    content+=`- Sous-total français: ${breakdown.frenchTotal||0} pts\n\n`;
    content+=`Facteurs Québec:\n`;
    content+=`- Diplôme du Québec: ${breakdown.quebecDiploma||0} pts\n`;
    content+=`- Expérience de travail au Québec: ${breakdown.quebecWork||0} pts\n\n`;
    content+=`Capital humain:\n`;
    content+=`- Âge: ${breakdown.age||0} pts\n`;
    content+=`- Niveau de scolarité: ${breakdown.education||0} pts\n`;
    content+=`- Expérience de travail: ${breakdown.workExperience||0} pts\n\n`;
    content+=`Facteurs additionnels:\n`;
    content+=`- Offre d'emploi: ${breakdown.jobOffer||0} pts\n`;
    content+=`- Famille proche au Québec: ${breakdown.family||0} pts\n\n`;
    if(results.hasSpouse){
        content+=`Facteurs conjoint:\n`;
        content+=`- Français conjoint: ${breakdown.spouseFrench||0} pts\n`;
        content+=`- Âge conjoint: ${breakdown.spouseAge||0} pts\n`;
        content+=`- Expérience conjoint: ${breakdown.spouseQuebecWork||0} pts\n`;
        content+=`- Scolarité conjoint: ${breakdown.spouseEducation||0} pts\n`;
        content+=`- Diplôme QC conjoint: ${breakdown.spouseQuebecDiploma||0} pts\n\n`;
    }
    content+=`\nCe simulateur est basé sur la grille officielle mise à jour le 2 juillet 2025.\n`;
    content+=`Il s'agit d'une estimation. Pour les informations officielles, consultez le MIFI.\n`;
    content+=`\nGénéré par le Calculateur Arrima PSTQ - J'arrive Québec`;
    const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`resultats-arrima-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function resetCalculator(){
    if(confirm('Êtes-vous sûr de vouloir recommencer le simulateur ? Toutes vos données seront perdues.')){
        document.querySelectorAll('select').forEach(select=>{select.selectedIndex=0});
        document.querySelectorAll('input[type="radio"]').forEach(radio=>{radio.checked=radio.value==='false'&&radio.name==='hasSpouse'});
        currentSection=0;
        hasSpouse=false;
        calculatorResults=null;
        toggleSpouseFields();
        updateMaxPointsDisplays();
        navigateToSection(0);
        calculateScore();
    }
}

function handleEmailSubmit(e){
    e.preventDefault();
    const email=document.getElementById('email-input').value;
    const checkboxes=document.querySelectorAll('#email-form input[type="checkbox"]');
    let allChecked=true;
    checkboxes.forEach(checkbox=>{if(!checkbox.checked){allChecked=false}});
    if(!allChecked){alert('Veuillez accepter toutes les conditions pour continuer.');return}
    const data={email:email,consent_guide:checkboxes[0].checked,consent_policy:checkboxes[1].checked};
    fetch('https://hook.eu2.make.com/cvxlt8bumn11o3shf9ordtjy1f399r15',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
    .then(response=>{
        if(response.ok){
            alert(`Merci ! Le guide sera envoyé à ${email}. Vérifiez votre boîte de réception dans quelques minutes.`);
            document.getElementById('email-form').reset();
        }else{
            alert('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
        }
    })
    .catch(()=>{alert('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.')});
}
