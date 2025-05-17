"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../lib/redux/hooks";
import { setResume, initialResumeState } from "../../lib/redux/resumeSlice";

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export default function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return (
    <SessionProvider>
      <AuthSessionEffect>{children}</AuthSessionEffect>
    </SessionProvider>
  );
}

function AuthSessionEffect({ children }: AuthSessionProviderProps) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  // const resume = useAppSelector(selectResume); // No longer needed for auto-save logic here

  useEffect(() => {
    // When authentication status changes, reset the global resume state.
    // Specific resumes will be loaded by their respective pages (e.g., /resume-builder/[resumeId])
    // or when a new resume is created.
    if (status === 'authenticated' || status === 'unauthenticated') {
      // console.log(`Auth status changed to ${status}, resetting resume state.`);
      dispatch(setResume(initialResumeState));
    }
  }, [status, dispatch]);

  // Auto-saving logic has been removed. Saving is now handled by an explicit "Save Resume" button
  // in the ResumeForm component, which uses the /api/resumes (plural) endpoints.
  // Local persistence for unsaved changes is handled by useSaveStateToLocalStorageOnChange hook.

  return <>{children}</>;
}
