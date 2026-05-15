# Workflow Orchestrator

Multi-agent system for automating project workflows: design, optimization, SEO, and deployment.

## Setup

```bash
npm install
```

Set environment variable:
```bash
$env:ANTHROPIC_API_KEY = "your-key"
```

## Running

```bash
npm run dev
```

Outputs saved to `workflow-outputs/` as JSON.

## Agents

- **DesignAgent**: Ultra-modern Awwwards 2026 design specs (components, Tailwind, animations, accessibility)
- **OptimizationAgent**: Code optimization recommendations based on design
- **SEOAgent**: Technical SEO strategy with structured data and meta tags
- **DeploymentAgent**: Testing, CI/CD, Docker, monitoring, and rollback procedures

## Project Structure

```
src/
├── types.ts              # Shared interfaces
├── orchestrator.ts       # WorkflowOrchestrator
├── index.ts              # Entry point
└── agents/
    ├── DesignAgent.ts
    ├── OptimizationAgent.ts
    ├── SEOAgent.ts
    └── DeploymentAgent.ts
```

## Output

Each agent produces structured JSON with:
- Design: components, tailwind config, animations, accessibility report
- Optimization: code structure, performance metrics, bundle optimization
- SEO: keywords, meta tags, structured data, analytics setup
- Deployment: testing, CI/CD, infrastructure, security, monitoring
