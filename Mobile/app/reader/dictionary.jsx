
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class WordTrie {

    constructor(wordList, closeMatchLength = 3) {
        this.root = {};

        this.addWords(wordList);

        this.minLengthRatio = closeMatchLength;
    }

    addWords(wordList){

        for (const word of wordList) {
            this.addWord(word.toLowerCase(), word.toLowerCase(), this.root);
        }
    }

    addWord(word, segment, node) {
        if (!segment.length) {
            node.word = word;
            return;
        }

        const letter = segment[0];

        if (!node[letter]) {
            node[letter] = {};
        }

        this.addWord(word, segment.substring(1), node[letter]);
    }

    closestMatch(word, sufix = false) {

        const multipleWords = word.split(/(?:\:|,|-)/);

        console.log(multipleWords)

        if(multipleWords.length > 1) 
            return multipleWords.flatMap(w => this.closestMatch(w));


        let node = this.root;

        let matchedLetters = [];

        for (const letter of word.toLowerCase()) {

            if (!node[letter]) break;

            node = node[letter];

            matchedLetters.push(letter);
        }

        const closestMatch = matchedLetters.join('');

        if (!node) return [closestMatch];

        console.log(closestMatch, closestMatch.length > this.minLengthRatio)

        return this.getAllChildren(node).map(w => sufix ? w + closestMatch : closestMatch + w)
                                        .filter(guess => closestMatch.length > this.minLengthRatio);
    }

    getAllChildren(node) {
        const children = [];

        for (const [key, value] of Object.entries(node)) {
            if (key === "word") continue;
            const wordsFromChild = this.getAllChildren(value);
            for (const word of wordsFromChild) {
                children.push(key + word);
            }
        }

        return children.length > 0 ? children : [''];
    }
}

export class DictionaryHandler {

    constructor(dictionary, language="Deutsch", storageKey="dictionary") {
        this.palavras = new Set();
        this.traducoes = {};
        this.dictionary = dictionary;
        this.language = language;
        this.storageKey = storageKey;

        this.traducoes.traducoesIncompletas = [];

        // Carregar traduções do armazenamento local
        this.loadTranslations(language);

        const reverseString = word => word.split('').reverse().join('');

        // Atualizar radicais com as palavras atualmente no dicionário
        this.prefixes = new WordTrie(Object.keys(this.dictionary));
        this.sufixes  = new WordTrie(Object.keys(this.dictionary).map(reverseString), 5);

        this.update();


    }
    
    //Método para colocar palavras sem uso de IA
    async put(palavra) {
        palavra = palavra.toLowerCase();

        if (this.palavras.has(palavra)) {
            console.log("palavra repetida");
        }

        else if (this.getTranslation(palavra)) {
            this.traducoes[palavra] = this.getTranslation(palavra);
        } else {

            const samePrefix = this.prefixes.closestMatch(palavra);

            // const sameSufix  = this.sufixes.closestMatch(palavra, true);

            // const similarWords = new Set(samePrefix.concat(sameSufix));

            const traducoesProximas = samePrefix.map(
                (p,i) => `\t   ${i}: ${p} -> ${this.dictionary[p]}, \t`)

            // let i = 0;

            console.log(samePrefix, traducoesProximas)


            //TODO: Deveria armazenar um objeto, separar responsabilidades
            this.traducoes[palavra] = "traduções mais próximas:   " + traducoesProximas;

            if(traducoesProximas.length == 0) this.traducoes[palavra] = "Não encontrada"

            if(!this.traducoes.traducoesIncompletas.includes(palavra))
                this.traducoes.traducoesIncompletas.push(palavra);

            console.log("incomplete", this.traducoes.traducoesIncompletas)
        }

        this.palavras.add(palavra);

        // Salvar traduções no armazenamento local sempre que uma nova é adicionada
        await this.saveTranslations();
    }

    getTranslation(palavra) {
        if(this.traducoes[palavra]) return this.traducoes[palavra];

        //Só usa o dicionário do alemão se estiver no alemão
        if(this.dictionary[palavra] && this.language == "Deutsch") return this.dictionary[palavra];
    }

    traducaoIncompleta(palavra){
        return this.traducoes.traducoesIncompletas.find(a => a==palavra)
    }

    hasValidTranslation(palavra){
        return this.traducoes[palavra] != undefined && !this.traducaoIncompleta(palavra)
    }

    async receiveAITranslation(palavra, traducao){
        this.traducoes[palavra] = traducao;

        if(this.traducaoIncompleta(palavra)) 
            this.traducoes.traducoesIncompletas = this.traducoes.traducoesIncompletas.filter(t => t!= palavra)

        this.update();

        await this.saveTranslations();
    }

    async saveTranslations(language=this.language) {
        try {
            await AsyncStorage.setItem(this.storageKey + language, JSON.stringify(this.traducoes));
        } catch (error) {
            console.error("Erro ao salvar traduções:", error);
        }
    }

    async loadTranslations(language=this.language) {
        try {
            const storedTranslations = await AsyncStorage.getItem(this.storageKey + language);
            if (storedTranslations) {
                this.traducoes = JSON.parse(storedTranslations);
                // Sincronizar o conjunto de palavras com as traduções carregadas
                this.palavras = new Set(Object.keys(this.traducoes));

                if(!this.traducoes.traducoesIncompletas){
                     this.traducoes.traducoesIncompletas = [];

                }
            }
        } catch (error) {
            console.error("Erro ao carregar traduções:", error);
        }
    }

    update(){

        //Insere traduções encontradas como palavras
        for(const [word, translation] of Object.entries(this.traducoes)){
            this.dictionary[word] = translation;
        }

        const reverseString = word => word.split('').reverse().join('');

        // Atualizar radicais com as palavras atualmente no dicionário
        const palavrasValidas = Object.keys(this.traducoes).filter(palavra => this.hasValidTranslation(palavra));

        this.prefixes.addWords(palavrasValidas);
        this.sufixes.addWords(palavrasValidas.map(reverseString));
    }

    async changeLanguage(language){
        await this.saveTranslations();

        this.language = language;

        if(!this.traducoes.traducoesIncompletas) this.traducoes.traducoesIncompletas = [];

        await this.loadTranslations();
        
        console.log("Mudou linguagem",language, this.traducoes)

        return this;
    }
}