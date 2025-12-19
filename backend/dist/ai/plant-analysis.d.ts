import { z } from 'zod';
export declare const analyzePlantFlow: import("genkit").Action<z.ZodObject<{
    images: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    images: string[];
}, {
    images: string[];
}>, z.ZodObject<{
    species: z.ZodObject<{
        scientific: z.ZodString;
        common: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        scientific: string;
        common: string[];
        confidence: number;
    }, {
        scientific: string;
        common: string[];
        confidence: number;
    }>;
    healthStatus: z.ZodEnum<["healthy", "needs_attention", "critical"]>;
    issues: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        description: z.ZodString;
        symptoms: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: string;
        severity: "low" | "medium" | "high";
        description: string;
        symptoms: string[];
    }, {
        type: string;
        severity: "low" | "medium" | "high";
        description: string;
        symptoms: string[];
    }>, "many">;
    recommendations: z.ZodArray<z.ZodObject<{
        action: z.ZodString;
        priority: z.ZodEnum<["immediate", "soon", "routine"]>;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action: string;
        priority: "immediate" | "soon" | "routine";
        details: string;
    }, {
        action: string;
        priority: "immediate" | "soon" | "routine";
        details: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    issues: {
        type: string;
        severity: "low" | "medium" | "high";
        description: string;
        symptoms: string[];
    }[];
    species: {
        scientific: string;
        common: string[];
        confidence: number;
    };
    healthStatus: "healthy" | "needs_attention" | "critical";
    recommendations: {
        action: string;
        priority: "immediate" | "soon" | "routine";
        details: string;
    }[];
}, {
    issues: {
        type: string;
        severity: "low" | "medium" | "high";
        description: string;
        symptoms: string[];
    }[];
    species: {
        scientific: string;
        common: string[];
        confidence: number;
    };
    healthStatus: "healthy" | "needs_attention" | "critical";
    recommendations: {
        action: string;
        priority: "immediate" | "soon" | "routine";
        details: string;
    }[];
}>, z.ZodTypeAny>;
