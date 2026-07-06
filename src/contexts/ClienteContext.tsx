import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";

import { api } from "../services/api";

export interface BridgeTag {
    fullName: string;
    name: string;
    apelido: string;
    unidade: string;
    descricao: string;
}

interface ClienteContextType {
    clienteId: string;
    tags: BridgeTag[];
    carregandoTags: boolean;
    atualizarTags: () => Promise<void>;
}

const ClienteContext = createContext<ClienteContextType>(
    {} as ClienteContextType
);

export function ClienteProvider({
    children,
}: {
    children: ReactNode;
}) {
    // futuramente esse valor virá do login
    const clienteId = "PK2";

    const [tags, setTags] = useState<BridgeTag[]>([]);
    const [carregandoTags, setCarregandoTags] = useState(true);

    async function atualizarTags() {
        try {
            setCarregandoTags(true);

            const response = await api.get(
                `/tags/bridge/${clienteId}`
            );

            setTags(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCarregandoTags(false);
        }
    }

    useEffect(() => {
        atualizarTags();
    }, []);

    return (
        <ClienteContext.Provider
            value={{
                clienteId,
                tags,
                carregandoTags,
                atualizarTags,
            }}
        >
            {children}
        </ClienteContext.Provider>
    );
}

export function useCliente() {
    return useContext(ClienteContext);
}