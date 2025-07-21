import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "../components/homepage"
import AuthForm from "../components/form/form"
import CreateConfession from "../components/confession/createconfessoin"

const RouterComponent = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/auth" element={<AuthForm/>} />
                    <Route path="/create" element={<CreateConfession/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default RouterComponent