import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface OpportunityDetailsProps {
  opportunityId: string | null;
  onNavigate: (route: string, id?: string) => void;
}

export function OpportunityDetails({ opportunityId, onNavigate }: OpportunityDetailsProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const opportunity = {
    id: opportunityId || '1',
    name: 'Revisão Financiamento - Cliente ABC',
    contact: 'João Silva',
    cpf: '123.456.789-00',
    actionType: 'Revisional',
    stage: 'Proposta',
    value: 25000,
    origin: 'Indicação',
    responsible: 'Ana Admin',
    createdAt: '15/01/2025',
  };

  const history = [
    { id: '1', type: 'Tarefa', description: 'Reunião inicial com cliente', date: '15/01/2025 10:00', user: 'Ana Admin' },
    { id: '2', type: 'Follow-up', description: 'Envio de proposta comercial', date: '16/01/2025 14:30', user: 'Ana Admin' },
    { id: '3', type: 'Reunião', description: 'Apresentação da proposta', date: '17/01/2025 16:00', user: 'Ana Admin' },
  ];

  const handleSchedule = () => {
    toast.success('Interação agendada com sucesso!');
    setIsScheduleDialogOpen(false);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('crm')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Pipeline
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">{opportunity.name}</h1>
            <div className="flex gap-2">
              <Badge variant="outline">{opportunity.stage}</Badge>
              <Badge>{opportunity.actionType}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Nome</div>
              <div className="text-gray-900 dark:text-white">{opportunity.contact}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">CPF</div>
              <div className="text-gray-900 dark:text-white">{opportunity.cpf}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tipo de Ação</div>
              <div className="text-gray-900 dark:text-white">{opportunity.actionType}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Funil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Etapa</div>
              <div className="text-gray-900 dark:text-white">{opportunity.stage}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Valor da Proposta</div>
              <div className="text-green-600 dark:text-green-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opportunity.value)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Origem</div>
              <div className="text-gray-900 dark:text-white">{opportunity.origin}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Responsável</div>
              <div className="text-gray-900 dark:text-white">{opportunity.responsible}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Data de Criação</div>
              <div className="text-gray-900 dark:text-white">{opportunity.createdAt}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico de Interações</CardTitle>
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar Interação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agendar Interação</DialogTitle>
                  <DialogDescription>
                    Escolha o tipo de interação e preencha os detalhes
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="task" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="task">Tarefa</TabsTrigger>
                    <TabsTrigger value="followup">Follow-up</TabsTrigger>
                    <TabsTrigger value="meeting">Reunião</TabsTrigger>
                  </TabsList>
                  <TabsContent value="task" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Título da Tarefa</Label>
                      <Input id="task-title" placeholder="Ex: Enviar documentação" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-date">Data e Hora</Label>
                      <Input id="task-date" type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-notes">Observações</Label>
                      <Textarea id="task-notes" placeholder="Detalhes da tarefa..." />
                    </div>
                  </TabsContent>
                  <TabsContent value="followup" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="followup-title">Título do Follow-up</Label>
                      <Input id="followup-title" placeholder="Ex: Retornar contato" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followup-date">Data e Hora</Label>
                      <Input id="followup-date" type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followup-notes">Observações</Label>
                      <Textarea id="followup-notes" placeholder="Detalhes do follow-up..." />
                    </div>
                  </TabsContent>
                  <TabsContent value="meeting" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meeting-title">Título da Reunião</Label>
                      <Input id="meeting-title" placeholder="Ex: Apresentação de proposta" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-date">Data e Hora</Label>
                      <Input id="meeting-date" type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-notes">Observações</Label>
                      <Textarea id="meeting-notes" placeholder="Detalhes da reunião..." />
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSchedule}>
                    Agendar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{item.type}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white mb-1">{item.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Por {item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}