import './App.css'
import { BrowserRouter } from "react-router-dom";
import MainWrapper from "./layouts/MainWrapper";
import AppRoutes from "./AppRoutes";

function App() {
    return (
        <BrowserRouter>
            <MainWrapper>
                <AppRoutes />
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App
