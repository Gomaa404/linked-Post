import React from 'react'
import { BounceLoader } from 'react-spinners';
export default function Loader() {
    return (
        <div className="h-150 w-screen flex justify-center items-center"><BounceLoader color="rgba(0,59,92,1)" /></div>
    )
}
