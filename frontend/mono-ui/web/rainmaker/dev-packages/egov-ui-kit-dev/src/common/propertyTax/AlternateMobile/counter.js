import React, { useEffect, useState } from "react";

const Counter = (props) => {
    const [state, setstate] = useState(30);
    useEffect(() => {
        if (state > 0) {
            setTimeout(() => setstate(newstate => newstate - 1), 1000);
        } else if (state == 0 && props.otpButton) {
            props.updateState();
        }
    }, [state])

    return <React.Fragment>
        {state}
    </React.Fragment>

}
export default Counter;