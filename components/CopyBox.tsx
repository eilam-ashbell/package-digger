'use client';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface ICopyBox {
    title?: string;
    text: string;
}
export default function CopyBox({ text, title }: ICopyBox) {
    const textRef = useRef(null);

    function handleCopy() {
        // Get the text field
        const copyText = textRef.current.innerText;
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);
        toast.success('copied to clipboard', {
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    }

    return (
        <div>
            <div
                className='px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-md text-gray-500 w-content h-fit my-auto shadow-inner cursor-pointer'
                onClick={handleCopy}
            >
                <div className='flex flex-row justify-between items-center '>
                    {title && <span className='mr-2 font-medium'>{title}</span>}
                    <span
                        ref={textRef}
                        className='overflow-x-scroll'
                    >
                        {text}
                    </span>
                    <div className='w-6 ml-4 text-gray-400'>
                        <DocumentDuplicateIcon strokeWidth={1.5} width={20}/>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
