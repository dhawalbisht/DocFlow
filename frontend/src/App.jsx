import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import TextEditor from './components/TextEditor';

const App = () => {
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(false);

  const handleToggleEditor = () => {
    setIsCodeEditorVisible((prev) => !prev);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-4">Collaborative Editor</h1>
        <button
          onClick={handleToggleEditor}
          className={`py-2 px-4 rounded-md transition duration-200 ${isCodeEditorVisible
            ? 'bg-gray-700 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isCodeEditorVisible ? 'Switch to Text Editor' : 'Switch to Code Editor'}
        </button>
      </div>

      <div className="mt-4">
        {isCodeEditorVisible ? <CodeEditor /> : <TextEditor />}
      </div>
    </div>
  );
};

export default App;
