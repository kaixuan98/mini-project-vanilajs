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
    formSteps[currentStep].classList.add("form__page--active");
    progressSteps[currentStep].classList.add("progress-bar__step--active");
    progressSteps.forEach((step, index) => {
        step.classList.toggle('progress-bar__step--inactive', index !== currentStep);
    })
}

// add click event on the next and prev button (event bubbling to multisetp form)
multiStepForm.addEventListener("click" , (e) => {
    // when click the next button it will return a button
    if (e.target.matches('[data-next]')){
        currentStep += 1;
    }else{
        currentStep -= 1; 
    }

    showCurrentStep();
    showProgress();
})

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







