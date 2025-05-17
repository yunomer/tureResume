import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { Testimonials } from "home/Testimonials";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 pb-32 text-gray-900 lg:px-12">
      <Hero />
      <Steps />
      <Features />
      <Testimonials />
      <QuestionsAndAnswers />

      <footer className="mt-16 border-t border-gray-200 pt-8 pb-12 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Ture. All rights reserved.
        </p>
        <p className="mt-2">
          <Link href="/privacy-policy" legacyBehavior>
            <a className="hover:text-gray-700 hover:underline">Privacy Policy</a>
          </Link>
        </p>
      </footer>
    </main>
  );
}
