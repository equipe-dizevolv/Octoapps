# 📋 Guia de Implementação - Database Supabase

## Sistema de Gestão Jurídica - Módulo de Tarefas

Este guia fornece instruções passo a passo para implementar a estrutura de banco de dados no Supabase para o sistema de gestão jurídica com foco em tarefas.

---

## 🎯 Visão Geral da Estrutura

### Tabelas Principais

1. **profiles** - Perfis de usuários (Ana Admin, Diego Perito, Maria Advogada)
2. **contatos** - Cadastro de clientes e leads
3. **oportunidades** - Pipeline CRM Kanban
4. **projetos** - Casos jurídicos e projetos
5. **tarefas** - ⭐ Sistema principal de gestão de tarefas
6. **comentarios** - Histórico e comentários
7. **notificacoes** - Sistema de notificações em tempo real
8. **arquivos** - Gestão de anexos

### Tabelas Auxiliares

- **roles** / **user_roles** - Controle de permissões
- **tags** - Sistema de etiquetas
- **templates_tarefas** - Templates reutilizáveis
- **calculos** - Cálculos revisionais
- **peticoes** - Geração de petições
- **log_atividades** - Auditoria completa

---

## 📝 Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização (se não tiver)
3. Clique em **"New Project"**
4. Preencha:
   - **Nome do Projeto**: `gestao-juridica-producao`
   - **Database Password**: (senha forte - guarde com segurança!)
   - **Região**: `South America (São Paulo)` *(melhor para Brasil)*
   - **Pricing Plan**: `Free` (para testes) ou `Pro`
5. Aguarde ~2 minutos para provisionar

---

## 🔧 Passo 2: Executar o Schema Principal

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie **TODO** o conteúdo do arquivo `database-schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (Ctrl + Enter)
6. Aguarde a execução (~10-30 segundos)
7. Verifique se não há erros no console

> ⚠️ **IMPORTANTE**: Execute o schema completo de uma vez só para garantir que todas as dependências sejam criadas na ordem correta.

---

## 🔐 Passo 3: Configurar Autenticação

### 3.1 Habilitar Providers

1. Vá em **Authentication** > **Providers**
2. Habilite:
   - ✅ **Email** (obrigatório)
   - ✅ **Google** (recomendado)
   - ✅ **Microsoft** (opcional - para empresas)

### 3.2 Configurar Email Templates

1. Vá em **Authentication** > **Email Templates**
2. Customize os templates:
   - **Confirm signup**: Email de confirmação
   - **Magic Link**: Login por link mágico
   - **Change Email Address**: Alteração de email
   - **Reset Password**: Recuperação de senha

**Exemplo de template em português:**

```html
<h2>Bem-vindo ao Sistema de Gestão Jurídica</h2>
<p>Clique no link abaixo para confirmar seu email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

### 3.3 Configurar Políticas de Senha

1. Vá em **Authentication** > **Policies**
2. Configure:
   - Mínimo de 8 caracteres
   - Exigir letra maiúscula
   - Exigir número
   - Exigir caractere especial

---

## 🗂️ Passo 4: Configurar Storage (para Anexos)

### 4.1 Criar Buckets

1. Vá em **Storage**
2. Crie os seguintes buckets:

#### Bucket: `tarefas-anexos`
- **Public**: `false` (privado)
- **File size limit**: `10 MB`
- **Allowed MIME types**: 
  - `application/pdf`
  - `image/jpeg`, `image/png`, `image/webp`
  - `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

#### Bucket: `contratos-ocr`
- **Public**: `false`
- **File size limit**: `25 MB`
- **Allowed MIME types**: `application/pdf`, `image/*`

#### Bucket: `peticoes-documentos`
- **Public**: `false`
- **File size limit**: `15 MB`
- **Allowed MIME types**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 4.2 Configurar Políticas de Storage

Execute no **SQL Editor**:

```sql
-- Política para upload de arquivos
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('tarefas-anexos', 'contratos-ocr', 'peticoes-documentos'));

-- Política para leitura de arquivos
CREATE POLICY "Usuários podem ver seus próprios arquivos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN ('tarefas-anexos', 'contratos-ocr', 'peticoes-documentos')
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para deletar arquivos
CREATE POLICY "Usuários podem deletar seus próprios arquivos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('tarefas-anexos', 'contratos-ocr', 'peticoes-documentos')
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 📊 Passo 5: Criar Usuários de Teste

Execute no **SQL Editor** para criar perfis de teste:

```sql
-- IMPORTANTE: Antes de executar, você precisa criar os usuários na aba Authentication
-- Depois, pegue os UUIDs e substitua abaixo

-- Exemplo de inserção de perfil
INSERT INTO profiles (id, email, nome_completo, cpf, telefone, cargo, persona, ativo)
VALUES 
  -- Substitua 'UUID_DO_AUTH_USER' pelo UUID real do usuário criado
  ('UUID_DO_AUTH_USER', 'ana.admin@empresa.com', 'Ana Admin', '123.456.789-00', '(11) 98765-4321', 'Administradora', 'Ana Admin', true);

-- Atribuir role de administrador
INSERT INTO user_roles (user_id, role_id)
VALUES (
  'UUID_DO_AUTH_USER',
  (SELECT id FROM roles WHERE nome = 'Administrador')
);
```

### Como criar usuários manualmente:

1. Vá em **Authentication** > **Users**
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - Email: `ana.admin@empresa.com`
   - Password: (senha temporária)
   - **Auto Confirm User**: `true`
4. Clique em **"Create user"**
5. Copie o **UUID** do usuário criado
6. Execute o SQL acima substituindo o UUID

**Repita para:**
- `diego.perito@empresa.com` (Persona: Diego Perito, Role: Perito)
- `maria.advogada@empresa.com` (Persona: Maria Advogada, Role: Advogado)

---

## 🧪 Passo 6: Inserir Dados de Teste

Execute no **SQL Editor**:

```sql
-- Inserir contatos de teste
INSERT INTO contatos (tipo, nome_completo, cpf_cnpj, email, telefone_principal, responsavel_id, criado_por)
VALUES 
  ('Pessoa Física', 'João Silva Santos', '123.456.789-00', 'joao@email.com', '(11) 98765-4321', 
   (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com'),
   (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com')),
  ('Pessoa Física', 'Maria Oliveira Costa', '987.654.321-00', 'maria@email.com', '(11) 91234-5678',
   (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com'),
   (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com'));

-- Inserir projeto de teste
INSERT INTO projetos (numero_processo, titulo, descricao, tipo_projeto, status, prioridade, responsavel_id, criado_por)
VALUES (
  '0001234-56.2025.8.26.0100',
  'Revisional Financiamento - João Silva',
  'Ação revisional de contrato de financiamento imobiliário com suspeita de juros abusivos',
  'Revisional',
  'Em Andamento',
  'Alta',
  (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com'),
  (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com')
);

-- Inserir tarefas de teste
INSERT INTO tarefas (
  titulo, 
  descricao, 
  tipo, 
  status, 
  prioridade, 
  responsavel_id, 
  projeto_id,
  data_vencimento,
  criado_por
)
VALUES 
  (
    'Analisar contrato de financiamento',
    'Realizar análise completa do contrato fornecido pelo cliente para identificar cláusulas abusivas',
    'Tarefa',
    'Em Andamento',
    'Alta',
    (SELECT id FROM profiles WHERE email = 'diego.perito@empresa.com'),
    (SELECT id FROM projetos WHERE numero_processo = '0001234-56.2025.8.26.0100'),
    NOW() + INTERVAL '3 days',
    (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com')
  ),
  (
    'Agendar reunião com cliente',
    'Marcar reunião para apresentar análise preliminar e discutir próximos passos',
    'Reunião',
    'Pendente',
    'Média',
    (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com'),
    (SELECT id FROM projetos WHERE numero_processo = '0001234-56.2025.8.26.0100'),
    NOW() + INTERVAL '5 days',
    (SELECT id FROM profiles WHERE email = 'ana.admin@empresa.com')
  );

-- Inserir comentário de teste
INSERT INTO comentarios (tipo, conteudo, tarefa_id, autor_id)
VALUES (
  'comentario',
  'Cliente forneceu documentação completa. Iniciando análise detalhada dos juros cobrados.',
  (SELECT id FROM tarefas WHERE titulo LIKE 'Analisar contrato%' LIMIT 1),
  (SELECT id FROM profiles WHERE email = 'diego.perito@empresa.com')
);
```

---

## 🔔 Passo 7: Configurar Realtime (Opcional mas Recomendado)

Para notificações em tempo real:

1. Vá em **Database** > **Replication**
2. Clique em **"Add Table"**
3. Selecione as tabelas:
   - ✅ `tarefas`
   - ✅ `comentarios`
   - ✅ `notificacoes`
   - ✅ `oportunidades`
4. Habilite **Row Level Security**
5. Salve

### Configurar no Frontend:

```typescript
// Exemplo de subscription para notificações
const channel = supabase
  .channel('notificacoes-realtime')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notificacoes',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Mostrar toast de notificação
      toast.info(payload.new.titulo);
    }
  )
  .subscribe();
```

---

## ⏰ Passo 8: Configurar Cron Jobs (Edge Functions)

Para tarefas agendadas como lembretes:

### 8.1 Criar Edge Function para Lembretes

1. No terminal local:

```bash
npx supabase functions new notificar-prazos
```

2. Edite o arquivo gerado:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Chamar a função SQL que criamos
    await supabase.rpc('notificar_prazos_proximos');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

3. Deploy da função:

```bash
npx supabase functions deploy notificar-prazos
```

### 8.2 Agendar Execução

1. Use um serviço como **Cron-job.org** ou **EasyCron**
2. Configure para chamar a URL da Edge Function a cada hora:

```
URL: https://SEU_PROJETO.supabase.co/functions/v1/notificar-prazos
Método: POST
Headers: Authorization: Bearer SEU_ANON_KEY
Frequência: A cada 1 hora
```

---

## 🔍 Passo 9: Testar Conexão

### 9.1 Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (chave pública)
   - **service_role**: `eyJhbGc...` (chave privada - NÃO EXPONHA!)

### 9.2 Configurar no Frontend

Crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 9.3 Criar Cliente Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 9.4 Teste de Conexão

```typescript
// Teste simples
const { data, error } = await supabase
  .from('tarefas')
  .select('*')
  .limit(10);

if (error) {
  console.error('Erro:', error);
} else {
  console.log('Conexão OK! Tarefas:', data);
}
```

---

## 📈 Passo 10: Monitoramento e Manutenção

### 10.1 Configurar Backups Automáticos

1. Vá em **Settings** > **Database** > **Backups**
2. Plano **Free**: Backups diários (7 dias de retenção)
3. Plano **Pro**: Backups a cada 6h (30 dias de retenção)

### 10.2 Monitorar Performance

1. Vá em **Database** > **Query Performance**
2. Identifique queries lentas
3. Adicione índices conforme necessário

### 10.3 Revisar Logs

1. **Logs** > **Postgres Logs**: Erros do banco
2. **Logs** > **API Logs**: Requisições à API
3. **Logs** > **Auth Logs**: Tentativas de login

---

## 🛡️ Boas Práticas de Segurança

### ✅ DO's (Faça)

- ✅ Use Row Level Security (RLS) em TODAS as tabelas
- ✅ Valide dados no backend (constraints, triggers)
- ✅ Use prepared statements (Supabase faz isso automaticamente)
- ✅ Implemente rate limiting para APIs públicas
- ✅ Faça backups regulares
- ✅ Monitore logs de autenticação
- ✅ Use HTTPS sempre (Supabase força isso)
- ✅ Rotacione chaves periodicamente

### ❌ DON'Ts (Não Faça)

- ❌ NUNCA exponha a `service_role` key no frontend
- ❌ Não desabilite RLS em produção
- ❌ Não armazene senhas em texto plano
- ❌ Não confie apenas em validação frontend
- ❌ Não ignore erros de CORS
- ❌ Não faça queries sem índices em produção
- ❌ Não armazene dados sensíveis sem criptografia

---

## 🚀 Otimizações Avançadas

### Índices Compostos

Para queries frequentes, adicione índices compostos:

```sql
-- Tarefas do usuário filtradas por status e ordenadas por vencimento
CREATE INDEX idx_tarefas_user_status_vencimento 
ON tarefas(responsavel_id, status, data_vencimento DESC)
WHERE ativo = true;

-- Notificações não lidas por usuário
CREATE INDEX idx_notificacoes_user_nao_lidas_recentes
ON notificacoes(user_id, data_criacao DESC)
WHERE lida = false;
```

### Particionamento (Plano Pro+)

Para tabelas muito grandes (milhões de registros):

```sql
-- Particionar log_atividades por mês
CREATE TABLE log_atividades_2025_01 PARTITION OF log_atividades
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### Materialized Views

Para dashboards complexos:

```sql
CREATE MATERIALIZED VIEW mv_dashboard_metricas AS
SELECT 
  responsavel_id,
  COUNT(*) FILTER (WHERE status = 'Pendente') as pendentes,
  COUNT(*) FILTER (WHERE status = 'Em Andamento') as em_andamento,
  COUNT(*) FILTER (WHERE status = 'Concluída') as concluidas
FROM tarefas
WHERE ativo = true
GROUP BY responsavel_id;

-- Atualizar a cada hora via cron job
REFRESH MATERIALIZED VIEW mv_dashboard_metricas;
```

---

## 📞 Suporte e Recursos

### Documentação Oficial

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Comunidade

- [Discord Supabase](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Planos e Preços

- **Free**: 500 MB storage, 2 GB bandwidth, 50 MB file uploads
- **Pro** ($25/mês): 8 GB storage, 50 GB bandwidth, 5 GB file uploads
- **Team** ($599/mês): Custom resources
- **Enterprise**: Contato com vendas

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Schema executado com sucesso
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas RLS testadas
- [ ] Usuários de teste criados
- [ ] Dados de exemplo inseridos
- [ ] Storage buckets criados e configurados
- [ ] Autenticação testada
- [ ] Realtime funcionando
- [ ] Edge Functions deployadas (se aplicável)
- [ ] Cron jobs agendados
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Testes de performance realizados
- [ ] Testes de segurança passaram

---

## 🎉 Conclusão

Parabéns! Sua estrutura de banco de dados está pronta para o sistema de gestão jurídica.

**Próximos passos:**
1. Integrar com o frontend React
2. Implementar autenticação com Supabase Auth
3. Criar hooks personalizados para queries
4. Adicionar validações no frontend
5. Implementar testes automatizados
6. Preparar para deploy em produção

**Bom desenvolvimento! 🚀**
