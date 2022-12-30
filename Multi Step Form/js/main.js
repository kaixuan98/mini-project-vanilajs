
const page = document.querySelector("#page");
const multiStepForm = document.querySelector(".form");
const formSteps = [...document.querySelectorAll('.form__page')]; 
const progressSteps = [...document.querySelectorAll('.progress-bar__step')];
const reviewPage = document.querySelector('.form__review');


// find and set the current step in my form
let currentStep = formSteps.findIndex(step => {
    return step.classList.contains("form__page--active"); 
})

// if cannot find active class then set the first be the default first step
if (currentStep < 0 ){
    currentStep = 0; 
    showCurrentStep();
    showProgress();
}

// add click event on the next and prev button (event bubbling to multisetp form)
multiStepForm.addEventListener("click" , async function (e) {
        let incrementor;
        let res ; 
        if (e.target.matches('[data-next]')) {
            incrementor = 1;
        } else if (e.target.matches('[data-prev]')) {
            incrementor = -1;
        } else if (e.target.type === 'submit') {
            // if user pressed submit, it will send the response to the backend 
            e.preventDefault();
            incrementor = 1;
            const formData = new FormData(multiStepForm);
            res = await fetch('http://localhost:3000/form/submit', {
                method: 'POST',
                body: formData,
            }).then(function (response) {
                // page.appendChild(createModal(response.status));
                return response.status;
            }).catch(function (error) {
                console.log(error);
            });
        }
        else {
            incrementor = 0; //other than button, it will not increment
        }

        // validate the form before move to the next step
        if (currentStep < 3) { // this when the step is before review
            const inputs = [...formSteps[currentStep].querySelectorAll('input')];
            const allValid = inputs.every(input => input.reportValidity());
            if (allValid) {
                currentStep += incrementor;
                showCurrentStep();
                showProgress();
            }
        } else { // at review step
            currentStep += incrementor;
            showCurrentStep();
            showProgress();
        }

        if(res === 200){
            console.log([...createModal(res).children]);
            page.appendChild(createModal(res));
        }
    })

//  helper functions
function showCurrentStep(){
    const pages = [...multiStepForm.children]
    pages.forEach( (step, index) => {
        if(index >= 3 && index === currentStep){
            const reviewFrag = showReview();
            if(step.childElementCount !== 0){
                // if users go back and update, need to remove all the children before append the new one 
                // OPTIMIZE: try not to remove the child, just update them?
                while(step.firstChild){
                    step.removeChild(step.firstChild);
                }
            }
            reviewPage.appendChild(reviewFrag)
        }
        step.classList.toggle("form__page--active", index === currentStep)
    })
    // here is where we need to add for review step
}

function showReview(){
    const reviewFragment = document.createDocumentFragment();
    // get all the filled input in each step section
    const sectionsFilledInput = getFilledInSections();
                
    // need to change this to more compoment based
    const personalSection = document.createElement('div');
    const shippingSection = document.createElement('div');
    const paymentSection = document.createElement('div');

    personalSection.setAttribute('class', "section-card");
    shippingSection.setAttribute('class', "section-card");
    paymentSection.setAttribute('class', "section-card");

    let personalTitle = document.createElement('h3')
    personalTitle.setAttribute('class', 'section-card__title')
    personalTitle.innerText = "Customer Information"
    let shippingTitle = document.createElement('h3')
    shippingTitle.setAttribute('class', 'section-card__title')
    shippingTitle.innerText = "Shipping Information"
    let paymentTitle = document.createElement('h3')
    paymentTitle.setAttribute('class', 'section-card__title')
    paymentTitle.innerText = "Payment Information"

    personalSection.appendChild(personalTitle)
    shippingSection.appendChild(shippingTitle)
    paymentSection.appendChild(paymentTitle)

    personalSection.appendChild(createReviewSection(sectionsFilledInput.personal));
    shippingSection.appendChild(createReviewSection(sectionsFilledInput.shipping));
    paymentSection.appendChild(createReviewSection(sectionsFilledInput.payment));

    reviewFragment.appendChild(personalSection);
    reviewFragment.appendChild(shippingSection);
    reviewFragment.appendChild(paymentSection);

    // add a button to submit
    let prevBtn = document.createElement('button');
    let submitBtn = document.createElement('button');
    let btnGroup = document.createElement('div');

    prevBtn.setAttribute('class', 'form__button');
    prevBtn.setAttribute('type', 'button');
    prevBtn.dataset.prev = ''
    prevBtn.innerText = 'Prev';

    submitBtn.setAttribute('type', 'submit');
    submitBtn.innerText = 'Submit'
    submitBtn.setAttribute('class', 'form__button');

    btnGroup.setAttribute('class', 'form__btnGroup');
    btnGroup.appendChild(prevBtn);
    btnGroup.appendChild(submitBtn);

    reviewFragment.appendChild(btnGroup);
            
    return reviewFragment; 
}


function showProgress(){
    progressSteps.forEach( (step,index) => {
        step.classList.toggle('progress-bar__step--active', index === currentStep)
        step.classList.toggle('progress-bar__step--done', index < currentStep);
        step.classList.toggle('progress-bar__step--inactive', index > currentStep);
    })
}

// function to divide the page of form into different sections
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
        const input = inputGroup.querySelector('.input-group__input');
        let inputVal = input.value;

        // if the input type if radio need to handle it specifically and find out which one is checked 
        if(input.type  === 'radio'){
            let cardTypeGroup = [...inputGroup.children] // the input group has label and the rest are radio input
            for(let i = 1; i < cardTypeGroup.length; i++){
                let cardType = [...cardTypeGroup[i].children]
                if(cardType[0].checked){
                    inputVal = cardType[0].value;
                }
            }
        }

        // create a div for label and value and wrap it in a div 
        const inputShowCase = document.createElement('div');
        const inputShowCaseLabel = document.createElement('p');
        const inputShowCaseValue = document.createElement('p');

        inputShowCase.setAttribute('class', 'input-showcase');
        inputShowCaseLabel.setAttribute('class', 'input-showcase__label');
        inputShowCaseValue.setAttribute('class', 'input-showcase__value');

        inputShowCaseLabel.innerText = label;
        inputShowCaseValue.innerText = inputVal.length === 0? "N/A" : inputVal;

        // append to the outerdiv
        inputShowCase.appendChild(inputShowCaseLabel);
        inputShowCase.appendChild(inputShowCaseValue);

        // append to the section 
        section.appendChild(inputShowCase);
    })

    return section;

}

function createModal(status){
    const modal = document.createDocumentFragment();

    const modalDiv = document.createElement('div');
    modalDiv.setAttribute('class', 'modal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal__content');

    const modalIcon =  document.createElement('div');
    const modalMsg = document.createElement('p');

    modalIcon.setAttribute('class' ,'modal__icon');
    modalMsg.setAttribute('class' ,'modal__msg');

    if(status === 200){
        modalDiv.classList.add('modal--success');
        modalIcon.classList.add('modal__icon--success');
        // adding an icon here
        modalMsg.classList.add('modal__msg--success');
        modalMsg.innerText='Order Processes Successfully!'
    }else{
        modalDiv.classList.add('modal--error')
        modalIcon.classList.add('modal__icon--error');
        modalMsg.classList.add('modal__msg--error');
        modalMsg.innerText='Error during transaction. Please try again later.'
    }

    const close = document.createElement('button');
    close.setAttribute('class', 'form__button');
    close.innerText = 'Close'; 

    close.addEventListener('click', function(e) {
        currentStep = 0 ;
        showCurrentStep();
        showProgress();
        modalDiv.classList.add('modal--hide')
        multiStepForm.reset();
    })

    modalContent.appendChild(modalIcon);
    modalContent.appendChild(modalMsg);
    modalContent.appendChild(close);

    modalDiv.appendChild(modalContent);
    modal.appendChild(modalDiv);


    return modal;
}








