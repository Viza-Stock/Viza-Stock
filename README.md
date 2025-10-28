# 🚀 Control System (Backend API)

Este é o repositório do **Backend (API)** do projeto Control System, um sistema completo de controle de estoque e produção de produtos, construído com Spring Boot.

A aplicação gerencia o ciclo de vida completo de produtos, desde o cadastro de matérias-primas até a execução de ordens de produção complexas, com validação de estoque em tempo real.

---

### 🎨 Frontend (Interface do Usuário)

A interface de usuário (UI) para este projeto foi desenvolvida em React, utilizando uma arquitetura moderna de "guias" (rotas) e componentes. A UI consome esta API para fornecer uma experiência de usuário completa.

**➡️ [Acesse o Repositório do Frontend aqui](https://github.com/jovvaz/control-system-frontend)**


---

## 🌟 Funcionalidades Principais (Atualizações)

Este projeto implementa um conjunto robusto de funcionalidades de nível empresarial:

* **Gestão de Produtos:**
    * Cadastro de **Matérias-Primas** e **Produtos Acabados**.
    * Uso de **IDs customizados** (ex: "MP-001", "PA-001") com validação de unicidade no banco de dados.
    * Unidades de medida controladas (kg, L, un) para garantir a integridade dos dados.

* **Ficha Técnica (Receitas):**
    * Criação de fichas técnicas complexas no momento do cadastro do Produto Acabado.
    * Associação de múltiplas matérias-primas e suas respectivas quantidades a um único produto (relação `@OneToMany`).

* **Controle de Estoque:**
    * Registro de **Entrada de Estoque** (Compra) para matérias-primas e produtos.
    * Baixa automática de estoque de componentes durante a produção.

* **Lógica de Produção (A funcionalidade principal):**
    * Um endpoint (`/api/producao/executar`) que simula uma ordem de produção.
    * **Verificação de Viabilidade:** O sistema verifica se há estoque suficiente de *todas* as matérias-primas necessárias antes de autorizar a produção.
    * **Mensagens de Erro Claras:** Retorna erros específicos (ex: "Estoque insuficiente para Açúcar. Necessário: 10, Disponível: 5") que são exibidos na UI.
    * **Transação Atômica:** Se a produção for viável, o sistema automaticamente dá baixa (`darBaixa`) no estoque das matérias-primas e adiciona (`darEntrada`) o produto acabado ao estoque.

* **CRUD Seguro (Delete):**
    * Funcionalidade de **Deletar** produtos (`DELETE /api/produtos/{id}`).
    * **Regra de Negócio Crítica:** O sistema impede que uma Matéria-Prima seja deletada se ela estiver em uso em qualquer Ficha Técnica, protegendo a integridade dos dados do sistema.

---

## 🛠️ Tecnologias (Backend)

* **Java 17**
* **Spring Boot 3+**
* **Spring Data JPA (Hibernate):** Para persistência de dados e mapeamento objeto-relacional.
* **Banco H2 (Em memória):** Utilizado para um ambiente de desenvolvimento rápido e testes.
* **Maven:** Para gerenciamento de dependências.

---

## 🚀 Como Executar (Localmente)

**Requisitos:**
* JDK 17 ou superior
* Maven 3+
* IntelliJ IDEA (Recomendado)

**Backend (Este Repositório):**
1.  Clone este repositório: `git clone https://github.com/jovvaz/Control-System.git`
2.  Abra o projeto no IntelliJ IDEA.
3.  Aguarde o Maven baixar todas as dependências.
4.  Execute a classe principal `ControlSystemApplication.java`.
5.  O servidor estará rodando em `http://localhost:8080`.

**Frontend (Repositório Separado):**
1.  Siga as instruções de setup no [repositório do frontend](https://github.com/jovvaz/control-system-frontend).
2.  Inicie o frontend (geralmente com `npm run dev`).
3.  Acesse `http://localhost:5173` (ou a porta indicada) no seu navegador para usar a aplicação.

---

## 🔌 API Endpoints (Principais)

A URL base é `http://localhost:8080`

| Verbo | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/produtos` | Lista todos os produtos (MPs e PAs). |
| `POST`| `/api/produtos` | Cria uma nova Matéria-Prima (simples). |
| `DELETE`| `/api/produtos/{id}` | Deleta um produto (com validação de segurança). |
| `POST` | `/api/produtos/entrada` | Registra uma entrada de estoque (compra). |
| `POST` | `/api/producao/produto-acabado` | Cria um Produto Acabado E sua Ficha Técnica (receita). |
| `POST` | `/api/producao/executar` | **Executa uma ordem de produção** (valida estoque, dá baixas e entradas). |
