import { RingLoader } from "react-spinners";
import "../styles/loading.css"
const Loading = () => {

    return (
        <>
            <div className="loading-screen">
                <RingLoader
                    color="#000f36"
                    loading
                    speedMultiplier={1.5}
                />

            </div>
        </>
    )

}

export default Loading