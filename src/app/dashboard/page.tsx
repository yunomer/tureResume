"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Resume } from '../generated/prisma'; // Corrected import path from generated client

// Define a more specific type for the resume data we expect from the API
interface ResumeDataFromApi extends Omit<Resume, 'data' | 'createdAt' | 'updatedAt'> {
  data: any; // Keep 'any' for now, or define a structure for documentSettings if known
  createdAt: string; // Dates will likely be strings after JSON serialization
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<ResumeDataFromApi[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeDataFromApi | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchResumes = async () => {
        setIsLoadingResumes(true);
        setFetchError(null);
        try {
          const response = await fetch('/api/resumes');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch resumes: ${response.status}`);
          }
          const data = await response.json();
          setResumes(data || []); 
        } catch (error) {
          console.error('Error fetching resumes:', error);
          setFetchError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
        setIsLoadingResumes(false);
      };
      fetchResumes();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <main className="mx-auto max-w-screen-lg px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </main>
    );
  }

  // Note: The middleware should already protect this page,
  // so session should exist if status is not 'loading'.
  // However, checking for session?.user is a good practice.

  return (
    <main className="mx-auto max-w-screen-lg px-8 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {session?.user?.name ? session.user.name.split(' ')[0] : 'User'}!
        </h1>
        <Link
          href="/resume-builder"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
        >
          Create New Resume
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700">Your Resumes</h2>
        <div className="mt-6">
          {isLoadingResumes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-gray-500">Loading your resumes...</p>
            </div>
          )}
          {fetchError && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
              <p className="text-red-700">Error: {fetchError}</p>
            </div>
          )}
          {!isLoadingResumes && !fetchError && resumes.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-gray-500">
                You don't have any resumes yet. Click "Create New Resume" to get started.
              </p>
            </div>
          )}
          {!isLoadingResumes && !fetchError && resumes.length > 0 && (
            <ul className="space-y-4">
              {resumes.map((resume) => {
                const title = resume.data?.documentSettings?.title || 'Untitled Resume';
                return (
                  <li key={resume.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 flex space-x-3">
                        <Link
                          href={`/resume-builder/${resume.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-150"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setResumeToDelete(resume);
                            setShowDeleteModal(true);
                          }}
                          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resumeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            {deleteError && (
              <p className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                Error: {deleteError}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete the resume "<strong>{resumeToDelete.data?.documentSettings?.title || 'Untitled Resume'}</strong>"?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setResumeToDelete(null);
                  setDeleteError(null); // Clear delete error on cancel
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isDeleting} // Disable cancel button while deleting
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!resumeToDelete) return;
                  setIsDeleting(true);
                  setDeleteError(null);
                  try {
                    const response = await fetch(`/api/resumes/${resumeToDelete.id}`, {
                      method: 'DELETE',
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.message || `Failed to delete resume: ${response.status}`);
                    }
                    // Successfully deleted
                    setResumes(prevResumes => prevResumes.filter(r => r.id !== resumeToDelete.id));
                    setShowDeleteModal(false);
                    setResumeToDelete(null);
                    // Optionally, add a success toast/notification here
                  } catch (error) {
                    console.error('Error deleting resume:', error);
                    setDeleteError(error instanceof Error ? error.message : 'An unknown error occurred while deleting.');
                    // Keep modal open to show error or handle as preferred
                  }
                  setIsDeleting(false);
                }}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
