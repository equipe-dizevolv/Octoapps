'use client';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RelatorioCompletoProps {
  calcId: string | null;
  onNavigate: (route: string, id?: string) => void;
}

export function RelatorioCompleto({ calcId, onNavigate }: RelatorioCompletoProps) {
  const handleExport = () => {
    toast.success('Relatório exportado em PDF com sucesso!');
  };

  // Dados mockados para demonstração
  const dadosRelatorio = {
    credor: 'Ana Silva',
    devedor: 'Carlos Pereira',
    contrato: 'Contrato de Empréstimo nº 98765',
    metodologia: 'Método de Juros Simples e Taxa Média de Mercado',
  };

  const encargos = {
    valorPrincipal: 'R$ 10.000,00',
    totalJuros: 'R$ 700,00',
    totalTaxas: 'R$ 140,00',
    valorTotalDevido: 'R$ 10.840,00',
    valorRestituir: 'R$ 514,26',
  };

  const tabelaAmortizacao = [
    { mes: 1, valorOriginal: 'R$ 1.000,00', valorCorrigido: 'R$ 1.050,00', juros: 'R$ 50,00', amortizacao: 'R$ 100,00', saldoDevedor: 'R$ 950,00' },
    { mes: 2, valorOriginal: 'R$ 950,00', valorCorrigido: 'R$ 997,50', juros: 'R$ 47,50', amortizacao: 'R$ 95,00', saldoDevedor: 'R$ 902,50' },
    { mes: 3, valorOriginal: 'R$ 902,50', valorCorrigido: 'R$ 947,63', juros: 'R$ 45,13', amortizacao: 'R$ 90,25', saldoDevedor: 'R$ 857,38' },
    { mes: 4, valorOriginal: 'R$ 857,38', valorCorrigido: 'R$ 900,25', juros: 'R$ 42,88', amortizacao: 'R$ 85,74', saldoDevedor: 'R$ 815,51' },
    { mes: 5, valorOriginal: 'R$ 815,51', valorCorrigido: 'R$ 856,29', juros: 'R$ 40,78', amortizacao: 'R$ 81,55', saldoDevedor: 'R$ 777,04' },
    { mes: 6, valorOriginal: 'R$ 777,04', valorCorrigido: 'R$ 815,89', juros: 'R$ 38,85', amortizacao: 'R$ 77,70', saldoDevedor: 'R$ 739,84' },
    { mes: 7, valorOriginal: 'R$ 739,84', valorCorrigido: 'R$ 776,83', juros: 'R$ 36,99', amortizacao: 'R$ 73,98', saldoDevedor: 'R$ 665,85' },
    { mes: 8, valorOriginal: 'R$ 665,85', valorCorrigido: 'R$ 699,14', juros: 'R$ 33,29', amortizacao: 'R$ 66,59', saldoDevedor: 'R$ 599,26' },
    { mes: 9, valorOriginal: 'R$ 599,26', valorCorrigido: 'R$ 629,22', juros: 'R$ 29,96', amortizacao: 'R$ 59,93', saldoDevedor: 'R$ 539,33' },
    { mes: 10, valorOriginal: 'R$ 539,33', valorCorrigido: 'R$ 566,30', juros: 'R$ 26,97', amortizacao: 'R$ 53,93', saldoDevedor: 'R$ 485,40' },
    { mes: 11, valorOriginal: 'R$ 485,40', valorCorrigido: 'R$ 509,67', juros: 'R$ 24,27', amortizacao: 'R$ 48,54', saldoDevedor: 'R$ 436,86' },
    { mes: 12, valorOriginal: 'R$ 436,86', valorCorrigido: 'R$ 458,70', juros: 'R$ 21,84', amortizacao: 'R$ 43,69', saldoDevedor: 'R$ 393,17' },
  ];

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
          <h1 className="text-gray-900 dark:text-white mb-2">Relatório Completo de Cálculo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Relatório detalhado de cálculos financeiros para processos judiciais.
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório Completo (PDF)
        </Button>
      </div>

      <div className="space-y-6">
        {/* Dados do Credor, Devedor e do Processo */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Credor, Devedor e do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Credor</p>
                <p className="text-gray-900 dark:text-white">{dadosRelatorio.credor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Devedor</p>
                <p className="text-gray-900 dark:text-white">{dadosRelatorio.devedor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Dados do Contrato</p>
                <p className="text-gray-900 dark:text-white">{dadosRelatorio.contrato}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Metodologia de Cálculo</p>
                <p className="text-gray-900 dark:text-white">{dadosRelatorio.metodologia}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes de Encargos */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes de Encargos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Valor Principal</Label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950">
                  <p className="text-gray-900 dark:text-white">{encargos.valorPrincipal}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total de Juros</Label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950">
                  <p className="text-gray-900 dark:text-white">{encargos.totalJuros}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total de Taxas</Label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950">
                  <p className="text-gray-900 dark:text-white">{encargos.totalTaxas}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor Total Devido</Label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950">
                  <p className="text-gray-900 dark:text-white">{encargos.valorTotalDevido}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor Total a Restituir</Label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-400">{encargos.valorRestituir}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Amortização */}
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Amortização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Valor Original da Parcela</TableHead>
                    <TableHead>Valor Corrigido</TableHead>
                    <TableHead>Juros</TableHead>
                    <TableHead>Amortização</TableHead>
                    <TableHead>Saldo Devedor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabelaAmortizacao.map((row) => (
                    <TableRow key={row.mes}>
                      <TableCell>{row.mes}</TableCell>
                      <TableCell>{row.valorOriginal}</TableCell>
                      <TableCell>{row.valorCorrigido}</TableCell>
                      <TableCell>{row.juros}</TableCell>
                      <TableCell>{row.amortizacao}</TableCell>
                      <TableCell>{row.saldoDevedor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 dark:text-white leading-relaxed">
              Este relatório de detalha os cálculos financeiros para o processo número 1234567-89.2023.8.00.0001, envolvendo o credor {dadosRelatorio.credor} e o devedor {dadosRelatorio.devedor}. Os cálculos incluem uma tabela de amortização, detalhes de encargos e são baseados no contrato de empréstimo nº 98765.
            </p>
          </CardContent>
        </Card>

        {/* Base Legal e Metodologia */}
        <Card>
          <CardHeader>
            <CardTitle>Base Legal e Metodologia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 dark:text-white leading-relaxed">
              Os cálculos são baseados no Código Civil Brasileiro e no Código de Defesa do Consumidor, aplicando o método de juros compostos com uma taxa de juros mensal fixa de R$ 90,00. A amortização segue o método SAC (Sistema de Amortização Constante).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente Label auxiliar para manter consistência visual
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {children}
    </p>
  );
}
