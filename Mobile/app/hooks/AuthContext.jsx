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
        
        try {
            await AsyncStorage.removeItem(oldUserEmail);
            await AsyncStorage.setItem(newUser.email, JSON.stringify(newUser));
        } catch (error) {
            console.log('erro ao substituir usuario: ', error);
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

    const value = useMemo(() => ({
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onReplaceUser: replaceUser,
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
