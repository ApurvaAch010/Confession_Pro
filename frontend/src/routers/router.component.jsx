import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "../components/homepage"
import AuthForm from "../components/form/form"
import CreateConfession from "../components/confession/createconfessoin"
import Profile from "../components/profile/profile"
import Bin from "../components/Bin/bin"

const RouterComponent = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/auth" element={<AuthForm/>} />
                    <Route path="/create" element={<CreateConfession/>} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/bin" element={<Bin/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default RouterComponent