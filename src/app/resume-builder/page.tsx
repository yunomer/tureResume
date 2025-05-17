"use client";
import { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
import { store } from "lib/redux/store"; // This store is for Provider, useDispatch will get the one from context
import { AppDispatch } from 'lib/redux/store'; // For typing dispatch
import { setResume, initialResumeState } from "lib/redux/resumeSlice";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function NewResumeBuilderPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Reset to initial state when creating a new resume
    dispatch(setResume(initialResumeState));
  }, [dispatch]);

  // The main component logic for rendering the layout remains here
  return (
    <Provider store={store}> {/* Provider uses the directly imported store */}
      <main className="relative h-full w-full overflow-hidden bg-gray-50">
        <div className="grid grid-cols-3 md:grid-cols-6">
          <div className="col-span-3">
            {/* ResumeForm will use the Redux state, now correctly initialized */}
            <ResumeForm resumeId={null} />
          </div>
          <div className="col-span-3">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );

}
