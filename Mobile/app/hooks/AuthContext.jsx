import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

    const [authState, setAuthState] = useState({
        email: null,
        username: null,
        authenticated: false,
    });
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    useEffect(() => {
        const loadAuthState = async () => {
            console.log('Iniciando o carregamento do authState...');
            const memoryAuthState = await AsyncStorage.getItem('authState');
            if (memoryAuthState) {
                console.log('authState carregado do AsyncStorage:', memoryAuthState);
                setAuthState(JSON.parse(memoryAuthState));
            } else {
                console.log('Nenhum authState encontrado no AsyncStorage.');
            }
            setLoading(false);  // Finaliza o carregamento quando o estado for carregado
        };

        loadAuthState();
    }, []);

    useEffect(() => {
        console.log('authState atualizado:', authState, 'indo salvar no AsyncStorage');
        AsyncStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    const replaceUser = async (oldUserEmail, newUser) => {
        
        // TODO: fazer isso para books e para notas tambem

        try {
            await AsyncStorage.removeItem(oldUserEmail);
            await AsyncStorage.setItem(newUser.email, JSON.stringify(newUser));
        } catch (error) {
            console.log('erro ao substituir usuario: ', error);
        }

        try {
            const userBooks = await AsyncStorage.getItem(oldUserEmail + ".books");
            await AsyncStorage.removeItem(oldUserEmail + ".books");
            await AsyncStorage.setItem(newUser.email, userBooks);
        } catch (error) {
            console.log('erro ao substituir livros do usuario');
        }
        
        setAuthState({
            email: newUser.email,
            username: newUser.username,
            authenticated: true,
        });
        
        console.log('Configurações do usuário trocadas com sucesso:', newUser.email);
        return { error: false, emailAuthenticated: email };

    }

    const register = async (email, username, password) => {

        // TODO: verificar se ja existe usuario

        console.log('Registrando usuário:', email);
        const newUser = { email, username, password };
        try {
            await AsyncStorage.setItem(email, JSON.stringify(newUser));
            setAuthState({
                email: email,
                username: username,
                authenticated: true,
            });
            console.log('Usuário registrado com sucesso:', email);
            
            _addDefaultBookToUser(email); // metodo sem o await pq nao precisa esperar
            
            return { error: false, emailAuthenticated: email };
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return { error: true, msg: 'Error registering user.' }
        }
    };

    const login = async (email, password) => {

        const credentialsNotFoundJson = { error: true, msg: 'Credentials not found.' };

        if (!email || !password) {
            return credentialsNotFoundJson;
        }

        console.log('Tentando login com:', email);
        try {
            const user = JSON.parse(await AsyncStorage.getItem(email));
            if (!user || user.email !== email || user.password !== password) {
                console.log('Credenciais não encontradas para:', email);
                return credentialsNotFoundJson;
            }
            setAuthState({
                email: user.email,
                username: user.username,
                authenticated: true,
            });
            console.log('Login bem-sucedido para:', email);
            return { error: false, emailAuthenticated: email };
        } catch (error) {
            console.error('Erro ao fazer login', error);
            return { error: true, msg: 'Error logging in.' }
        }
    };

    const logout = () => {
        console.log('Efetuando logout...');
        setAuthState({
            email: null,
            username: null,
            authenticated: false,
        });
    };

    const _addDefaultBookToUser = async (userEmail) => {
        const book = {
            'id': 0,
            'name': 'Moby Dick',
            'uri': 'https://s3.amazonaws.com/moby-dick/OPS/package.opf',
            'completion': 0,
            'cover': 'https://m.media-amazon.com/images/I/61kif0Iav7L._AC_UF1000,1000_QL80_.jpg',
        }

        return await addBookToUser(userEmail, book);
    }

    const addBookToUser = async (userEmail, book) => {
        const userEmailKey = userEmail + ".books";
        let alreadyExists = false;

        try {

            let userBooks = JSON.parse(await AsyncStorage.getItem(userEmailKey));
            
            if (!userBooks) {
                userBooks = [] // primeiro livro do usuario
            } 
            
            else {
                userBooks.forEach(element => {
                    if (element.name === book.name) {
                        alreadyExists = true;
                        console.log('livro ja existente');
                        return;
                    }
                });
            }
            
            if (alreadyExists) {
                return { error: true, msg: 'You already has this book' }
            }

            await AsyncStorage.setItem(userEmailKey, JSON.stringify([book, ...userBooks]));

            return null;

        } catch (error) {
            return { error: true, msg: error };
        }

    }

    const getUserBooks = async (userEmail) => {
        const userEmailKey = userEmail + ".books";
        try {
            const userBooks = JSON.parse(await AsyncStorage.getItem(userEmailKey));
            if (!userBooks) return [];
            return userBooks;
        } catch (error) {
            return { error: true, msg: "Error when fetching books"};
        }
    };

    const getNewId = async (userEmail) => {
        const books = await getUserBooks(userEmail);
        return books.length;
    }

    const getBookByIdAndEmail = async (userEmail, bookId) => {
        const userEmailKey = userEmail + ".books"; 
      
        try {    
          const userBooks = JSON.parse(await AsyncStorage.getItem(userEmailKey));

          console.log("AUTHCONTEXTO USERBOOKS", userBooks);
          
          if (!userBooks) {
            return { error: true, msg: "No books found for this user." };
          }
      
          for (let i = 0; i < userBooks.length; i++) {
            if (userBooks[i].id == bookId) {
                return { error: false, book: userBooks[i] };
            }
          }
      
          console.log("AUTHCONTEXTO BOOK", book);


          if (!book) {
            return { error: true, msg: "Book not found." };
          }
      
          return { error: false, book };
      
        } catch (error) {
          return { error: true, msg: "Error fetching the book: " + error.message };
        }
    };

    // Gera um novo ID para um deck com base na quantidade de decks do usuário
    const getNewDeckId = async (userEmail) => {
        try {
            const decks = await getDecks(userEmail);
            return decks.length; // O próximo ID é igual ao número de decks existentes
        } catch (e) {
            console.error('Erro ao gerar novo ID do deck:', e);
            return 0; // Se houver um erro, começa do ID 0
        }
    };
    
    // Cria um novo deck
    const createDeck = async (userEmail, deckName) => {
        const deckId = await getNewDeckId(userEmail);
        const newDeck = {
            id: deckId,
            title: deckName,
            flashcards: [],
        };
    
        try {
            let decks = await getDecks(userEmail);
            decks.push(newDeck);
            const jsonValue = JSON.stringify(decks);
            await AsyncStorage.setItem(`${userEmail}.decks`, jsonValue);
            console.log('Deck criado com sucesso!');
        } catch (e) {
            console.error('Erro ao criar o deck:', e);
        }
    };
    
    // Deleta um deck
    const deleteDeck = async (userEmail, deckId) => {
        try {
            let decks = await getDecks(userEmail);
            decks = decks.filter(deck => deck.id !== deckId);
            const jsonValue = JSON.stringify(decks);
            await AsyncStorage.setItem(`${userEmail}.decks`, jsonValue);
            console.log('Deck deletado com sucesso!');
        } catch (e) {
            console.error('Erro ao deletar o deck:', e);
        }
    };
    
    // Obtém todos os decks do usuário
    const getDecks = async (userEmail) => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${userEmail}.decks`);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Erro ao obter os decks:', e);
            return [];
        }
    };
    
    // Obtém um deck específico
    const getDeck = async (userEmail, deckId) => {
        try {
            const decks = await getDecks(userEmail);
            return decks.find(deck => deck.id === deckId) || null;
        } catch (e) {
            console.error('Erro ao obter o deck:', e);
            return null;
        }
    };
    
    // Adiciona um flashcard a um deck
    const putFlashCardOnDeck = async (userEmail, deckId, flashcard) => {
        try {
            let decks = await getDecks(userEmail);
            const deckIndex = decks.findIndex(deck => deck.id === deckId);
        if (deckIndex !== -1) {
            decks[deckIndex].flashcards.push(flashcard);
            const jsonValue = JSON.stringify(decks);
            await AsyncStorage.setItem(`${userEmail}.decks`, jsonValue);
            console.log('Flashcard adicionado com sucesso!');
        }
        } catch (e) {
            console.error('Erro ao adicionar o flashcard ao deck:', e);
        }
    };
    
    // Deleta um flashcard de um deck
    const deleteFlashCardFromDeck = async (userEmail, deckId, flashcardId) => {
        try {
            let decks = await getDecks(userEmail);
            const deckIndex = decks.findIndex(deck => deck.id === deckId);
            if (deckIndex !== -1) {
                decks[deckIndex].flashcards = decks[deckIndex].flashcards.filter(fc => fc.id !== flashcardId);
                const jsonValue = JSON.stringify(decks);
                await AsyncStorage.setItem(`${userEmail}.decks`, jsonValue);
                console.log('Flashcard deletado com sucesso!');
            }
        } catch (e) {
            console.error('Erro ao deletar o flashcard do deck:', e);
        }
    };
    
    // Obtém todos os flashcards de um deck
    const getFlashCardsFromDeck = async (userEmail, deckId) => {
        try {
            const deck = await getDeck(userEmail, deckId);
            return deck ? deck.flashcards : [];
        } catch (e) {
            console.error('Erro ao obter os flashcards do deck:', e);
            return [];
        }
    };

    const value = useMemo(() => ({
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onReplaceUser: replaceUser,
        onAddBookToUser: addBookToUser,
        onGetUserBooks: getUserBooks,
        onGetNewId: getNewId,
        onGetBookByIdAndEmail: getBookByIdAndEmail,

        createDeck, deleteDeck, getDecks, putFlashCardOnDeck, deleteFlashCardFromDeck, getFlashCardsFromDeck,
        
        authState
    }), [authState]);

    if (loading) {
        console.log('Carregando o authState...');
        return null; // Ou mostrar um ActivityIndicator para aguardar o carregamento
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
