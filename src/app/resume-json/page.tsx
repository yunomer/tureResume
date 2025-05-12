"use client";

import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { store } from '../lib/redux/store';

const JsonResumeForm = dynamic(() => import('../components/JsonResumeForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>
});

export default function ResumeJsonPage() {
  return (
    <Provider store={store}>
      <main className="mx-auto max-w-screen-lg px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Generate Resume from JSON</h1>
        <p className="mb-4">
          Edit the JSON below to customize your resume. Once you're done, click "Generate Resume" to view and edit your resume in the builder.
        </p>
        <JsonResumeForm />
      </main>
    </Provider>
  );
}