/* ============================================================================
   Open roles — the three live openings (mirrors credenceinnovations.org/careers).
   Each role has its own detail page at /careers/:slug. The card grid on the
   Careers page and the detail page both read from here (single source of truth).
============================================================================ */

export const ROLES = [
  {
    slug: 'retail-sales-associate',
    title: 'Retail Sales Associate',
    type: 'Full-time · In-store',
    location: 'Retail partner locations',
    pay: 'Weekly pay',
    blurb: 'Represent leading tech brands on the retail floor — match shoppers to the right products and turn store visits into loyalty.',
    summary: 'Represent our clients on the floor as a technology-focused brand ambassador — matching shoppers to the right products and turning store visits into loyalty.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Greet every customer warmly and professionally',
          'Act as a brand ambassador for the technology you represent',
          'Give tailored product recommendations based on real needs',
          'Keep growing your product knowledge through ongoing learning',
          'Keep the department organized and well-stocked',
        ],
      },
      {
        label: 'What we look for',
        items: [
          '18 years or older',
          'Thrives in a fast-paced, team-oriented environment',
          'Flexible scheduling based on availability',
          'Strong customer-relationship skills',
        ],
      },
    ],
    tags: ['Customer service', 'Technology', 'On-site'],
  },
  {
    slug: 'sales-manager',
    title: 'Sales Manager',
    type: 'Leadership · Full-time',
    location: 'Indianapolis & expansion markets',
    pay: 'Weekly pay',
    blurb: 'Lead from the front. Build and inspire high-performing teams while turning data into the decisions that move the business forward.',
    summary: 'Lead from the front. Build and inspire high-performing teams while turning data into the decisions that move the business forward.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Lead and inspire the team while fostering a supportive culture',
          'Plan and manage departmental workloads monthly and quarterly',
          'Oversee hourly team members and shape business strategy',
          'Build high-performing teams through recruiting and talent development',
          'Analyze data to extract insights and support decisions',
        ],
      },
      {
        label: "What you'll develop",
        items: [
          'A client-service foundation and a positive team culture',
          'Consumer engagement, problem-solving, and conflict resolution',
          'Retail and business essentials',
        ],
      },
    ],
    tags: ['Leadership', 'Strategy', 'Weekly pay'],
  },
  {
    slug: 'marketing-sales-assistant',
    title: 'Entry Level Marketing & Sales Assistant',
    type: 'Entry-level · Full-time',
    location: 'Indianapolis, IN',
    pay: 'Weekly pay',
    blurb: 'Start your career with hands-on training in marketing, sales, and leadership — running real campaigns and events from day one.',
    summary: 'Start your career with hands-on training in marketing, sales, and leadership — running real campaigns and events from day one.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Execute marketing campaigns and organize sales events',
          'Plan and support field marketing, events, and product launches',
          'Collaborate with clients on campaign support',
          'Build customized marketing strategies alongside managers',
          'Own coordination and project management for sales events',
          'Bring fresh, revenue-generating ideas to the table',
        ],
      },
      {
        label: 'What we look for',
        items: [
          'No prior experience required',
          'Hard work and a learning mindset',
          'Excellent communication skills',
          'Thrives collaborating in a team environment',
        ],
      },
    ],
    tags: ['Entry-level', 'Marketing', 'Training provided'],
  },
];

export const getRole = (slug) => ROLES.find((r) => r.slug === slug);
