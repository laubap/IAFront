import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Equipamentos from "./pages/Equipamentos/Equipamentos";
import DashboardEquipamento from "./pages/Equipamentos/DashboardEquipamento";
import DashboardProcesso from "./pages/Processos/DashboardProcesso";
import Processos from "./pages/Processos/Processos";
import Anomalias from "./pages/Anomalias/Anomalias";
import Tags from "./pages/Tags/Tags";
import CadastrarTag from "./pages/Tags/CadastrarTag";
import CadastrarProcesso from "./pages/Processos/CadastrarProcesso";
import ConhecimentoIA from "./pages/ConhecimentoIA/ConhecimentoIA";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="equipamentos" element={<Equipamentos />} />
                <Route path="equipamentos/:id" element={<DashboardEquipamento />} />
                <Route path="processos" element={<Processos />} />
                <Route path="processos/:id" element={<DashboardProcesso />} />
                <Route path="anomalias" element={<Anomalias />} />
                <Route path="tags" element={<Tags />} />
                <Route path="tags/cadastrar" element={<CadastrarTag />} />
                <Route path="processos/cadastrar" element={<CadastrarProcesso />} />
                <Route path="conhecimento-ia" element={<ConhecimentoIA />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;