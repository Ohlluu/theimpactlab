/**
 * ============================================================================
 * VERIFIED CLIENT COPY
 * ----------------------------------------------------------------------------
 * Everything in this file comes from Andrea Porter's own documents
 * ("The Impact Lab Bio and Services.docx" + the Brand Voice board).
 * It is reproduced close to verbatim on purpose: her writing is direct and
 * specific, and that is the whole reason this site won't read as generic.
 *
 * Do not "improve" this copy. If it changes, it changes because she said so.
 *
 * Invented placeholder content lives in `./placeholder.ts` — kept separate
 * so there is never any doubt about which is which.
 * ============================================================================
 */

export const brand = {
  name: "The Impact Lab",
  founder: "Andrea Porter",
  founderRole: "Founder and Principal",

  /** Her sentence. The hero is built on it. */
  thesis: "Fundraising depends on people.",

  tagline:
    "Strategy and implementation for nonprofits and foundations building the capacity to raise more.",
} as const;

/** From the Brand Voice board — drives tone decisions across the site. */
export const voice = [
  {
    name: "Empowering & Encouraging",
    body: "We uplift and inspire organizations to embrace major gifts fundraising with confidence.",
  },
  {
    name: "Warm & Approachable",
    body: "We break down barriers, making fundraising accessible and authentic.",
  },
  {
    name: "Direct & No-Nonsense",
    body: "We provide clear, actionable strategies without fluff or jargon.",
  },
  {
    name: "Strategic & Results-Driven",
    body: "We focus on impact, equipping organizations with the tools to secure transformational gifts.",
  },
] as const;

export const founderBio = {
  lede: "Andrea Porter is a fundraising strategist, facilitator, and nonprofit advisor with more than 15 years of experience helping organizations build relationships, secure philanthropic investment, and strengthen their capacity to advance their missions.",

  paragraphs: [
    "Her career spans higher education, national nonprofits, and community-based organizations. Through The Impact Lab, she brings a breadth of experience to nonprofit leaders, boards, and foundation partners seeking practical strategies for sustainable growth.",
    "Andrea's approach combines major gifts expertise with a background in social work and a deep commitment to equity. She understands that fundraising depends on people: their confidence, relationships, organizational culture, and ability to turn ideas into consistent action. Her work pairs strategic guidance with coaching, tools, and systems tailored to each organization's goals and capacity.",
  ],

  credentials: [
    {
      credential: "Master of Arts, Social Service Administration",
      institution: "University of Chicago",
    },
    {
      credential: "Bachelor of Arts, Sociology",
      institution: "University of Southern California",
    },
    {
      credential: "Certificate in Fundraising Management",
      institution: "Indiana University",
    },
  ],
} as const;

export const practiceOverview = {
  lede: "The Impact Lab is a consulting practice that helps nonprofits and foundations strengthen fundraising, leadership, and organizational capacity.",

  commitment:
    "We work with mission-driven organizations, with a particular commitment to social justice and organizations led by Black and Brown leaders.",

  paragraphs: [
    "Our work connects strategy with implementation. From building a major gifts program to engaging a board or designing a foundation's grantee capacity-building initiative, we help clients clarify priorities, develop practical tools, and establish habits that support lasting progress.",
    "Every engagement reflects the people doing the work, the resources available, and the communities the organization serves.",
  ],
} as const;

/**
 * The seven practice areas sort into four families. This replaced a plain
 * 01–07 index: a counter on an unordered list is ornament pretending to be
 * information, and seven of anything numbered reads as filler. Grouping says
 * something true about how the practice is organised instead.
 */
export const families = [
  {
    id: "strategy",
    name: "Strategy",
    blurb: "Deciding where the money is actually going to come from.",
  },
  {
    id: "capacity",
    name: "Capacity",
    blurb: "Strengthening the organization and its board.",
  },
  {
    id: "people",
    name: "People",
    blurb: "Supporting the people doing the work.",
  },
  {
    id: "systems",
    name: "Systems",
    blurb: "Making the work survive a busy month and a staffing change.",
  },
] as const;

export type FamilyId = (typeof families)[number]["id"];

export type Service = {
  /** Stable id — also the URL hash on /services */
  id: string;
  family: FamilyId;
  title: string;
  /** Short line for the home page list */
  summary: string;
  /** Her full description, verbatim */
  body: string;
};

export const services: Service[] = [
  {
    id: "fundraising-strategy",
    family: "strategy",
    title: "Fundraising Strategy and Planning",
    summary: "Clarify revenue priorities and build a plan someone actually owns.",
    body: "Assess your current fundraising efforts and develop a focused plan for growth. We help clarify revenue priorities, strengthen your case for support, and create actionable plans with clear responsibilities and timelines.",
  },
  {
    id: "major-gifts",
    family: "strategy",
    title: "Major Gifts and Individual Giving",
    summary: "A sustainable pipeline, from identification through stewardship.",
    body: "Build a sustainable approach to identifying, cultivating, soliciting, and stewarding donors. Services include prospect strategy, donor pipeline development, gift conversations, and personalized engagement plans.",
  },
  {
    id: "foundation-capacity",
    family: "capacity",
    title: "Foundation and Grantee Capacity Building",
    summary: "Capacity-building initiatives designed around what grantees actually need.",
    body: "Partner with foundations to design and deliver capacity-building initiatives that respond to their grantees' needs. Offerings include tailored workshops, learning cohorts, coaching, and technical assistance that strengthen fundraising and organizational effectiveness.",
  },
  {
    id: "board-development",
    family: "capacity",
    title: "Board Development and Engagement",
    summary: "Board members who understand the role and actually participate in it.",
    body: "Help board members understand their roles and participate confidently in advancing the mission. Through training, facilitated discussions, and practical tools, we strengthen governance, clarify expectations, and support meaningful fundraising involvement.",
  },
  {
    id: "leadership-coaching",
    family: "people",
    title: "Leadership Coaching and Strategic Advising",
    summary: "Individual support for leaders navigating growth and hard decisions.",
    body: "Provide individualized support to nonprofit executives, development leaders, and fundraisers navigating growth, leadership challenges, and strategic decisions. Coaching combines reflection, practical guidance, and accountability to help leaders move forward with clarity.",
  },
  {
    id: "workshops-retreats",
    family: "people",
    title: "Workshops, Retreats and Learning Experiences",
    summary: "Facilitated sessions people leave with something they can use.",
    body: "Design and facilitate interactive experiences tailored to your team, board, or cohort. Topics include fundraising, donor relationships, leadership, and strategic planning, with tools and next steps participants can apply immediately.",
  },
  {
    id: "stewardship-systems",
    family: "systems",
    title: "Donor Stewardship and Fundraising Systems",
    summary: "Processes that survive a busy month and a staffing change.",
    body: "Create practical processes that support consistent donor engagement and follow-through. We help organizations develop stewardship plans, outreach tools, donor tracking practices, and clear ownership of fundraising activities.",
  },
];

/** Who she serves — assembled from the practice overview + bio. */
export const audiences = [
  {
    title: "Nonprofit leaders",
    body: "Executive directors and development leaders carrying a revenue goal and a team that needs a clearer plan.",
  },
  {
    title: "Boards",
    body: "Boards that want to help with fundraising and need to understand what that actually asks of them.",
  },
  {
    title: "Foundations",
    body: "Funders designing capacity-building initiatives that respond to what their grantees genuinely need.",
  },
] as const;
