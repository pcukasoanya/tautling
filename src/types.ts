export interface WorkflowProject {
  id: string;
  name: string;
  brief: string;
  stage: "design" | "optimize" | "seo" | "deploy";
  artifacts: Record<string, any>;
  metadata: Record<string, any>;
  sourceUrl?: string;
  targetAudience?: string;
}

export interface AgentResult {
  success: boolean;
  output: string | Record<string, any>;
  duration: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface DesignOutput {
  componentLibrary: string;
  tailwindConfig: string;
  figmaTokens: Record<string, any>;
  animations: string;
  accessibilityReport: string;
  designSystem?: {
    colors: Record<string, string>;
    typography: Record<string, any>;
    spacing: Record<string, string>;
  };
}

export interface OptimizationOutput {
  optimizedCode: string;
  bundleAnalysis: {
    before: Record<string, number>;
    after: Record<string, number>;
    savings: Record<string, string>;
  };
  recommendations: Array<{
    priority: "critical" | "high" | "medium" | "low";
    issue: string;
    solution: string;
    estimatedGain: string;
  }>;
  securityIssues: Array<{
    severity: "critical" | "high" | "medium";
    vulnerability: string;
    fix: string;
  }>;
  estimatedImprovement: {
    bundleSizeReduction: string;
    performanceGain: string;
    loadTimeImprovement: string;
  };
}

export interface SEOOutput {
  keywordStrategy: {
    primary: string[];
    secondary: string[];
    longTail: string[];
  };
  metaTags: Record<string, string>;
  headingHierarchy: string;
  structuredData: Record<string, any>;
  coreWebVitals: Record<string, string>;
  recommendations: string[];
}

export interface DeploymentOutput {
  testSuite: string;
  e2eTests: string;
  cicdPipeline: string;
  deploymentScript: string;
  healthChecks: string;
  rollbackProcedure: string;
}
