import { Vortex } from "react-loader-spinner";
import "../css/loader.css";
const Loader = () => {
    return (
        <div className="loader">
            <Vortex
                visible={true}
                height="80"
                width="80"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={[
                    "yellow",
                    "black",
                    "yellow",
                    "black",
                    "yellow",
                    "black",
                ]}
            />
        </div>
    );
};

export default Loader;
