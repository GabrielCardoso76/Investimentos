# Dashboard de Investimentos

## 🚀 Sobre o Projeto
Este é um dashboard full-stack para visualização e gerenciamento de uma carteira de investimentos. A aplicação permite que o usuário acompanhe o valor total do seu portfólio, a alocação de ativos e a performance histórica, tudo em uma interface limpa e moderna.

O projeto foi construído com uma stack moderna baseada em TypeScript, utilizando Next.js para o front-end e API, e Prisma com PostgreSQL para a camada de dados.

## 🛠️ Tecnologias Utilizadas
- **Next.js:** Framework React para renderização no servidor e geração de sites estáticos.
- **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
- **Tailwind CSS:** Framework de CSS utility-first para estilização rápida.
- **shadcn/ui:** Coleção de componentes de UI reutilizáveis.
- **Recharts:** Biblioteca de gráficos para visualização de dados.
- **Prisma:** ORM de próxima geração para Node.js e TypeScript.
- **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.

## 📋 Pré-requisitos
O software a seguir precisa estar instalado na sua máquina antes de começar:
- Node.js (v18 ou superior)
- PNPM (Gerenciador de pacotes)
- Git (Sistema de controle de versão)
- Docker (Recomendado, para rodar o PostgreSQL facilmente)

## ⚙️ Configuração do Ambiente Local
Siga este guia passo a passo para ter o projeto rodando localmente.

### 1. Clone o repositório
Substitua `[URL_DO_SEU_REPOSITORIO]` pela URL real do seu repositório Git.
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DO_DIRETORIO]
```

### 2. Instale as dependências
Este comando irá instalar todas as dependências do projeto listadas no `package.json`.
```bash
pnpm install
```

### 3. Configure o Banco de Dados (PostgreSQL com Docker)
A maneira mais fácil de rodar o PostgreSQL é usando Docker.

- **Inicie um container PostgreSQL:** O comando abaixo irá baixar a imagem do PostgreSQL e iniciar um container chamado `my-postgres` na porta `5432`.
  ```bash
  docker run --name my-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres
  ```
  *Você pode alterar o usuário, senha e nome do banco de dados se desejar.*

### 4. Configure as Variáveis de Ambiente
O projeto precisa de um arquivo `.env` para armazenar a URL de conexão com o banco de dados.

- **Crie o arquivo `.env`** na raiz do projeto.
- **Adicione a variável `DATABASE_URL`** com a string de conexão do seu banco de dados. Se você usou o comando Docker acima, a URL será:
  ```env
  # .env
  DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
  ```

### 5. Execute as Migrations do Banco de Dados
Este comando usa o Prisma para criar todas as tabelas no seu banco de dados com base no schema definido em `prisma/schema.prisma`.
```bash
pnpm prisma migrate dev
```
*Quando solicitado, dê um nome para a migration (ex: `init`).*

### 6. Popule o Banco com Dados de Teste (Seed)
Para que a aplicação tenha dados para exibir, execute o script de seed. Ele irá criar um usuário, ativos e transações de exemplo.
```bash
pnpm prisma db seed
```

## ▶️ Rodando a Aplicação
Com tudo configurado, inicie o servidor de desenvolvimento do Next.js.
```bash
pnpm dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.
