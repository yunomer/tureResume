"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { setResume, initialResumeState, selectResume } from "../../lib/redux/resumeSlice";
import type { Resume } from "../../lib/redux/types";

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
  const resume = useAppSelector(selectResume);

  const justLoadedOrResetRef = useRef(false);
  const prevResumeRef = useRef<Resume | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAndSetResume = async () => {
      try {
        const response = await fetch('/api/resume');
        if (response.ok) {
          const resumeData = await response.json();
          if (resumeData && resumeData.content) {
            justLoadedOrResetRef.current = true;
            dispatch(setResume(resumeData.content as Resume));
          } else {
            justLoadedOrResetRef.current = true;
            dispatch(setResume(initialResumeState));
          }
        } else if (response.status === 404) {
          justLoadedOrResetRef.current = true;
          dispatch(setResume(initialResumeState));
        } else {
          console.error('Failed to fetch resume:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching or processing resume:', error);
      }
    };

    if (status === 'authenticated' && session?.user?.id) {
      fetchAndSetResume();
    } else if (status === 'unauthenticated') {
      justLoadedOrResetRef.current = true;
      dispatch(setResume(initialResumeState));
    }
  }, [status, session?.user?.id, dispatch]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (status === 'authenticated' && session?.user?.id) {
      if (justLoadedOrResetRef.current) {
        justLoadedOrResetRef.current = false;
        prevResumeRef.current = resume;
        return;
      }

      const isInitial = JSON.stringify(resume) === JSON.stringify(initialResumeState);
      const hasChanged = JSON.stringify(resume) !== JSON.stringify(prevResumeRef.current);

      if (hasChanged && !isInitial) {
        debounceTimerRef.current = setTimeout(async () => {
          try {
            const response = await fetch('/api/resume', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: resume }),
            });

            if (!response.ok) {
              console.error('Failed to auto-save resume:', response.status, response.statusText);
            } else {
              // console.log('Resume auto-saved successfully');
            }
          } catch (error) {
            console.error('Error auto-saving resume:', error);
          }
        }, 2000);
      }
    }

    prevResumeRef.current = resume;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [resume, status, session?.user?.id, dispatch]);

  return <>{children}</>;
}
