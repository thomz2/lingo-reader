import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    
    const [authState, setAuthState] = useState({
        email: null,
        authenticated: true,
    });
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    useEffect(() => {
        const loadAuthState = async () => {
            console.log('Iniciando o carregamento do authState...');
            const memoryAuthState = await SecureStore.getItem('authState');
            if (memoryAuthState) {
                console.log('authState carregado do SecureStore:', memoryAuthState);
                setAuthState(JSON.parse(memoryAuthState));
            } else {
                console.log('Nenhum authState encontrado no SecureStore.');
            }
            setLoading(false);  // Finaliza o carregamento quando o estado for carregado
        };

        loadAuthState();
    }, []);

    useEffect(() => {
        console.log('authState atualizado:', authState);
    }, [authState]);

    const register = (email, username, password) => {
        console.log('Registrando usuário:', email);
        const newUser = { email, username, password };
        try {
            SecureStore.setItem(email, JSON.stringify(newUser));
            setAuthState({
                email: email,
                authenticated: true,
            });
            console.log('Usuário registrado com sucesso:', email);
            return { error: false, emailAuthenticated: email };
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
        }
    };

    const login = (email, password) => {
        console.log('Tentando login com:', email);
        const credentialsNotFoundJson = { error: true, msg: 'Credenciais não encontradas.' };
        try {
            const user = JSON.parse(SecureStore.getItem(email));
            if (!user || user.email !== email || user.password !== password) {
                console.log('Credenciais não encontradas para:', email);
                return credentialsNotFoundJson;
            }
            setAuthState({
                email: user.email,
                authenticated: true,
            });
            console.log('Login bem-sucedido para:', email);
            return { error: false, emailAuthenticated: email };
        } catch (error) {
            console.error('Erro ao fazer login', error);
        }
    };

    const logout = () => {
        console.log('Efetuando logout...');
        setAuthState({
            email: null,
            authenticated: false,
        });
    };

    const value = useMemo(() => ({
        onRegister: register,
        onLogin: login,
        onLogout: logout,
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
