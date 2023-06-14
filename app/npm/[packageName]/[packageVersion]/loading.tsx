import * as React from 'react';
import { SpinnerCircular } from 'spinners-react';
import "spinners-react/lib/SpinnerCircular.css";

export default function loading() {
    return (
        <div className='w-full h-full flex justify-center content-center'>
            <SpinnerCircular size={80} color='#3b82f6' secondaryColor='#dbeafe' still={false} />
        </div>
    )
}