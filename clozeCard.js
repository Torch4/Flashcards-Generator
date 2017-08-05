function clozeCard(text, cloze) {
    this.text = text.split(cloze);
    this.cloze = cloze;
    this.clozeRemoved = function () {
        return `${this.text[0]} ... ${this.text[1]}`;  
    };
};

module.exports = clozeCard; 
