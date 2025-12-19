export class AnalyzePlantResponseDto {
    species: {
        scientific: string;
        common: string[];
        confidence: number;
    };
    healthStatus: 'healthy' | 'needs_attention' | 'critical';
    issues: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high';
        description: string;
        symptoms: string[];
    }>;
    recommendations: Array<{
        action: string;
        priority: 'immediate' | 'soon' | 'routine';
        details: string;
    }>;
}
