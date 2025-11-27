'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getFeedbackSummary } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, Wand2, Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  summary: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generar Resumen con IA
    </Button>
  );
}

export function FeedbackSummaryForm() {
  const [state, formAction] = useFormState(getFeedbackSummary, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Analizador de Feedback</CardTitle>
          <CardDescription>
            Pega el feedback de un cliente para obtener un resumen positivo y negativo generado por IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="feedback">Feedback del Cliente</Label>
              <Textarea
                placeholder="Ej: 'El estiércol es de buena calidad, pero el empaque llegó roto.'"
                id="feedback"
                name="feedback"
                rows={8}
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {state.summary ? (
          <>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                 <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                 </div>
                <CardTitle className="text-green-800 dark:text-green-300">Resumen Positivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{state.summary.positiveSummary}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <ThumbsDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-red-800 dark:text-red-300">Resumen Negativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{state.summary.negativeSummary}</p>
              </CardContent>
            </Card>
          </>
        ) : (
            <Card className="flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-12 w-12" />
                    <p className="mt-4">El resumen de la IA aparecerá aquí.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
