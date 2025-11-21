// =====================================================
// EXEMPLOS DE INTEGRAÇÃO REACT + SUPABASE
// Sistema de Gestão Jurídica - Módulo de Tarefas
// =====================================================

// =====================================================
// 1. CONFIGURAÇÃO INICIAL
// =====================================================

// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types'; // Gerar com: npx supabase gen types typescript

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// =====================================================
// 2. TIPOS TYPESCRIPT
// =====================================================

// types/database.ts
export type Tarefa = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: 'Tarefa' | 'Follow-up' | 'Reunião' | 'Ligação' | 'E-mail' | 'Documento' | 'Prazo Judicial' | 'Outros';
  status: 'Pendente' | 'Em Andamento' | 'Aguardando' | 'Concluída' | 'Cancelada';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  responsavel_id: string;
  contato_id: string | null;
  oportunidade_id: string | null;
  projeto_id: string | null;
  data_vencimento: string | null;
  data_conclusao: string | null;
  progresso: number;
  tags: string[];
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
};

export type TarefaComRelacionamentos = Tarefa & {
  responsavel: {
    nome_completo: string;
    avatar_url: string | null;
  } | null;
  contato: {
    nome_completo: string;
  } | null;
  projeto: {
    titulo: string;
    numero_processo: string | null;
  } | null;
};

// =====================================================
// 3. HOOKS PERSONALIZADOS
// =====================================================

// hooks/useTarefas.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Tarefa, TarefaComRelacionamentos } from '../types/database';

interface UseTarefasOptions {
  userId?: string;
  status?: string;
  prioridade?: string;
  projetoId?: string;
}

export function useTarefas(options: UseTarefasOptions = {}) {
  const [tarefas, setTarefas] = useState<TarefaComRelacionamentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTarefas();
  }, [options]);

  async function fetchTarefas() {
    try {
      setLoading(true);
      
      let query = supabase
        .from('tarefas')
        .select(`
          *,
          responsavel:profiles!responsavel_id(nome_completo, avatar_url),
          contato:contatos(nome_completo),
          projeto:projetos(titulo, numero_processo)
        `)
        .eq('ativo', true)
        .order('data_vencimento', { ascending: true, nullsFirst: false });

      // Aplicar filtros
      if (options.userId) {
        query = query.eq('responsavel_id', options.userId);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }
      if (options.prioridade) {
        query = query.eq('prioridade', options.prioridade);
      }
      if (options.projetoId) {
        query = query.eq('projeto_id', options.projetoId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTarefas(data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar tarefas:', err);
    } finally {
      setLoading(false);
    }
  }

  return { tarefas, loading, error, refetch: fetchTarefas };
}

// hooks/useTarefa.ts
export function useTarefa(tarefaId: string | null) {
  const [tarefa, setTarefa] = useState<TarefaComRelacionamentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tarefaId) {
      setTarefa(null);
      setLoading(false);
      return;
    }

    fetchTarefa();
  }, [tarefaId]);

  async function fetchTarefa() {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('tarefas')
        .select(`
          *,
          responsavel:profiles!responsavel_id(nome_completo, avatar_url, email),
          contato:contatos(nome_completo, email, telefone_principal),
          projeto:projetos(titulo, numero_processo, status),
          oportunidade:oportunidades(titulo, estagio)
        `)
        .eq('id', tarefaId)
        .single();

      if (fetchError) throw fetchError;

      setTarefa(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar tarefa:', err);
    } finally {
      setLoading(false);
    }
  }

  return { tarefa, loading, error, refetch: fetchTarefa };
}

// hooks/useRealtimeTarefas.ts
export function useRealtimeTarefas(userId: string) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    // Buscar tarefas iniciais
    fetchInitialTarefas();

    // Configurar realtime
    const channel = supabase
      .channel('tarefas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tarefas',
          filter: `responsavel_id=eq.${userId}`
        },
        (payload) => {
          console.log('Mudança detectada:', payload);
          
          if (payload.eventType === 'INSERT') {
            setTarefas(prev => [...prev, payload.new as Tarefa]);
          } else if (payload.eventType === 'UPDATE') {
            setTarefas(prev => 
              prev.map(t => t.id === payload.new.id ? payload.new as Tarefa : t)
            );
          } else if (payload.eventType === 'DELETE') {
            setTarefas(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function fetchInitialTarefas() {
    const { data } = await supabase
      .from('tarefas')
      .select('*')
      .eq('responsavel_id', userId)
      .eq('ativo', true);
    
    if (data) setTarefas(data);
  }

  return tarefas;
}

// =====================================================
// 4. SERVIÇO DE TAREFAS (API Layer)
// =====================================================

// services/tarefasService.ts
import { supabase } from '../lib/supabase';
import type { Tarefa } from '../types/database';

export const tarefasService = {
  // Criar tarefa
  async criarTarefa(tarefa: Omit<Tarefa, 'id' | 'data_criacao' | 'data_atualizacao'>) {
    const { data, error } = await supabase
      .from('tarefas')
      .insert(tarefa)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar tarefa
  async atualizarTarefa(id: string, updates: Partial<Tarefa>) {
    const { data, error } = await supabase
      .from('tarefas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar tarefa (soft delete)
  async deletarTarefa(id: string) {
    const { error } = await supabase
      .from('tarefas')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Concluir tarefa
  async concluirTarefa(id: string) {
    const { data, error } = await supabase
      .from('tarefas')
      .update({
        status: 'Concluída',
        data_conclusao: new Date().toISOString(),
        progresso: 100
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar tarefas do usuário
  async buscarTarefasUsuario(userId: string, filtros?: {
    status?: string;
    prioridade?: string;
    dataInicio?: string;
    dataFim?: string;
  }) {
    let query = supabase
      .from('tarefas')
      .select(`
        *,
        responsavel:profiles!responsavel_id(nome_completo, avatar_url),
        projeto:projetos(titulo)
      `)
      .eq('responsavel_id', userId)
      .eq('ativo', true);

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    if (filtros?.prioridade) {
      query = query.eq('prioridade', filtros.prioridade);
    }
    if (filtros?.dataInicio) {
      query = query.gte('data_vencimento', filtros.dataInicio);
    }
    if (filtros?.dataFim) {
      query = query.lte('data_vencimento', filtros.dataFim);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Buscar tarefas atrasadas
  async buscarTarefasAtrasadas(userId: string) {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('responsavel_id', userId)
      .eq('ativo', true)
      .in('status', ['Pendente', 'Em Andamento'])
      .lt('data_vencimento', new Date().toISOString())
      .order('data_vencimento', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Buscar estatísticas do usuário
  async buscarEstatisticas(userId: string) {
    const { data, error } = await supabase
      .from('v_dashboard_tarefas')
      .select('*')
      .eq('responsavel_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 5. COMPONENTE DE LISTA DE TAREFAS
// =====================================================

// components/tarefas/TarefasList.tsx
import { useState } from 'react';
import { useTarefas } from '../../hooks/useTarefas';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TarefasListProps {
  userId: string;
  onTarefaClick: (tarefaId: string) => void;
}

export function TarefasList({ userId, onTarefaClick }: TarefasListProps) {
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const { tarefas, loading, error, refetch } = useTarefas({ 
    userId, 
    status: statusFiltro || undefined 
  });

  if (loading) {
    return <div className="p-4">Carregando tarefas...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Erro ao carregar tarefas: {error.message}
      </div>
    );
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Urgente': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Média': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Baixa': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAtrasada = (dataVencimento: string | null, status: string) => {
    if (!dataVencimento || status === 'Concluída' || status === 'Cancelada') {
      return false;
    }
    return new Date(dataVencimento) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={statusFiltro === '' ? 'default' : 'outline'}
          onClick={() => setStatusFiltro('')}
        >
          Todas
        </Button>
        <Button
          variant={statusFiltro === 'Pendente' ? 'default' : 'outline'}
          onClick={() => setStatusFiltro('Pendente')}
        >
          Pendentes
        </Button>
        <Button
          variant={statusFiltro === 'Em Andamento' ? 'default' : 'outline'}
          onClick={() => setStatusFiltro('Em Andamento')}
        >
          Em Andamento
        </Button>
        <Button
          variant={statusFiltro === 'Concluída' ? 'default' : 'outline'}
          onClick={() => setStatusFiltro('Concluída')}
        >
          Concluídas
        </Button>
      </div>

      {/* Lista de Tarefas */}
      {tarefas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma tarefa encontrada
        </div>
      ) : (
        <div className="space-y-3">
          {tarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              onClick={() => onTarefaClick(tarefa.id)}
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {tarefa.titulo}
                    </h3>
                    {isAtrasada(tarefa.data_vencimento, tarefa.status) && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                      {tarefa.prioridade}
                    </Badge>
                    <Badge variant="outline">{tarefa.tipo}</Badge>
                    <Badge variant="outline">{tarefa.status}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {tarefa.responsavel && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {tarefa.responsavel.nome_completo}
                      </div>
                    )}
                    {tarefa.data_vencimento && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(tarefa.data_vencimento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicador de progresso */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tarefa.progresso}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// 6. COMPONENTE DE FORMULÁRIO DE TAREFA
// =====================================================

// components/tarefas/TarefaForm.tsx
import { useState } from 'react';
import { tarefasService } from '../../services/tarefasService';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TarefaFormProps {
  userId: string;
  projetoId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TarefaForm({ userId, projetoId, onSuccess, onCancel }: TarefaFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Tarefa' as const,
    prioridade: 'Média' as const,
    data_vencimento: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      toast.error('O título é obrigatório');
      return;
    }

    try {
      setLoading(true);

      await tarefasService.criarTarefa({
        ...formData,
        responsavel_id: userId,
        projeto_id: projetoId || null,
        status: 'Pendente',
        progresso: 0,
        tags: [],
        ativo: true,
        criado_por: userId,
        contato_id: null,
        oportunidade_id: null,
        tarefa_pai_id: null,
        participantes_ids: [],
        data_inicio: null,
        data_conclusao: null,
        duracao_estimada: null,
        tempo_gasto: null,
        lembrete_antecedencia: null,
        lembrete_enviado: false,
        recorrente: false,
        recorrencia_tipo: null,
        recorrencia_fim: null,
        checklist: [],
        anexos: [],
        observacoes: null,
        ordem: 0
      });

      toast.success('Tarefa criada com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Ex: Analisar contrato do cliente"
          required
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Detalhes da tarefa..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tarefa">Tarefa</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Reunião">Reunião</SelectItem>
              <SelectItem value="Ligação">Ligação</SelectItem>
              <SelectItem value="E-mail">E-mail</SelectItem>
              <SelectItem value="Documento">Documento</SelectItem>
              <SelectItem value="Prazo Judicial">Prazo Judicial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prioridade">Prioridade</Label>
          <Select
            value={formData.prioridade}
            onValueChange={(value: any) => setFormData({ ...formData, prioridade: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="data_vencimento">Data de Vencimento</Label>
        <Input
          id="data_vencimento"
          type="datetime-local"
          value={formData.data_vencimento}
          onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  );
}

// =====================================================
// 7. AUTENTICAÇÃO
// =====================================================

// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: nomeCompleto,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signIn, signUp, signOut };
}

// =====================================================
// 8. EXEMPLO DE USO COMPLETO
// =====================================================

// App.tsx - Integração completa
import { useAuth } from './hooks/useAuth';
import { TarefasList } from './components/tarefas/TarefasList';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [selectedTarefa, setSelectedTarefa] = useState<string | null>(null);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header>
        <h1>Sistema de Gestão Jurídica</h1>
        <Button onClick={signOut}>Sair</Button>
      </header>

      <main>
        <TarefasList 
          userId={user.id} 
          onTarefaClick={setSelectedTarefa}
        />
      </main>
    </div>
  );
}

// =====================================================
// FIM DOS EXEMPLOS
// =====================================================
