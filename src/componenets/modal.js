import React from 'react';

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                {children}
            
            </div>
        </div>
    );
};

export default Modal;
