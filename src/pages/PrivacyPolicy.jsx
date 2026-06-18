import LegalPage from '../components/LegalPage';

/* Content sourced verbatim from credenceinnovations.org/privacy-policy,
   grouped under tidy headings for readability. */
const SECTIONS = [
  {
    heading: 'Our commitment',
    paragraphs: [
      'Your privacy is important to us. It is Credence Innovations, Inc. policy to respect your privacy regarding any information we may collect from you across our website, and other platforms we own and operate.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.",
    ],
  },
  {
    heading: 'Retention & security',
    paragraphs: [
      "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.",
    ],
  },
  {
    heading: 'Sharing your information',
    paragraphs: [
      "We don't share any personally identifying information publicly or with third parties, except when required to by law. Text messaging opt-in data will not be shared with any third-party agencies.",
      'Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.',
    ],
  },
  {
    heading: 'External links',
    paragraphs: [
      'Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.',
      'If you wish to be removed from receiving future communications, you can opt out by texting STOP, QUIT, END, OPT OUT, CANCEL or UNSUBSCRIBE.',
    ],
  },
  {
    heading: 'Acceptance of this policy',
    paragraphs: [
      'Your continued use of our website will be regarded as an acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us at hr@credenceinnovations.com.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal · Policies"
      title="Privacy"
      italic="Policy."
      updated="Last updated June 2026"
      intro="How Credence Innovations collects, uses, and protects the information you share with us."
      sections={SECTIONS}
    />
  );
}
