import { HashLoader } from "react-spinners";
import "../styles/loading.css"
const Loading = () => {

    return (
        <>
            <div className="loading-screen">
                <HashLoader
                    loading={true}
                    size={40}
                    speedMultiplier={2}
                />
            </div>
        </>
    )

}

export default Loading