import LegalPage from '../components/LegalPage';

/* Content sourced from credenceinnovations.org/terms-and-conditions. */
const SECTIONS = [
  {
    heading: 'Interpretation',
    paragraphs: [
      'The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.',
    ],
  },
  {
    heading: 'Definitions',
    paragraphs: ['For the purposes of these Terms and Conditions:'],
    defs: [
      { term: 'Affiliate', def: 'An entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares or other securities entitled to vote.' },
      { term: 'Country', def: 'Indiana, United States.' },
      { term: 'Company', def: 'Credence Innovations, Inc., Marion County (referred to as "the Company", "We", "Us" or "Our").' },
      { term: 'Device', def: 'Any device that can access the Service, such as a computer, a cellphone, or a digital tablet.' },
      { term: 'Service', def: 'The Website.' },
      { term: 'Terms and Conditions', def: 'These Terms and Conditions that form the entire agreement between you and the Company regarding use of the Service.' },
      { term: 'Third-party Social Media Service', def: 'Any services or content (including data, information, products, or services) provided by a third party that may be displayed, included, or made available by the Service.' },
      { term: 'Website', def: 'Credence Innovations, Inc.' },
      { term: 'You', def: 'The individual accessing or using the Service, or the company or legal entity on behalf of which such individual is accessing or using the Service.' },
    ],
  },
  {
    heading: 'Acknowledgment',
    paragraphs: [
      'These are the Terms and Conditions governing the use of this Service and the agreement that operates between you and the Company. They set out the rights and obligations of all users regarding the use of the Service.',
      'Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms and Conditions. By accessing or using the Service you agree to be bound by them. You represent that you are over the age of 18 — the Company does not permit those under 18 to use the Service.',
      'Your access to and use of the Service is also conditioned on your acceptance of and compliance with our Privacy Policy, which describes our policies and procedures on the collection, use, and disclosure of your personal information.',
    ],
  },
  {
    heading: 'Messaging terms & conditions',
    paragraphs: [
      'By providing your number, you consent to receive informational messages (such as reminders and notifications) from Credence Innovations. Message and data rates may apply. Reply HELP for assistance or email hr@credenceinnovations.com. You can opt out at any time by replying STOP.',
    ],
  },
  {
    heading: 'Links to other websites',
    paragraphs: [
      'Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services.',
    ],
  },
  {
    heading: 'Termination',
    paragraphs: [
      'We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions. Upon termination, your right to use the Service will cease immediately.',
    ],
  },
  {
    heading: 'Limitation of liability',
    paragraphs: [
      'The entire liability of the Company and any of its suppliers shall be limited to the amount actually paid by you through the Service, or 1 USD if you have not purchased anything through the Service.',
      'To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or related to the use of, or inability to use, the Service.',
    ],
  },
  {
    heading: '"As is" and "as available" disclaimer',
    paragraphs: [
      'The Service is provided to you "AS IS" and "AS AVAILABLE" with all faults and defects without warranty of any kind. The Company expressly disclaims all warranties, whether express, implied, statutory, or otherwise, regarding operation, availability, accuracy, reliability, uninterrupted service, or freedom from harmful components.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'The laws of the State of Indiana, excluding its conflicts of law rules, shall govern these Terms and your use of the Service.',
    ],
  },
  {
    heading: 'Disputes resolution',
    paragraphs: [
      'If you have any concern or dispute about the Service, you agree to first try to resolve the dispute informally by contacting the Company.',
    ],
  },
  {
    heading: 'For European Union (EU) users',
    paragraphs: [
      'If you are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident.',
    ],
  },
  {
    heading: 'United States legal compliance',
    paragraphs: [
      'You represent and warrant that you are not located in a country subject to a United States government embargo, and that you are not listed on any United States government list of prohibited or restricted parties.',
    ],
  },
  {
    heading: 'Severability & waiver',
    paragraphs: [
      'If any provision of these Terms is held to be unenforceable or invalid, it will be changed and interpreted to accomplish the objectives of that provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force.',
      'Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party’s ability to exercise such right at any time thereafter, nor shall the waiver of a breach constitute a waiver of any subsequent breach.',
    ],
  },
  {
    heading: 'Translation interpretation',
    paragraphs: [
      'These Terms and Conditions may have been translated if we have made them available to you on our Service. You agree that the original English text shall prevail in the case of a dispute.',
    ],
  },
  {
    heading: 'Changes to these terms & conditions',
    paragraphs: [
      'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days’ notice prior to any new terms taking effect. By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.',
    ],
  },
  {
    heading: 'Contact us',
    paragraphs: [
      'If you have any questions about these Terms and Conditions, you can contact us by email at hr@credenceinnovations.com.',
    ],
  },
];

export default function TermsConditions() {
  return (
    <LegalPage
      eyebrow="Legal · Policies"
      title="Terms &"
      italic="Conditions."
      updated="Last updated June 2026"
      intro="The terms that govern your use of the Credence Innovations website and services."
      sections={SECTIONS}
    />
  );
}
