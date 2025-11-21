'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, MoreVertical, Calendar, DollarSign, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../ui/badge';

interface OpportunityCardProps {
  opportunity: any;
  onNavigate: (route: string, id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function OpportunityCard({ opportunity, onNavigate, onEdit, onDelete }: OpportunityCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h4 
          className="text-sm text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => onNavigate('opportunity-details', opportunity.id)}
        >
          {opportunity.name}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNavigate('opportunity-details', opportunity.id)}>
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(opportunity.id)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 dark:text-red-400"
              onClick={() => onDelete(opportunity.id)}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="w-3 h-3" />
          <span>{opportunity.contact}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <DollarSign className="w-3 h-3" />
          <span className="text-green-600 dark:text-green-400">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opportunity.value)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{opportunity.date}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Badge variant="secondary" className="text-xs">
          {opportunity.actionType}
        </Badge>
      </div>
    </div>
  );
}

interface CRMKanbanProps {
  onNavigate: (route: string, id?: string) => void;
}

export function CRMKanban({ onNavigate }: CRMKanbanProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    contact: '',
    actionType: '',
    value: '',
    stage: 'lead',
    responsible: '',
  });

  const [editOpportunity, setEditOpportunity] = useState({
    name: '',
    contact: '',
    actionType: '',
    value: '',
    stage: '',
    responsible: '',
  });

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-500' },
    { id: 'qualification', name: 'Qualificação', color: 'bg-blue-500' },
    { id: 'proposal', name: 'Proposta', color: 'bg-yellow-500' },
    { id: 'negotiation', name: 'Negociação', color: 'bg-orange-500' },
    { id: 'closing', name: 'Fechamento', color: 'bg-green-500' },
  ];

  const [opportunities, setOpportunities] = useState([
    { id: '1', name: 'Revisão Financiamento - Cliente ABC', contact: 'João Silva', value: 25000, date: '15/01/2025', actionType: 'Revisional', stage: 'lead' },
    { id: '2', name: 'Cartão de Crédito - Cliente XYZ', contact: 'Maria Santos', value: 15000, date: '16/01/2025', actionType: 'Revisional', stage: 'lead' },
    { id: '3', name: 'Empréstimo Consignado', contact: 'Pedro Oliveira', value: 35000, date: '14/01/2025', actionType: 'Revisional', stage: 'qualification' },
    { id: '4', name: 'Financiamento Veículo', contact: 'Ana Costa', value: 45000, date: '13/01/2025', actionType: 'Revisional', stage: 'qualification' },
    { id: '5', name: 'Crédito Imobiliário', contact: 'Carlos Ferreira', value: 120000, date: '12/01/2025', actionType: 'Revisional', stage: 'proposal' },
    { id: '6', name: 'Revisão Cartão Premium', contact: 'Juliana Lima', value: 8000, date: '11/01/2025', actionType: 'Revisional', stage: 'negotiation' },
  ]);

  const handleCreateOpportunity = () => {
    if (!newOpportunity.name || !newOpportunity.contact) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newId = String(opportunities.length + 1);
    const newOpp = {
      id: newId,
      name: newOpportunity.name,
      contact: newOpportunity.contact,
      value: parseFloat(newOpportunity.value) || 0,
      date: new Date().toLocaleDateString('pt-BR'),
      actionType: newOpportunity.actionType,
      stage: newOpportunity.stage,
    };

    setOpportunities(prev => [...prev, newOpp]);
    toast.success('Oportunidade criada com sucesso!');
    setIsCreateDialogOpen(false);
    setNewOpportunity({
      name: '',
      contact: '',
      actionType: '',
      value: '',
      stage: 'lead',
      responsible: '',
    });
  };

  const handleOpenEdit = (id: string) => {
    const opp = opportunities.find(o => o.id === id);
    if (opp) {
      setEditOpportunity({
        name: opp.name,
        contact: opp.contact,
        actionType: opp.actionType,
        value: String(opp.value),
        stage: opp.stage,
        responsible: '',
      });
      setSelectedOpportunityId(id);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditOpportunity = () => {
    if (!editOpportunity.name || !editOpportunity.contact) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setOpportunities(prev => prev.map(opp => 
      opp.id === selectedOpportunityId 
        ? {
            ...opp,
            name: editOpportunity.name,
            contact: editOpportunity.contact,
            actionType: editOpportunity.actionType,
            value: parseFloat(editOpportunity.value) || 0,
            stage: editOpportunity.stage,
          }
        : opp
    ));

    toast.success('Oportunidade atualizada com sucesso!');
    setIsEditDialogOpen(false);
    setSelectedOpportunityId(null);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedOpportunityId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOpportunityId) {
      setOpportunities(prev => prev.filter(opp => opp.id !== selectedOpportunityId));
      toast.success('Oportunidade excluída com sucesso!');
      setIsDeleteDialogOpen(false);
      setSelectedOpportunityId(null);
    }
  };

  const getStageOpportunities = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getStageOpportunities(stageId).reduce((sum, opp) => sum + opp.value, 0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 lg:p-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">Pipeline - Kanban de Oportunidades</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie suas oportunidades de vendas
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Oportunidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Oportunidade</DialogTitle>
                <DialogDescription>
                  Preencha os dados da oportunidade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Oportunidade *</Label>
                  <Input
                    id="name"
                    value={newOpportunity.name}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Revisão de Financiamento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contato *</Label>
                  <Select 
                    value={newOpportunity.contact}
                    onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, contact: value }))}
                  >
                    <SelectTrigger id="contact">
                      <SelectValue placeholder="Selecione um contato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Joao Silva">João Silva</SelectItem>
                      <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                      <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionType">Tipo de Ação</Label>
                  <Select 
                    value={newOpportunity.actionType}
                    onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, actionType: value }))}
                  >
                    <SelectTrigger id="actionType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Revisional">Revisional</SelectItem>
                      <SelectItem value="Consultoria">Consultoria</SelectItem>
                      <SelectItem value="Contencioso">Contencioso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor da Proposta (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newOpportunity.value}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Etapa do Funil</Label>
                  <Select 
                    value={newOpportunity.stage}
                    onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, stage: value }))}
                  >
                    <SelectTrigger id="stage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável</Label>
                  <Select 
                    value={newOpportunity.responsible}
                    onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, responsible: value }))}
                  >
                    <SelectTrigger id="responsible">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ana Admin">Ana Admin</SelectItem>
                      <SelectItem value="Diego Perito">Diego Perito</SelectItem>
                      <SelectItem value="Maria Advogada">Maria Advogada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateOpportunity}>
                  Criar Oportunidade
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4 lg:p-8">
        <div className="flex gap-4 min-w-max">
          {stages.map(stage => {
            const stageOpps = getStageOpportunities(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div key={stage.id} className="w-80 flex-shrink-0">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="text-gray-900 dark:text-white">
                      {stage.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({stageOpps.length})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stageTotal)}
                  </div>
                </div>

                <div className="space-y-3 min-h-[200px] bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  {stageOpps.map(opp => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onNavigate={onNavigate}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Oportunidade</DialogTitle>
            <DialogDescription>
              Atualize os dados da oportunidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Oportunidade *</Label>
              <Input
                id="name"
                value={editOpportunity.name}
                onChange={(e) => setEditOpportunity(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Revisão de Financiamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contato *</Label>
              <Select 
                value={editOpportunity.contact}
                onValueChange={(value) => setEditOpportunity(prev => ({ ...prev, contact: value }))}
              >
                <SelectTrigger id="contact">
                  <SelectValue placeholder="Selecione um contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Joao Silva">João Silva</SelectItem>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Tipo de Ação</Label>
              <Select 
                value={editOpportunity.actionType}
                onValueChange={(value) => setEditOpportunity(prev => ({ ...prev, actionType: value }))}
              >
                <SelectTrigger id="actionType">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Revisional">Revisional</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                  <SelectItem value="Contencioso">Contencioso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor da Proposta (R$)</Label>
              <Input
                id="value"
                type="number"
                value={editOpportunity.value}
                onChange={(e) => setEditOpportunity(prev => ({ ...prev, value: e.target.value }))}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Etapa do Funil</Label>
              <Select 
                value={editOpportunity.stage}
                onValueChange={(value) => setEditOpportunity(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger id="stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Select 
                value={editOpportunity.responsible}
                onValueChange={(value) => setEditOpportunity(prev => ({ ...prev, responsible: value }))}
              >
                <SelectTrigger id="responsible">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ana Admin">Ana Admin</SelectItem>
                  <SelectItem value="Diego Perito">Diego Perito</SelectItem>
                  <SelectItem value="Maria Advogada">Maria Advogada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditOpportunity}>
              Atualizar Oportunidade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Oportunidade</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir esta oportunidade?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}