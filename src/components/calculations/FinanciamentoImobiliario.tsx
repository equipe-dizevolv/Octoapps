'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FinanciamentoImobiliarioProps {
  calcId: string | null;
  onNavigate: (route: string, id?: string) => void;
}

export function FinanciamentoImobiliario({ calcId, onNavigate }: FinanciamentoImobiliarioProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    credor: '',
    devedor: '',
    sistemaAmortizacao: '',
    dataCalculo: '',
    totalFinanciado: '',
    valorParcela: '',
    quantidadeParcelas: '',
    dataPrimeiraParcela: '',
    dataContrato: '',
    indiceCorrecao: '',
  });

  // Carregar dados quando estiver editando
  useEffect(() => {
    if (calcId) {
      // Simular carregamento de dados
      setFormData({
        credor: 'Banco XYZ S.A.',
        devedor: 'Ana Silva',
        sistemaAmortizacao: 'sac',
        dataCalculo: '2025-01-15',
        totalFinanciado: 'R$ 250.000,00',
        valorParcela: 'R$ 1.850,00',
        quantidadeParcelas: '360',
        dataPrimeiraParcela: '2020-02-01',
        dataContrato: '2020-01-15',
        indiceCorrecao: 'tr',
      });
      toast.info('Dados do caso carregados para edição');
    }
  }, [calcId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Dados salvos com sucesso!');
  };

  const handleAnalysis = () => {
    toast.success('Iniciando análise prévia...');
    setTimeout(() => onNavigate('calc-analise', '1'), 500);
  };

  const handleGenerateReport = () => {
    toast.success('Gerando relatório completo...');
    setTimeout(() => onNavigate('calc-relatorio', '1'), 500);
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

      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">
          Revisão de Financiamento Imobiliário
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credor">Credor</Label>
                <Input id="credor" placeholder="Nome da Instituição Financeira" value={formData.credor} onChange={(e) => handleInputChange('credor', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devedor">Devedor</Label>
                <Input id="devedor" placeholder="Nome Completo do Devedor" value={formData.devedor} onChange={(e) => handleInputChange('devedor', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                <Select>
                  <SelectTrigger id="tipoContrato">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ccb">CCB</SelectItem>
                    <SelectItem value="financiamento">Financiamento</SelectItem>
                    <SelectItem value="sac">SAC</SelectItem>
                    <SelectItem value="price">PRICE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataCalculo">Data do Cálculo</Label>
                <Input id="dataCalculo" type="date" placeholder="Escolha a data" value={formData.dataCalculo} onChange={(e) => handleInputChange('dataCalculo', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorBem">Valor do Bem</Label>
                <Input id="valorBem" type="text" placeholder="Valor total do imóvel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorFinanciado">Valor Financiado</Label>
                <Input id="valorFinanciado" type="text" placeholder="Valor total do financiamento" value={formData.totalFinanciado} onChange={(e) => handleInputChange('totalFinanciado', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entrada">Entrada</Label>
                <Input id="entrada" type="text" placeholder="Valor da entrada" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaAmort">Sistema de Amortização</Label>
                <Select>
                  <SelectTrigger id="sistemaAmort">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sac">SAC</SelectItem>
                    <SelectItem value="price">PRICE</SelectItem>
                    <SelectItem value="gauss">GAUSS</SelectItem>
                    <SelectItem value="mqjs">MQJS</SelectItem>
                    <SelectItem value="sac-juros-simples">SAC a Juros Simples</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexador">Indexador de Correção Monetária</Label>
                <Select>
                  <SelectTrigger id="indexador">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">TR</SelectItem>
                    <SelectItem value="ipca">IPCA</SelectItem>
                    <SelectItem value="inpc">INPC</SelectItem>
                    <SelectItem value="igpm">IGP-M</SelectItem>
                    <SelectItem value="incc">INCC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parcelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorParcela">Valor da Parcela</Label>
                <Input id="valorParcela" type="text" placeholder="Valor da parcela mensal" value={formData.valorParcela} onChange={(e) => handleInputChange('valorParcela', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numParcelas">Número de Parcelas</Label>
                <Input id="numParcelas" type="text" placeholder="Informe a quantidade de parcelas" value={formData.quantidadeParcelas} onChange={(e) => handleInputChange('quantidadeParcelas', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primeiroVenc">Data do 1º Vencimento</Label>
                <Input id="primeiroVenc" type="date" placeholder="Escolha a data" value={formData.dataPrimeiraParcela} onChange={(e) => handleInputChange('dataPrimeiraParcela', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxas e Juros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jurosMensal">Taxa de Juros Mensal</Label>
                <Input id="jurosMensal" type="text" placeholder="Ex: 1,2% ou 0,012" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurosAnual">Taxa de Juros Anual</Label>
                <Input id="jurosAnual" type="text" placeholder="Ex: 15% ou 0,15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="multa">Multa Moratória %</Label>
                <Input id="multa" type="text" placeholder="Ex: 2%" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moratoria">Juros de Mora %</Label>
                <Input id="moratoria" type="text" placeholder="Ex: 1%" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seguros">Taxas de Seguro</Label>
                <Input id="seguros" type="text" placeholder="Valor do seguro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outrosEncargos">Outros Encargos</Label>
                <Input id="outrosEncargos" type="text" placeholder="Valor de outras taxas" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tarifaAvaliacao">Tarifa de Avaliação do Bem</Label>
                <Input id="tarifaAvaliacao" type="text" placeholder="Digite o valor cobrado pela avaliação" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={handleAnalysis}>
            Iniciar Análise Prévia
          </Button>
          <Button onClick={handleGenerateReport}>
            Gerar Relatório Completo
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Salvar Dados
          </Button>
        </div>
      </div>
    </div>
  );
}