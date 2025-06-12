import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

// export const interviewer: CreateAssistantDTO = {
//   name: "Interviewer",
//   firstMessage:
//     "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
//   transcriber: {
//     provider: "deepgram",
//     model: "nova-2",
//     language: "en",
//   },
//   voice: {
//     // provider: "11labs",
//     // voiceId: "sarah",
//     // stability: 0.4,
//     // similarityBoost: 0.8,
//     // speed: 0.9,
//     // style: 0.5,
//     // useSpeakerBoost: true,

//     voiceId: "Spencer",
//     provider: "vapi"
//   },
//   model: {
//     provider: "openai",
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

// Interview Guidelines:
// Follow the structured question flow:
// {{questions}}

// Engage naturally & react appropriately:
// Listen actively to responses and acknowledge them before moving forward.
// Ask brief follow-up questions if a response is vague or requires more detail.
// Keep the conversation flowing smoothly while maintaining control.
// Be professional, yet warm and welcoming:

// Use official yet friendly language.
// Keep responses concise and to the point (like in a real voice interview).
// Avoid robotic phrasing—sound natural and conversational.
// Answer the candidate’s questions professionally:

// If asked about the role, company, or expectations, provide a clear and relevant answer.
// If unsure, redirect the candidate to HR for more details.

// Conclude the interview properly:
// Thank the candidate for their time.
// Inform them that the company will reach out soon with feedback.
// End the conversation on a polite and positive note.

// - Be sure to be professional and polite.
// - Keep all your responses short and simple. Use official language, but be kind and welcoming.
// - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
//       },
//     ],
//   },
// };

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const generateInterviewFormSchema = z.object({
  role: z.string().min(1, "Job role is required."),
  level: z.enum(["Junior", "Mid-level", "Senior", "Lead", ""], {
    errorMap: () => ({ message: "Focus type must be 'Junior', 'Mid-level', 'Senior', 'Lead'." }),
  }),
  techStack: z.string().min(1, "Tech stack is required."),
  type: z.enum(["Behavioral", "Technical", "Mixed or Balanced", ""], {
    errorMap: () => ({ message: "Focus type must be 'Behavioral', 'Technical', or 'Mixed/Balanced'." }),
  }),
  amount: z.number()
    .int("Amount of questions must be an integer.")
    .min(3, "At least 3 questions are required.")
    .max(15, "Cannot generate more than 15 questions."),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techStack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];

// export const generator: CreateWorkflowDTO = {
//   "name": "InterviewAce",
//   "nodes": [
//     {
//       "name": "start",
//       "type": "conversation",
//       "isStart": true,
//       "metadata": {
//         "position": {
//           "x": 7.607807463254915,
//           "y": -55.400883373562294
//         }
//       },
//       "prompt": "Let's prepare your interview. I'll ask you a few questions and generate a perfect interview for you, Are you ready?",
//       "model": {
//         "model": "gpt-4o",
//         "provider": "openai",
//         "maxTokens": 1000,
//         "temperature": 0.7
//       },
//       "voice": {
//         "voiceId": "Spencer",
//         "provider": "vapi"
//       },
//       "transcriber": {
//         "model": "nova-3",
//         "language": "en",
//         "provider": "deepgram",
//         "mipOptOut": true
//       },
//       "variableExtractionPlan": {
//         "output": [
//           {
//             "enum": [],
//             "type": "string",
//             "title": "level",
//             "description": "The job experience level."
//           },
//           {
//             "enum": [],
//             "type": "number",
//             "title": "amount",
//             "description": "How many questions would you like to generate?"
//           },
//           {
//             "enum": [],
//             "type": "string",
//             "title": "techStack",
//             "description": "A list of technologies to cover during the job interview. For example, React, Next.js, Express.js, Node and so on…"
//           },
//           {
//             "enum": [],
//             "type": "string",
//             "title": "role",
//             "description": "What role would you like to train for? (For example Frontend, Backend, Fullstack, Design, UX etc.)"
//           },
//           {
//             "enum": [],
//             "type": "string",
//             "title": "type",
//             "description": "What type of the interview should it be? (technical / behavioral / mix of technical and behavioral)"
//           }
//         ]
//       },
//       "messagePlan": {
//         "firstMessage": "Hello {{ userName }}"
//       }
//     },
//     {
//       "name": "API Request",
//       "type": "tool",
//       "metadata": {
//         "position": {
//           "x": 10.14932527700114,
//           "y": 383.4217567752129
//         }
//       },
//       "tool": {
//         "url": "https://interview-ace-livid.vercel.app/api/generate-interview",
//         "body": {
//           "type": "object",
//           "required": [
//             "role",
//             "level",
//             "techStack",
//             "type",
//             "amount",
//             "userId"
//           ],
//           "properties": {
//             "role": {
//               "type": "string",
//               "value": "{{ role }}",
//               "description": ""
//             },
//             "type": {
//               "type": "string",
//               "value": "{{ type }}",
//               "description": ""
//             },
//             "level": {
//               "type": "string",
//               "value": "{{ level }}",
//               "description": ""
//             },
//             "amount": {
//               "type": "string",
//               "value": "{{ amount }}",
//               "description": ""
//             },
//             "userId": {
//               "type": "string",
//               "value": "{{ userId }}",
//               "description": ""
//             },
//             "resumeUrl": {
//               "type": "string",
//               "value": "{{ resumeUrl }}",
//               "description": ""
//             },
//             "techStack": {
//               "type": "string",
//               "value": "{{ techStack }}",
//               "description": ""
//             }
//           }
//         },
//         "name": "Generate",
//         "type": "apiRequest",
//         "method": "POST",
//         "function": {
//           "name": "untitled_tool",
//           "parameters": {
//             "type": "object",
//             "required": [],
//             "properties": {}
//           }
//         },
//         "messages": [
//           {
//             "type": "request-failed",
//             "content": "Interview generation failed. Please try again. Sorry for the inconvenience.",
//             "endCallAfterSpokenEnabled": true
//           }
//         ]
//       }
//     },
//     {
//       "name": "conversation_1748700501200",
//       "type": "conversation",
//       "metadata": {
//         "position": {
//           "x": 13.060562013115714,
//           "y": 634.5683681818982
//         }
//       },
//       "prompt": "Thank the user for the conversation and inform them that the interview has been generated successfully.",
//       "model": {
//         "model": "gpt-4o",
//         "provider": "openai",
//         "maxTokens": 1000,
//         "temperature": 0.7
//       },
//       "voice": {
//         "voiceId": "Spencer",
//         "provider": "vapi"
//       },
//       "transcriber": {
//         "model": "nova-3",
//         "language": "en",
//         "provider": "deepgram"
//       },
//       "messagePlan": {
//         "firstMessage": ""
//       }
//     },
//     {
//       "name": "hangup_1748719344764",
//       "type": "tool",
//       "metadata": {
//         "position": {
//           "x": 14.103418712190745,
//           "y": 854.7638540049412
//         }
//       },
//       "tool": {
//         "type": "endCall"
//       }
//     }
//   ],
//   "edges": [
//     {
//       "from": "API Request",
//       "to": "conversation_1748700501200",
//       "condition": {
//         "type": "ai",
//         "prompt": ""
//       }
//     },
//     {
//       "from": "start",
//       "to": "API Request",
//       "condition": {
//         "type": "ai",
//         "prompt": "All the variables are extracted"
//       }
//     },
//     {
//       "from": "conversation_1748700501200",
//       "to": "hangup_1748719344764",
//       "condition": {
//         "type": "ai",
//         "prompt": ""
//       }
//     }
//   ],
//   "globalPrompt": "You are a voice assistant helping with creating new AI interviewers. Your task is to collect data from the user. Remember that this is a voice conversation - do not use any special characters. Do a friendly conversation."
// }


