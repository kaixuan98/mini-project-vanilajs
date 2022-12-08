// remove the html tags
export function removeTags (str) {

    if(str.length === 0){
        return "";
    }

    return str.replace( /(<([^>]+)>)/ig, '')

}