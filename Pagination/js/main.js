

const page = document.querySelector('#page'); 

function paginationButton (totalPage, maxPageVisibility = 10, currentPage = 1){
    let pages = pageNumber(totalPage, maxPageVisibility, currentPage);  // get the pages that we need to show
    let currentPageBtn = null;  // the current pages is null 
    const buttons = new Map(); // a map with all the buttons, key : the button element, value is it disable for that button (bool)
    const disabled = {
        start: () => pages[0] === 1 ,  // this will be true if the first in the pages list is 1 ( that mean the first set of pages)
        prev: () => currentPage === 1 || currentPage > totalPage, // this will be true is my current page is 1 ( that means I cant go prev )
        next: () => pages.slice(-1)[0] === totalPage,  // slice the last one and see whether it matches the end of the pages 
        end: () => currentPage >= totalPage
    }

    // create the fragment for the div 
    const frag = document.createDocumentFragment();
    const paginationBtnGroup = document.createElement('div')
    paginationBtnGroup.setAttribute('class', 'pagination__btn-container')

    // get the label, class, is it disable, handleClick function -> will update the buttons
    const createPaginationButtons = (label="", cls="", isDisable=false, handleClick) => {
        const btn = document.createElement('button'); 
        btn.className = `pagination__btn ${cls}`
        btn.textContent = label; 
        btn.disabled = isDisable; 
        btn.addEventListener('click', e => {
            handleClick(e); 
            this.update();
            paginationBtnGroup.value = currentPage; 
            paginationBtnGroup.dispatchEvent(new CustomEvent('change', {detail: {currentPageBtn}}))
        })

        return btn; 
    }

    // when the button is clicked need to set the current page number 
    const onPageButtonClicked = e => currentPage = Number(e.currentTarget.textContent)
    

    // when the button clicked and need to be update 
    const onPageButtonUpdate = index => (btn) =>  {
        btn.textContent = pages[index]; // the text will be update based on the pages array 

        if(pages[index] === currentPage){
            currentPageBtn.classList.remove('pagination__btn--active');
            btn.classList.add('pagination__btn--active');
            currentPageBtn = btn; 
            currentPageBtn.focus(); 
        }
    }

    // set the btn elements 
    // start button 
    buttons.set(
        createPaginationButtons('start', 'pagination__btn--start-page' , disabled.start(), () => currentPage = 1 ),
        (btn) => btn.disabled = disabled.start()
    )

    // prev button
    buttons.set(
        createPaginationButtons('prev', 'pagination__btn--prev-page', disabled.prev(), ()=> currentPage -= 1 ),
        (btn) => btn.disabled = disabled.prev()
    )
    // loop for the maxPageVisibility 
    pages.map( (pageNo, index) => {
        const isCurrentPage = currentPage === pageNo; 
        const btn = createPaginationButtons(pageNo, isCurrentPage? 'pagination__btn--active': '', false, onPageButtonClicked); 

        if(isCurrentPage){
            currentPageBtn = btn; 
        }

        buttons.set(btn, onPageButtonUpdate(index));
    })

    // next button 
    buttons.set(
        createPaginationButtons('next', 'pagination__btn--next-page', disabled.next() , ()=> currentPage += 1 ),
        (btn) => btn.disabled = disabled.next()
    )

    // end button
    buttons.set(
        createPaginationButtons('end', 'pagination__btn--end-page', disabled.end() , () => currentPage = totalPage),
        (btn) => btn.disabled = disabled.end()
    )

    console.log(buttons)
    // append the buttons in map into the fragment 
    buttons.forEach( (_,btn) => frag.appendChild(btn));
    paginationBtnGroup.appendChild(frag);

    // render function will append the group of buttons into the body 
    this.render = (container = document.body ) => {
        container.appendChild(paginationBtnGroup);
    }

    // will update the buttons pages numbers
    this.update = (newPageNumber = currentPage) => {
        currentPage = newPageNumber;
        pages = pageNumber(totalPage, maxPageVisibility, currentPage);
        buttons.forEach((updateButton, btn) => updateButton(btn))
    }

    this.onChange = (handler) => {
        paginationBtnGroup.addEventListener('change', handler);
    }

}

// build the buttons 
const paginationButtons = new paginationButton(20,5);
paginationButtons.render();
paginationButtons.onChange(e => {
    console.log('--changed', e.target.value);
})




// helper function to set the current page
// output will give the current set of array that need to display 
// arg: total - the number of pages need to shown, max - the max from the data, current - current page number
function pageNumber(total, max, current){

    const half = Math.floor(max/2); // this is get the half point if the list of number to be shown 
    let to = max; 

    // if my current page + the remaining half is more than the total can be shown - set the to(current ending) to total 
    if(current + half >= total){
        to = total; 
    }else if (current > half){
        to = current + half;
    }

    let from = Math.max(to - max, 0);

    // return the array of pages that will need to show on the front end 
    return Array.from({length: Math.min(total, max)}, (_, i) => (i + 1) + from); // the + 1 is to round back to page 1 
}