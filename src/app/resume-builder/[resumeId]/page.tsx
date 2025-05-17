"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Added Link for error state
import { Provider, useDispatch } from 'react-redux';
import { store } from '../../lib/redux/store'; // Adjusted path relative to [resumeId] folder
import { AppDispatch } from '../../lib/redux/store'; // Adjusted path
import { setResume, initialResumeState } from '../../lib/redux/resumeSlice'; // Adjusted path
import { ResumeForm } from 'components/ResumeForm'; // Adjusted path
import { Resume } from 'components/Resume'; // Adjusted path
import type { Resume as ResumeDataType } from '../../lib/redux/types'; // For the resume data structure in Redux
import type { Resume as PrismaResume } from '../../generated/prisma'; // For the type from Prisma client

export default function EditResumeBuilderPage() {
  const params = useParams();
  const resumeId = Array.isArray(params?.resumeId) ? params.resumeId[0] : params?.resumeId;

  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) {
      console.warn("EditResumeBuilderPage loaded without a resumeId. Initializing with a blank resume.");
      dispatch(setResume(initialResumeState));
      setIsLoading(false);
      return;
    }

    const fetchResumeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/resumes/${resumeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch resume (status: ${response.status})`);
        }
        const fetchedPrismaResume: PrismaResume = await response.json();

        if (!fetchedPrismaResume.content) {
          console.warn(`Fetched resume ${resumeId} has no 'content' field or content is null/undefined. Initializing with a blank resume.`);
          dispatch(setResume(initialResumeState));
        } else {
          // Assuming fetchedPrismaResume.content is compatible with ResumeDataType
          // If 'content' is JsonValue, it might need specific parsing or validation if it's a stringified JSON
          const resumeDataForStore: ResumeDataType = fetchedPrismaResume.content as unknown as ResumeDataType;
          dispatch(setResume(resumeDataForStore));
        }
      } catch (err) {
        console.error("Error fetching resume data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching the resume.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeId, dispatch]);

  if (isLoading) {
    return (
      <Provider store={store}>
        <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <p className="text-lg font-medium text-gray-700">Loading Resume Data...</p>
          <svg className="mt-3 h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </main>
      </Provider>
    );
  }

  if (error) {
    return (
      <Provider store={store}>
        <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <p className="text-xl font-semibold text-red-600">Error Loading Resume</p>
          <p className="mt-2 text-gray-700">{error}</p>
          <Link href="/dashboard"
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </Link>
        </main>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <main className="relative h-full w-full overflow-hidden bg-gray-50">
        <div className="grid grid-cols-3 md:grid-cols-6">
          <div className="col-span-3">
            <ResumeForm resumeId={resumeId} />
          </div>
          <div className="col-span-3">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );
}
