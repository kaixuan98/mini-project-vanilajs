const page = document.querySelector("#page");
const multiStepForm = document.querySelector(".form");
const formSteps = [...document.querySelectorAll('.form__page')]; 
const progressSteps = [...document.querySelectorAll('.progress-bar__step')];
const reviewPage = document.querySelector('.form__review');


// 1. set current active step 
// find the current step in my form
let currentStep = formSteps.findIndex(step => {
    return step.classList.contains("form__page--active"); 
})

// whether is there an active class
if (currentStep < 0 ){
    currentStep = 0; 
    showCurrentStep();
    showProgress();
}


// TODO: add click event on the progress bar to go back and forth


// add click event on the next and prev button (event bubbling to multisetp form)
multiStepForm.addEventListener("click" , (e) => {
    // when click the next button it will return a button
    let incrementor;
    if (e.target.matches('[data-next]')){
        incrementor = 1;
    }else{
        incrementor = -1; 
    }
    
    // this is to prevent form refreshed when click to fill in 
    // since we are handling the click at the parent
    if(incrementor === null) return;

    // validate the form before move to the next step
    // the values are required, clean(right formate)
    const inputs = [...formSteps[currentStep].querySelectorAll('input')]
    // validity is in combination with required in html tag
    const allValid = inputs.every(input => input.reportValidity()); 
    if(allValid){
        currentStep += incrementor;
        showCurrentStep();
        showProgress();
    }

    if(currentStep === 3){
        const sectionsFilledInput = getFilledInSections();
        const personalSection = createReviewSection(sectionsFilledInput.personal);
        const shippingSection = createReviewSection(sectionsFilledInput.shipping);
        const paymentSection = createReviewSection(sectionsFilledInput.payment);

        // personalSection.setAttribute('class', "section-card");
        // shippingSection.setAttribute('class', "section-card");
        // paymentSection.setAttribute('class', "section-card");

        console.log(personalSection);
        console.log(shippingSection);
        console.log(paymentSection);

        reviewPage.appendChild(personalSection);
        reviewPage.appendChild(shippingSection);
        reviewPage.appendChild(paymentSection);

        // add a button to submit
    }

})

//  helper functions
function showCurrentStep(){
    formSteps.forEach( (step, index) => {
        step.classList.toggle("form__page--active", index === currentStep)
    })
}

function showProgress(){
    progressSteps.forEach( (step,index) => {
        step.classList.toggle('progress-bar__step--active', index === currentStep)
        step.classList.toggle('progress-bar__step--done', index < currentStep);
        step.classList.toggle('progress-bar__step--inactive', index > currentStep);
    })
}

function getFilledInSections(){
    let personal = []; 
    let shipping =  [];
    let payment = [];
    // form step is each form page 
    formSteps.forEach( (step, index) => {
        const formGroup = step.querySelector('.form__group');
        if(index === 0){ // first page is one section
            personal = [...formGroup.querySelectorAll('.input-group')];
        }else if(index === 1){ // second page is another section
            shipping = [...formGroup.querySelectorAll('.input-group')];
        }else{
            payment = [...formGroup.querySelectorAll('.input-group')];
        }
    })
    return { personal:personal, shipping:shipping, payment:payment};
}


// each section is a card 
function createReviewSection(sectionData){
    const section = document.createDocumentFragment();

    // looping the array
    sectionData.forEach( inputGroup => {
        // get the label and value
        const label = inputGroup.querySelector('.input-group__label').innerText;
        const value = inputGroup.querySelector('.input-group__input').value;
        // create a div for label and value and wrap it in a div 
        const inputShowCase = document.createElement('div');
        const inputShowCaseLabel = document.createElement('p');
        const inputShowCaseValue = document.createElement('p');

        inputShowCase.setAttribute('class', 'input-showcase');
        inputShowCaseLabel.setAttribute('class', 'input-showcase__label');
        inputShowCaseValue.setAttribute('class', 'input-showcase__value');

        inputShowCaseLabel.innerText = label;
        inputShowCaseValue.innerText = value;

        // append to the outerdiv
        inputShowCase.appendChild(inputShowCaseLabel);
        inputShowCase.appendChild(inputShowCaseValue);

        // append to the section 
        section.appendChild(inputShowCase);
    })


    return section;

}








