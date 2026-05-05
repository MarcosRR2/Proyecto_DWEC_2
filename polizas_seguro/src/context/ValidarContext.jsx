import React, { createContext } from 'react';

// Creamos el contexto
export const ValidarContext = createContext();

// Creamos el proveedor (Provider)
export const ValidarProvider = ({ children }) => {
    
    // Aquí definimos las expresiones regulares según el enunciado
    const regexRules = {
        // IDXXXXX donde XXXXX son 5 dígitos
        id_poliza: /^ID\d{5}$/,
        
        // Formato español: 4 números y 3 letras (sin vocales A,E,I,O,U ni Ñ, Q)
        // Letras incluidas específicamente: B, C, D, F, G, H, J, K, L, M, N, P, R, S, T, V, W, X, Y, Z
        matricula: /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/
    };

    return (
        <ValidarContext.Provider value={regexRules}>
            {children}
        </ValidarContext.Provider>
    );
};