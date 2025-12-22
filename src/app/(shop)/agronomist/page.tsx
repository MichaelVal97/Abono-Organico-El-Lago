'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Leaf, Calculator } from 'lucide-react';

interface PlantAnalysis {
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

export default function AgronomistPage() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    // Calculator State
    const [calcArea, setCalcArea] = useState('');
    const [calcUnit, setCalcUnit] = useState('m2');
    const [calcCrop, setCalcCrop] = useState('vegetables');
    const [calcResult, setCalcResult] = useState<number | null>(null);

    const handleCalculate = () => {
        const area = parseFloat(calcArea);
        if (isNaN(area) || area <= 0) return;

        // Base dosage rates (kg per unit)
        // These are example values - normally would come from a database or more complex logic
        const rates = {
            vegetables: { m2: 0.5, ha: 5000 },
            fruit_trees: { m2: 1.0, ha: 10000 },
            ornamental: { m2: 0.2, ha: 2000 },
            lawn: { m2: 0.1, ha: 1000 }
        };

        const cropRates = rates[calcCrop as keyof typeof rates];
        const rate = calcUnit === 'm2' ? cropRates.m2 : cropRates.ha;

        setCalcResult(area * rate);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 3) {
            alert('Máximo 3 imágenes permitidas');
            return;
        }

        setSelectedImages(files);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleAnalyze = async () => {
        if (selectedImages.length === 0) {
            alert('Por favor selecciona al menos una imagen');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        selectedImages.forEach(file => {
            formData.append('images', file);
        });

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/agronomist/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al analizar la planta');
            }

            const result = await response.json();
            setAnalysis(result);
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al analizar la planta. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'needs_attention':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low':
                return 'bg-blue-100 text-blue-800';
            case 'medium':
                return 'bg-orange-100 text-orange-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-primary">Powered by Gemini AI</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Sé Agrónomo</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Herramientas profesionales para el cuidado de tus cultivos.
                        Calcula dosis de abono o diagnostica problemas con IA.
                    </p>
                </div>

                {/* Calculator Section */}
                <Card className="mb-12 bg-secondary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            Calculadora de Dosis de Abono
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Área</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 100"
                                    value={calcArea}
                                    onChange={(e) => setCalcArea(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unidad</label>
                                <select
                                    value={calcUnit}
                                    onChange={(e) => setCalcUnit(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="m2">Metros Cuadrados (m²)</option>
                                    <option value="ha">Hectáreas (Ha)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Cultivo</label>
                                <select
                                    value={calcCrop}
                                    onChange={(e) => setCalcCrop(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="vegetables">Hortalizas / Verduras</option>
                                    <option value="fruit_trees">Árboles Frutales</option>
                                    <option value="ornamental">Plantas Ornamentales</option>
                                    <option value="lawn">Césped / Pasto</option>
                                </select>
                            </div>

                            <Button onClick={handleCalculate} className="w-full">
                                Calcular
                            </Button>
                        </div>

                        {calcResult !== null && (
                            <div className="mt-6 p-4 bg-background rounded-lg border flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cantidad Recomendada:</p>
                                    <p className="text-2xl font-bold text-primary">{calcResult.toFixed(2)} kg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Para un área de:</p>
                                    <p className="font-medium">{calcArea} {calcUnit === 'm2' ? 'm²' : 'Ha'}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload Section */}
                {!analysis && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Sube Fotos de tu Planta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-lg font-medium mb-2">Haz clic para seleccionar imágenes</p>
                                        <p className="text-sm text-muted-foreground">
                                            Máximo 3 imágenes (JPG, PNG, WEBP)
                                        </p>
                                    </label>
                                </div>

                                {previews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {previews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}

                                {selectedImages.length > 0 && (
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {loading ? 'Analizando...' : 'Analizar Planta'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results Section */}
                {analysis && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Resultados del Análisis</h2>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAnalysis(null);
                                    setSelectedImages([]);
                                    setPreviews([]);
                                }}
                            >
                                Analizar Otra Planta
                            </Button>
                        </div>

                        {/* Species Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🌿 Identificación de Especie</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-lg">
                                        <span className="font-semibold">Nombre Científico:</span>{' '}
                                        <span className="italic">{analysis.species.scientific}</span>
                                    </p>
                                    <p className="text-lg">
                                        <span className="font-semibold">Nombres Comunes:</span>{' '}
                                        {analysis.species.common.join(', ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Confianza: {analysis.species.confidence}%
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>💚 Estado de Salud</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`inline-block px-4 py-2 rounded-lg border ${getHealthStatusColor(analysis.healthStatus)}`}>
                                    {analysis.healthStatus === 'healthy' && 'Saludable'}
                                    {analysis.healthStatus === 'needs_attention' && 'Necesita Atención'}
                                    {analysis.healthStatus === 'critical' && 'Estado Crítico'}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Issues Card */}
                        {analysis.issues.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>🔍 Problemas Detectados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {analysis.issues.map((issue, index) => (
                                            <div key={index} className="border-l-4 border-primary pl-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold">{issue.type}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(issue.severity)}`}>
                                                        {issue.severity === 'low' && 'Baja'}
                                                        {issue.severity === 'medium' && 'Media'}
                                                        {issue.severity === 'high' && 'Alta'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                                                <ul className="text-sm space-y-1">
                                                    {issue.symptoms.map((symptom, idx) => (
                                                        <li key={idx}>• {symptom}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recommendations Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>💡 Recomendaciones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analysis.recommendations.map((rec, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${rec.priority === 'immediate' ? 'bg-red-100 text-red-800' :
                                                    rec.priority === 'soon' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {rec.priority === 'immediate' && 'Inmediato'}
                                                    {rec.priority === 'soon' && 'Pronto'}
                                                    {rec.priority === 'routine' && 'Rutina'}
                                                </span>
                                                <h3 className="font-semibold">{rec.action}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{rec.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
