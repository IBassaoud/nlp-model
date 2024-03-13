class ILanguageProcessor {
    constructor(){
        if (this.constructor === ILanguageProcessor) {
            throw new TypeError('ILanguageProcessor is an interface and cannot be instantiated.');
        }
    }

    trainModel(){
        throw new Error('trainModel is not implemented');
    }

    processQuery(language, query){
        throw new Error('processQuery is not implemented');
    }
}

module.exports = ILanguageProcessor;