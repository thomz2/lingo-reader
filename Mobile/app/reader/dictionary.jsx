
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class FrequentPatternTree {

    constructor(wordList) {
        this.root = {};

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

    closestMatch(word) {
        let node = this.root;
        let matchedLetters = [];

        for (const letter of word.toLowerCase()) {
            if (!node[letter]) break;
            node = node[letter];
            matchedLetters.push(letter);
        }

        const closestMatch = matchedLetters.join('');
        if (!node) return closestMatch;

        return this.getAllChildren(node).map(w => closestMatch + w);
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

    constructor(dictionary, language="de", storageKey="translations") {
        this.palavras = new Set();
        this.traducoes = {};
        this.dictionary = dictionary;
        this.language = language;
        this.storageKey = storageKey;

        // Carregar traduções do armazenamento local
        this.loadTranslations();

        // Atualizar radicais com as palavras atualmente no dicionário
        this.radicals = new FrequentPatternTree(Object.keys(this.dictionary));
    }

    async put(palavra) {
        palavra = palavra.toLowerCase();

        if (this.palavras.has(palavra)) {
            console.log("palavra repetida");
        }

        if (this.dictionary[palavra]) {
            this.traducoes[palavra] = this.dictionary[palavra];
        } else {
            const palavrasProximas = this.radicals.closestMatch(palavra)
                .map(p => `${p} : ${this.dictionary[p]}`);
            this.traducoes[palavra] = "palavras mais proximas: " + palavrasProximas;
        }

        this.palavras.add(palavra);

        // Salvar traduções no armazenamento local sempre que uma nova é adicionada
        await this.saveTranslations();
    }

    getTranslation(palavra) {
        return this.traducoes[palavra];
    }

    async saveTranslations() {
        try {
            await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.traducoes));
        } catch (error) {
            console.error("Erro ao salvar traduções:", error);
        }
    }

    async loadTranslations() {
        try {
            const storedTranslations = await AsyncStorage.getItem(this.storageKey);
            if (storedTranslations) {
                this.traducoes = JSON.parse(storedTranslations);
                // Sincronizar o conjunto de palavras com as traduções carregadas
                this.palavras = new Set(Object.keys(this.traducoes));
            }
        } catch (error) {
            console.error("Erro ao carregar traduções:", error);
        }
    }
}