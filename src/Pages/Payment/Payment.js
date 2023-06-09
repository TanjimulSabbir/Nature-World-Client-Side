import React from 'react';
import useTitle from '../../Hooks/useTitle';

const Payment = () => {
    useTitle('Payment')
    return (
        <div className='min-h-screen bg-blue-300 flex justify-center items-center'>
            <h1 className='font-diplayFair font-bold'>
                Sorry! Payment Option is not available now. 😪
            </h1>
        </div>
    );
};

export default Payment;