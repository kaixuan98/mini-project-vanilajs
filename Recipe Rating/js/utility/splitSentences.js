export function splitSentences(str){

    return str.replace(/([.?!])\s{1}(?=[A-Z])/g, "$1|").split("|");
}