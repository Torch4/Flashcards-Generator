
function clozeCard(text, cloze) {
    this.text = text.split(cloze);
    this.cloze = cloze;

};


function clozeCardPrototype() {

    this.clozeRemoved = function () {
        return `${this.text[0]} ... ${this.text[1]}`;  
    };											
};

ClozeCard.prototype = new clozeCardPrototype();

module.exports = clozeCard; 