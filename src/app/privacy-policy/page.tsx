import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Ture',
  description: 'Privacy Policy for Ture application.',
};

export default function PrivacyPolicyPage() {
  const appName = 'Ture'; // Or Ture.ai
  const companyName = 'YourCompanyName'; // Replace with your actual company name or your name if individual
  const contactEmail = 'hello@ture.ai'; // Replace with your contact email
  const effectiveDate = 'May 17, 2025'; // Replace with the actual effective date

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Privacy Policy for {appName}
        </h1>

        <p className="mb-4 text-sm text-gray-600">
          Effective Date: {effectiveDate}
        </p>

        <p className="mb-4">
          Welcome to {appName} (the "Service"), operated by {companyName} ("us", "we", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:text-indigo-800">{contactEmail}</a>.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
          <p className="mb-2">
            We collect personal information that you voluntarily provide to us when you register on the Service, express an interest in obtaining information about us or our products and services, when you participate in activities on the Service or otherwise when you contact us.
          </p>
          <p className="mb-2">
            The personal information that we collect depends on the context of your interactions with us and the Service, the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc list-inside mb-2 ml-4">
            <li><strong>Account Information:</strong> Email address, username, and encrypted passwords.</li>
            <li><strong>Resume Data:</strong> Information you provide when creating your resume, such as work experience, education, skills, and contact details.</li>
            <li><strong>Usage Data:</strong> We may collect information about how you access and use the Service, such as your IP address, browser type, operating system, pages viewed, and the dates/times of your visits. (Specify if you use analytics tools like Google Analytics, Plausible, etc.)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
          <p className="mb-2">
            We use personal information collected via our Service for a variety of business purposes described below:
          </p>
          <ul className="list-disc list-inside mb-2 ml-4">
            <li>To facilitate account creation and logon process.</li>
            <li>To provide, operate, and maintain our Service (e.g., to allow you to create, save, and manage your resumes).</li>
            <li>To send you administrative information, such as updates to our terms, conditions, and policies.</li>
            <li>To respond to your inquiries and solve any potential issues you might have with the use of our Service.</li>
            <li>To send you marketing and promotional communications (if you have opted in). You can opt-out of our marketing emails at any time.</li>
            <li>For other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, marketing and your experience.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Will Your Information Be Shared With Anyone?</h2>
          <p className="mb-2">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
          <p className="mb-2">
            Specifically, we may need to process your data or share your personal information in the following situations:
          </p>
          <ul className="list-disc list-inside mb-2 ml-4">
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., email delivery via Resend, database hosting via your provider).</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. How Long Do We Keep Your Information?</h2>
          <p className="mb-2">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </p>
          <p className="mb-2">
            Typically, your resume data is retained as long as your account is active. You can delete your account and associated data at any time (Describe how, e.g., through account settings or by contacting support).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. How Do We Keep Your Information Safe?</h2>
          <p className="mb-2">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. For example, passwords are encrypted, and data transmission can be protected via HTTPS. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Your Privacy Rights</h2>
          <p className="mb-2">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, update, or delete your information. To exercise these rights, please contact us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:text-indigo-800">{contactEmail}</a>. You can also manage your account information and delete your resume data directly through your account settings on the Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Updates To This Notice</h2>
          <p className="mb-2">
            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Effective Date" and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. How Can You Contact Us About This Notice?</h2>
          <p className="mb-2">
            If you have questions or comments about this notice, you may email us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:text-indigo-800">{contactEmail}</a> or by post to:
          </p>
          <p className="mb-2">
            {companyName}<br />
            [Your Company Address - Optional, but good for transparency]<br />
            [City, State, Zip Code]<br />
            [Country]
          </p>
        </section>

        <div className="mt-8 text-center">
            <Link href="/" legacyBehavior>
                <a className="text-indigo-600 hover:text-indigo-800">Go back to Home</a>
            </Link>
        </div>

      </div>
    </div>
  );
}
