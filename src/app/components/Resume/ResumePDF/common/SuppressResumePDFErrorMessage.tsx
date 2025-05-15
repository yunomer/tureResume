"use client";

/**
 * Suppress ResumePDF development errors.
 * See ResumePDF doc string for context.
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const consoleError = console.error;
  const SUPPRESSED_WARNINGS = ["DOCUMENT", "PAGE", "TEXT", "VIEW"];
  console.error = function filterWarnings(msg, ...args) {
    // Check if args[0] exists and is a string before calling includes
    const firstArgAsString = (typeof args[0] === 'string') ? args[0] : ''; 
    if (!SUPPRESSED_WARNINGS.some((entry) => firstArgAsString.includes(entry))) {
      consoleError(msg, ...args);
    }
  };
}

export const SuppressResumePDFErrorMessage = () => {
  return <></>;
};
