import React from 'react';
import { motion } from 'framer-motion';

const ConfirmDelete = ({ isOpen, onCancel, id,handleDelete, mode }) => {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${
          mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Are you sure you want to delete this note? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              mode === 'dark'
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete(id)}
            className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDelete;

