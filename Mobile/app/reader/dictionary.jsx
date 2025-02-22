
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class WordTrie {

    constructor(wordList, closeMatchLength = 3) {
        this.root = {};

        for (const word of wordList) {
            this.addWord(word.toLowerCase(), word.toLowerCase(), this.root);
        }

        this.minLengthRatio = closeMatchLength;
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

    constructor(dictionary, language="de", storageKey="translation") {
        this.palavras = new Set();
        this.traducoes = {};
        this.dictionary = dictionary;
        this.language = language;
        this.storageKey = storageKey;

        // Carregar traduções do armazenamento local
        this.loadTranslations(language);

        this.updatePrefixCheck();
    }

    async put(palavra) {
        palavra = palavra.toLowerCase();

        console.log("TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEESTE", this.dictionary[palavra])

        if (this.palavras.has(palavra)) {
            console.log("palavra repetida");
        }

        if (this.dictionary[palavra]) {
            this.traducoes[palavra] = this.dictionary[palavra];
        } else {

            const samePrefix = this.prefixes.closestMatch(palavra);

            console.log(samePrefix, "prefixo")

            // const sameSufix  = this.sufixes.closestMatch(palavra, true);

            // const similarWords = new Set(samePrefix.concat(sameSufix));

            const traducoesProximas = samePrefix.map(
                (p,i) => `\\n   ${i}: ${p} -> ${this.dictionary[p]}, \\n`)

            // let i = 0;

            console.log(samePrefix, traducoesProximas)


            this.traducoes[palavra] = "traduções mais próximas: \\n   " + traducoesProximas;

            if(traducoesProximas.length == 0) this.traducoes[palavra] = "Não encontrada"
        }

        this.palavras.add(palavra);

        // Salvar traduções no armazenamento local sempre que uma nova é adicionada
        await this.saveTranslations();
    }

    getTranslation(palavra) {
        return this.traducoes[palavra];
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
            }
        } catch (error) {
            console.error("Erro ao carregar traduções:", error);
        }
    }

    updatePrefixCheck(){

        for(const [word, translation] of this.traducoes){
            this.dictionary[word] = translation;
        }

        const reverseString = word => word.split('').reverse().join('');

        // Atualizar radicais com as palavras atualmente no dicionário
        this.prefixes = new WordTrie(Object.keys(this.dictionary));
        this.sufixes  = new WordTrie(Object.keys(this.dictionary).map(reverseString), 5);
    }

    changeLanguage(language){
        this.saveTranslations();

        this.language = language;

        this.loadTranslations();

        return this;
    }
}