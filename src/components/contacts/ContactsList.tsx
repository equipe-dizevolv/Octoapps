import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, MoreVertical, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ContactsListProps {
  onNavigate: (route: string, id?: string) => void;
}

export function ContactsList({ onNavigate }: ContactsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    status: 'active',
  });
  const [editContact, setEditContact] = useState({
    name: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    status: 'active',
  });

  const [contacts, setContacts] = useState([
    { id: '1', name: 'João Silva', cpfCnpj: '123.456.789-00', email: 'joao@email.com', phone: '(11) 98765-4321', status: 'active', lastInteraction: '15/01/2025' },
    { id: '2', name: 'Maria Santos', cpfCnpj: '987.654.321-00', email: 'maria@email.com', phone: '(11) 98765-1234', status: 'active', lastInteraction: '14/01/2025' },
    { id: '3', name: 'Pedro Oliveira', cpfCnpj: '456.789.123-00', email: 'pedro@email.com', phone: '(11) 98765-5678', status: 'inactive', lastInteraction: '10/01/2025' },
    { id: '4', name: 'Ana Costa', cpfCnpj: '789.123.456-00', email: 'ana@email.com', phone: '(11) 98765-8765', status: 'active', lastInteraction: '13/01/2025' },
  ]);

  const handleCreateContact = () => {
    if (!newContact.name || !newContact.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Contato criado com sucesso!');
    setIsDialogOpen(false);
    setNewContact({
      name: '',
      cpfCnpj: '',
      email: '',
      phone: '',
      status: 'active',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este contato?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast.success('Contato excluído com sucesso!');
    }
  };

  const openEditDialog = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setSelectedContactId(id);
      setEditContact({
        name: contact.name,
        cpfCnpj: contact.cpfCnpj,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
      });
      setEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedContactId(id);
    setDeleteDialogOpen(true);
  };

  const handleEditContact = () => {
    if (!editContact.name || !editContact.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setContacts(prev => prev.map(contact => 
      contact.id === selectedContactId 
        ? { ...contact, ...editContact }
        : contact
    ));
    
    toast.success('Contato atualizado com sucesso!');
    setEditDialogOpen(false);
    setSelectedContactId(null);
  };

  const handleDeleteContact = () => {
    setContacts(prev => prev.filter(contact => contact.id !== selectedContactId));
    toast.success('Contato excluído com sucesso!');
    setDeleteDialogOpen(false);
    setSelectedContactId(null);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.cpfCnpj.includes(searchTerm)
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Gestão de Contatos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus contatos e clientes
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Contato</DialogTitle>
              <DialogDescription>
                Preencha os dados do contato
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do contato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={newContact.cpfCnpj}
                  onChange={(e) => setNewContact(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newContact.status}
                  onValueChange={(value) => setNewContact(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateContact}>
                Salvar Contato
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-gray-900 dark:text-white">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contact.cpfCnpj}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.lastInteraction}</TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                      {contact.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onNavigate('contact-details', contact.id)}>
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(contact.id)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 dark:text-red-400"
                          onClick={() => openDeleteDialog(contact.id)}
                        >
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

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum contato encontrado
          </p>
        </div>
      )}

      {/* Edit Contact Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize os dados do contato
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo *</Label>
              <Input
                id="edit-name"
                value={editContact.name}
                onChange={(e) => setEditContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cpfCnpj">CPF/CNPJ</Label>
              <Input
                id="edit-cpfCnpj"
                value={editContact.cpfCnpj}
                onChange={(e) => setEditContact(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editContact.email}
                onChange={(e) => setEditContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editContact.phone}
                onChange={(e) => setEditContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={editContact.status}
                onValueChange={(value) => setEditContact(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditContact}>
              Salvar Alterações
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
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
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