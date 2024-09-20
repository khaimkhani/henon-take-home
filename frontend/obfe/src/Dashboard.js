import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { withParams, BASE_URL } from './utils.js';


const HEADER_TYPES = {
  string: "STRING",
  int: "INT",
  float: "FLOAT",
  date: "DATE",
}

const DocumentDashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userID, setUserID] = useState(localStorage.getItem('userID'))

  const [columnSettings, setColumnSettings] = useState([
    // prefill these when upload
    // default should be string?
    { name: '', type: HEADER_TYPES.string },
    { name: '', type: HEADER_TYPES.string },
    { name: '', type: HEADER_TYPES.string },
    { name: '', type: HEADER_TYPES.string },
  ])

  const tables = useQuery({ queryKey: ['tables'] })
  //const headers = useQuery({ queryKey: ['headers'] })

  const uploadFiles = useMutation({
    mutationFn: async (formdata) => {

      const res = await fetch(`${BASE_URL}/api/upload_files/`, {
        method: 'POST', headers: { 'Authorization': localStorage.getItem('userID') }, body: formdata
      })
      if (res.ok) {
        throw new Error('Failed to send files for upload')
      }
      return res.json()
    },
    // reset states
    onSuccess: () => {
      setFiles([])
      setIsUploadOpen(false)
    }
  })
  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleUpload = () => {
    // headers validation
    // right now it only checks if they exist
    if (!columnSettings.every(item => !!item.name)) {
      // set error state
      return
    }

    const fd = new FormData()
    files.forEach(file => fd.append('files[]', file))
    columnSettings.forEach(setting => fd.append('headers[]', setting))
    uploadFiles.mutate(fd)
  };

  const handleDelete = (id) => {
    // remove from files
  };


  const updateFileHeaderName = (val, colNum) => {
    setColumnSettings(columnSettings.map((col, i) => {
      if (i === colNum) {
        col.name = val
      }
      return col
    }))
  }

  const updateFileHeaderType = (val, colNum) => {
    setColumnSettings(columnSettings.map((col, i) => {
      if (i === colNum) {
        col.type = val
      }
      return col
    }))
  }

  // TEMP
  const columns = []
  const selectedPreset = null
  const presets = []
  const newPresetName = "temp"


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Document Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Documents</h3>
            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isUploadOpen ? 'Close' : 'Open'}
            </button>
          </div>
          {isUploadOpen && (
            <div className="mt-5">
              <div className="flex items-center justify-center w-full mb-4">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p>Upload</p>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">XLSX, CSV (MAX. 10MB)</p>
                    <p className="text-sm text-indigo-600 font-semibold mt-2">Multiple files can be selected</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Selected Files: {files.length}</h3>
                  {files.map((file, fileIndex) => (
                    <div key={fileIndex} className="mb-4 border rounded-md p-4">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2" onClick={() => { }}>
                          <span>{file.name}</span>
                          {file.isOpen ? <p>Close</p> : <p>Open</p>}
                        </div>
                        <button onClick={() => { }} className="text-red-500 hover:text-red-700">
                          <p>X</p>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Column Settings:</h4>
                    {Array(4).fill(0).map((_, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={columnSettings[idx].name}
                          onChange={(e) => updateFileHeaderName(e.target.value, idx)}
                          placeholder={columnSettings[idx].name}
                          className="border rounded px-2 py-1 flex-grow"
                        />
                        <select
                          // get from preset
                          value={columnSettings[idx].type}
                          onChange={(e) => updateFileHeaderType(e.target.value, idx)}
                          placeholder={columnSettings[idx].type}
                          className="border rounded px-2 py-1"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium mb-1">Apply Preset:</h5>
                    <select
                      value={selectedPreset ? selectedPreset.name : ''}
                      onChange={(e) => {
                        const preset = presets.find(p => p.name === e.target.value);
                        // if (preset) applyPreset(preset);
                      }}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="">Select a preset</option>
                      {presets.map((preset, index) => (
                        <option key={index} value={preset.name}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newPresetName}
                      onChange={(e) => { }}
                      placeholder="New preset name"
                      className="border rounded px-2 py-1 flex-grow"
                    />
                    <button
                      onClick={() => { }}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Save Preset
                    </button>
                  </div>
                  <button
                    onClick={handleUpload}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Files
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Uploaded Documents</h3>
          {tables.data?.length === 0 ? (
            <div className="rounded-md bg-yellow-50 py-8 m-4">
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-row items-stretch ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No documents uploaded yet</h3>
                  <div className="flex mt-2 text-sm text-yellow-700">
                    <p>Upload some documents to see them listed here.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tables.data?.map((file) => (
                <li key={file.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="ml-4 bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDashboard;
