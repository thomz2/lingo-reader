import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Text } from "react-native";

export const TestContext = createContext({});

export const TestProvider = ({ children }) => {
    return (
        <TestContext.Provider value={{
            teste: "TESTE"
        }}>
            {/* <Text>
                Ola!
            </Text> */}
            {children}
        </TestContext.Provider>
    )
}