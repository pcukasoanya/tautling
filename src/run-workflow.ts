import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { OptimizationAgent } from "./agents/OptimizationAgent";
import { SEOAgent } from "./agents/SEOAgent";
import { DeploymentAgent } from "./agents/DeploymentAgent";
import { WorkflowProject } from "./types";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

const tuanTlingProject: WorkflowProject = {
  id: "tuan-tling-2026",
  name: "Tuan Tling Vinyl Flooring",
  brief: `Premium vinyl flooring e-commerce site for Michigan market.
  Target: High-end homeowners, interior designers, architects.
  Value props: Architectural-grade vinyl, season-proof engineered for Michigan climate, luxury aesthetics.
  Key sections: Hero, Collection (6 styles), Specifications, Performance Lab, Climate (thermal resistance), Contact.
  Design focus: Minimalist luxury, dark/light aesthetic, motion UI, local Michigan focus.`,
  stage: "optimize",
  artifacts: {
    design: `
      React/TypeScript components created:
      - Hero.tsx: Minimalist hero with video, CTA
      - BentoCollection.tsx: 6-product gallery grid (Northern Oak, Quarry Slate, Carrara Mist, Walnut Drift, Basalt Field, Travertine Linen)
      - Specifications.tsx: Technical specs section
      - PerformanceLab.tsx: Video-based performance testing showcase (acoustic, stability, precision)
      - Climate.tsx: Thermal resistance demo with season toggle (-20°F to 105°F)
      - Contact.tsx: Advanced form with floating inputs, magnetic button, animations
      - Navigation.tsx: Fixed navigation pills (desktop), mobile menu overlay
      - Footer.tsx: Info footer

      Tech Stack:
      - React 18.3 + TypeScript
      - Framer Motion for animations
      - Tailwind CSS with custom colors (graphite, bone, walnut)
      - Vite build tool
      - Responsive design (mobile-first)
      - Video/image assets for products

      Design System:
      - Colors: #1a1a1a (graphite), #f4f1ee (bone), #a87856 (walnut), #475569 (slate)
      - Typography: Satoshi font (body), Display font (headings)
      - Spacing: Tailwind defaults + custom padding/margins
      - Animations: Spring physics, scroll-driven, hover states
      - Accessibility: WCAG AA compliant floating inputs, semantic HTML
    `,
  },
  metadata: {
    targetAudience: "Luxury homeowners, interior designers, architects in Michigan",
    region: "Michigan (Battle Creek HQ, serving statewide)",
    seoStrategy: {
      personas: [
        "Architectural Lead (luxury/designers)",
        "Technical Specialist (SEO-heavy)",
        "2026 Minimalist (brand-focused)",
      ],
      primaryKeywords: [
        "Vinyl Flooring Battle Creek MI",
        "SPC Core Waterproof Flooring",
        "Michigan Statewide Installation",
      ],
      localSchema: "LocalBusiness JSON-LD with Battle Creek address, 269 area code",
      greatLakesAdvantage: "Lake-effect moisture resistant, Michigan freeze-thaw cycles",
    },
  },
};

async function runOptimizationOnly() {
  console.log("\n🚀 Running Optimization Agent for Tuan Tling...\n");

  const agent = new OptimizationAgent(client);
  const result = await agent.process(tuanTlingProject);

  if (!result.success) {
    console.error("❌ Optimization failed:", result.error);
    process.exit(1);
  }

  tuanTlingProject.artifacts.optimize = result.output;
  tuanTlingProject.metadata.optimize = {
    completedAt: new Date().toISOString(),
    duration: result.duration,
    status: "completed",
    ...result.metadata,
  };

  console.log(`✅ Optimization completed in ${result.duration}ms`);
  console.log(`📊 Output tokens: ${result.metadata?.outputTokens || 0}`);

  saveOutput(tuanTlingProject);
}

async function runFullWorkflow() {
  console.log("\n🚀 Running Full Workflow (Optimize → SEO → Deploy)...\n");

  const stages = [
    { name: "optimize", Agent: OptimizationAgent },
    { name: "seo", Agent: SEOAgent },
    { name: "deploy", Agent: DeploymentAgent },
  ];

  for (const { name, Agent } of stages) {
    console.log(`\n[${tuanTlingProject.name}] 🔄 ${name.toUpperCase()} stage...`);

    const agent = new Agent(client);
    const result = await agent.process(tuanTlingProject);

    if (!result.success) {
      console.error(`❌ ${name} failed:`, result.error);
      process.exit(1);
    }

    tuanTlingProject.artifacts[name] = result.output;
    tuanTlingProject.metadata[name] = {
      completedAt: new Date().toISOString(),
      duration: result.duration,
      status: "completed",
      ...result.metadata,
    };

    console.log(`✅ ${name} completed in ${result.duration}ms`);
  }

  saveOutput(tuanTlingProject);
}

function saveOutput(project: WorkflowProject) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "");
  const filename = `workflow-outputs/${project.name.replace(/\s+/g, "_")}_${timestamp}.json`;

  const outputDir = path.dirname(filename);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(filename, JSON.stringify(project, null, 2));
  console.log(`\n💾 Output saved to: ${filename}`);
}

// Run optimization only by default
runOptimizationOnly().catch(console.error);

// Uncomment to run full workflow:
// runFullWorkflow().catch(console.error);
