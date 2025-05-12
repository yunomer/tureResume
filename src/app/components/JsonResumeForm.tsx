"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { setResume, selectResume } from '../lib/redux/resumeSlice';
import { Resume, ResumeWithSettings } from '../lib/redux/types';
import { saveStateToLocalStorage, loadStateFromLocalStorage } from '../lib/redux/local-storage';

const JsonResumeForm: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentResume = useAppSelector(selectResume);

  useEffect(() => {
    const fetchJsonTemplate = async () => {
      try {
        const response = await fetch('/api/json-template');
        if (!response.ok) {
          throw new Error('Failed to fetch JSON template');
        }
        const data = await response.json();
        const mergedData = { ...data, ...currentResume };
        setJsonInput(JSON.stringify(mergedData, null, 2));
        console.log('Fetched and merged JSON template:', mergedData);
      } catch (err) {
        setError('Failed to load JSON template');
        console.error('Error fetching JSON template:', err);
      }
    };

    fetchJsonTemplate();
  }, [currentResume]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      console.log('Parsed JSON data:', parsedData);

      let resumeData: Resume;
      let settingsData: ResumeWithSettings['settings'] | undefined;

      if ('resume' in parsedData && 'settings' in parsedData) {
        // New ResumeWithSettings structure
        const typedData = parsedData as ResumeWithSettings;
        resumeData = typedData.resume;
        settingsData = typedData.settings;
        console.log('Detected new ResumeWithSettings structure');
      } else {
        // Existing Resume structure
        resumeData = parsedData as Resume;
        console.log('Detected existing Resume structure');
      }

      // Update Redux store
      dispatch(setResume(resumeData));
      console.log('Updated Redux store with resume data:', resumeData);

      // Update localStorage
      const currentState = loadStateFromLocalStorage();
      const newState = {
        ...currentState,
        resume: resumeData,
        settings: settingsData || currentState?.settings
      };
      saveStateToLocalStorage(newState);
      console.log('Updated localStorage with new state:', newState);

      setError('');
      router.push('/resume-builder');
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      console.error('Error parsing JSON:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full h-96 p-2 border rounded font-mono text-sm"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Your resume JSON will appear here..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Resume
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default JsonResumeForm;