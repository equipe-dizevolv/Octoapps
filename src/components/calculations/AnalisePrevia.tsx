import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AnalisePreviaProps {
  calcId: string | null;
  onNavigate: (route: string, id?: string) => void;
}

export function AnalisePrevia({ calcId, onNavigate }: AnalisePreviaProps) {
  const handleExport = () => {
    toast.success('Análise exportada em PDF com sucesso!');
  };

  return (
    <div className="p-4 lg:p-8">
      <Button 
        variant="ghost" 
        onClick={() => onNavigate('calculations')}
        className="gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Lista de Casos
      </Button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Análise Prévia</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Resumo comparativo do cálculo revisional
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Análise (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Comparativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Taxa do Contrato</div>
              <div className="text-2xl text-gray-900 dark:text-white">2,15% a.m.</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Taxa Média do Mercado</div>
              <div className="text-2xl text-gray-900 dark:text-white">0,85% a.m.</div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">Sobretaxa</div>
              <div className="text-2xl text-red-600 dark:text-red-400">1,30% a.m.</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Representatividade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Valor Total Pago</div>
              <div className="text-2xl text-gray-900 dark:text-white">R$ 450.000,00</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Valor que Deveria ter Pago</div>
              <div className="text-2xl text-gray-900 dark:text-white">R$ 280.000,00</div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">Diferença (Possível Restituição)</div>
              <div className="text-2xl text-green-600 dark:text-green-400">R$ 170.000,00</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pontos de Viabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
              <span className="text-gray-900 dark:text-white">
                Sobretaxa identificada acima de 1% a.m., caracterizando abusividade
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
              <span className="text-gray-900 dark:text-white">
                Diferença significativa entre valor pago e valor devido (61% de diferença)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
              <span className="text-gray-900 dark:text-white">
                Potencial de restituição elevado: R$ 170.000,00
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
              <span className="text-gray-900 dark:text-white">
                Jurisprudência favorável para este tipo de caso
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}