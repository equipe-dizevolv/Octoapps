import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Edit, Trash2, Plus, MoreVertical } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ContactDetailsProps {
  contactId: string | null;
  onNavigate: (route: string, id?: string) => void;
}

export function ContactDetails({ contactId, onNavigate }: ContactDetailsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newOppDialogOpen, setNewOppDialogOpen] = useState(false);
  const [editOppDialogOpen, setEditOppDialogOpen] = useState(false);
  const [deleteOppDialogOpen, setDeleteOppDialogOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  const contact = {
    id: contactId || '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
    status: 'active',
  };

  const opportunities = [
    { id: '1', name: 'Revisão Financiamento', stage: 'Proposta', value: 25000, responsible: 'Ana Admin', status: 'Em andamento' },
    { id: '2', name: 'Cartão de Crédito', stage: 'Qualificação', value: 15000, responsible: 'Maria Advogada', status: 'Em andamento' },
  ];

  const handleEditContact = () => {
    toast.success('Contato atualizado com sucesso!');
    setEditDialogOpen(false);
  };

  const handleDeleteContact = () => {
    toast.success('Contato excluído com sucesso!');
    setDeleteDialogOpen(false);
    onNavigate('contacts');
  };

  const handleDeleteOpportunity = () => {
    toast.success('Oportunidade excluída com sucesso!');
    setDeleteOppDialogOpen(false);
    setSelectedOppId(null);
  };

  const handleEditOpportunity = () => {
    toast.success('Oportunidade atualizada com sucesso!');
    setEditOppDialogOpen(false);
    setSelectedOppId(null);
  };

  const openDeleteOppDialog = (oppId: string) => {
    setSelectedOppId(oppId);
    setDeleteOppDialogOpen(true);
  };

  const openEditOppDialog = (oppId: string) => {
    setSelectedOppId(oppId);
    setEditOppDialogOpen(true);
  };

  const getSelectedOpportunity = () => {
    return opportunities.find(opp => opp.id === selectedOppId);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('contacts')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Contatos
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">{contact.name}</h1>
            <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
              {contact.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <Button variant="destructive" className="gap-2" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">CPF</div>
              <div className="text-gray-900 dark:text-white">{contact.cpf}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">E-mail</div>
              <div className="text-gray-900 dark:text-white">{contact.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Telefone</div>
              <div className="text-gray-900 dark:text-white">{contact.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Endereço</div>
              <div className="text-gray-900 dark:text-white">{contact.address}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-white">Oportunidades Vinculadas</h2>
          <Button className="gap-2" onClick={() => setNewOppDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Nova Oportunidade
          </Button>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map(opp => (
                <TableRow key={opp.id}>
                  <TableCell>{opp.id}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{opp.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{opp.stage}</Badge>
                  </TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opp.value)}
                  </TableCell>
                  <TableCell>{opp.responsible}</TableCell>
                  <TableCell>
                    <Badge>{opp.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onNavigate('opportunity-details', opp.id)}>
                          Ver Processo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditOppDialog(opp.id)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => openDeleteOppDialog(opp.id)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contato.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={contact.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={contact.cpf} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={contact.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={contact.phone} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={contact.address} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value={contact.status} onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditContact}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Opportunity Dialog */}
      <AlertDialog open={deleteOppDialogOpen} onOpenChange={setDeleteOppDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Oportunidade</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir esta oportunidade? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOppDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOpportunity} className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Opportunity Dialog */}
      <Dialog open={editOppDialogOpen} onOpenChange={setEditOppDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Oportunidade</DialogTitle>
            <DialogDescription>
              Atualize as informações da oportunidade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={getSelectedOpportunity()?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage">Etapa</Label>
              <Select value={getSelectedOpportunity()?.stage} onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Qualificação">Qualificação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" value={getSelectedOpportunity()?.value} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsible">Responsável</Label>
              <Input id="responsible" value={getSelectedOpportunity()?.responsible} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value={getSelectedOpportunity()?.status} onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOppDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditOpportunity}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Opportunity Dialog */}
      <Dialog open={newOppDialogOpen} onOpenChange={setNewOppDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Crie uma nova oportunidade para este contato.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage">Etapa</Label>
              <Select value="Proposta" onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Qualificação">Qualificação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsible">Responsável</Label>
              <Input id="responsible" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value="Em andamento" onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewOppDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => {
              toast.success('Oportunidade criada com sucesso!');
              setNewOppDialogOpen(false);
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}