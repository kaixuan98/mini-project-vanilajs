const page = document.querySelector("#page");
const multiStepForm = document.querySelector(".form");
const formSteps = [...document.querySelectorAll('.form__page')]; 
const progressSteps = [...document.querySelectorAll('.progress-bar__step')];


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







