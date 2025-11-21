import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export function FunnelSettings() {
  const [stages, setStages] = useState([
    { id: '1', name: 'Lead', order: 1 },
    { id: '2', name: 'Qualificação', order: 2 },
    { id: '3', name: 'Proposta', order: 3 },
    { id: '4', name: 'Negociação', order: 4 },
    { id: '5', name: 'Fechamento', order: 5 },
  ]);

  const [cardFields, setCardFields] = useState({
    primary: ['name', 'contact', 'value'],
    secondary: ['actionType', 'date', 'responsible'],
  });

  const [newStageName, setNewStageName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableFields = [
    { id: 'name', label: 'Nome da Oportunidade' },
    { id: 'contact', label: 'Contato' },
    { id: 'value', label: 'Valor da Proposta' },
    { id: 'actionType', label: 'Tipo de Ação' },
    { id: 'date', label: 'Data de Criação' },
    { id: 'responsible', label: 'Responsável' },
    { id: 'origin', label: 'Origem' },
    { id: 'description', label: 'Descrição' },
  ];

  const handleAddStage = () => {
    if (!newStageName.trim()) {
      toast.error('Digite um nome para a etapa');
      return;
    }

    const newStage = {
      id: String(stages.length + 1),
      name: newStageName,
      order: stages.length + 1,
    };

    setStages([...stages, newStage]);
    setNewStageName('');
    setIsDialogOpen(false);
    toast.success('Etapa adicionada com sucesso!');
  };

  const handleDeleteStage = (id: string) => {
    if (confirm('Deseja realmente excluir esta etapa?')) {
      setStages(prev => prev.filter(stage => stage.id !== id));
      toast.success('Etapa excluída com sucesso!');
    }
  };

  const toggleField = (fieldId: string, section: 'primary' | 'secondary') => {
    setCardFields(prev => {
      const currentFields = prev[section];
      const newFields = currentFields.includes(fieldId)
        ? currentFields.filter(id => id !== fieldId)
        : [...currentFields, fieldId];
      
      return { ...prev, [section]: newFields };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Configurações do funil salvas com sucesso!');
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-8">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-gray-900 dark:text-white mb-2">Funil e Cards do Pipeline</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize as etapas do funil e a exibição dos cards
          </p>
        </div>

        <div className="space-y-6">
          {/* Etapas do Funil */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Etapas do Funil</CardTitle>
                  <CardDescription>
                    Adicione, reordene ou exclua etapas do funil de vendas
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar Etapa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Etapa</DialogTitle>
                      <DialogDescription>
                        Digite o nome da nova etapa do funil
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="stageName">Nome da Etapa</Label>
                      <Input
                        id="stageName"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        placeholder="Ex: Análise Técnica"
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddStage}>
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stages.map(stage => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <span className="text-gray-900 dark:text-white">{stage.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStage(stage.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Campos dos Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Campos dos Cards</CardTitle>
              <CardDescription>
                Selecione os campos que serão exibidos nos cards do Kanban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-900 dark:text-white mb-3">
                  Campos Primários
                </h3>
                <div className="space-y-2">
                  {availableFields.slice(0, 4).map(field => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`primary-${field.id}`}
                        checked={cardFields.primary.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id, 'primary')}
                      />
                      <Label
                        htmlFor={`primary-${field.id}`}
                        className="cursor-pointer"
                      >
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-900 dark:text-white mb-3">
                  Campos Secundários
                </h3>
                <div className="space-y-2">
                  {availableFields.slice(4).map(field => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`secondary-${field.id}`}
                        checked={cardFields.secondary.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id, 'secondary')}
                      />
                      <Label
                        htmlFor={`secondary-${field.id}`}
                        className="cursor-pointer"
                      >
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview do Card */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-sm text-gray-900 dark:text-white mb-3">
                  Preview do Card
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-w-sm">
                  <div className="space-y-2 text-sm">
                    {cardFields.primary.map(fieldId => {
                      const field = availableFields.find(f => f.id === fieldId);
                      return (
                        <div key={fieldId} className="text-gray-600 dark:text-gray-400">
                          <strong className="text-gray-900 dark:text-white">
                            {field?.label}:
                          </strong>{' '}
                          Exemplo
                        </div>
                      );
                    })}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      {cardFields.secondary.map(fieldId => {
                        const field = availableFields.find(f => f.id === fieldId);
                        return (
                          <div key={fieldId} className="text-xs text-gray-500 dark:text-gray-500">
                            {field?.label}: Exemplo
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}