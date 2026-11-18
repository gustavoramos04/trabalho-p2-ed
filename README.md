# Tema C: Heaps e Filas de Prioridade (Min-Heap / Max-Heap)

**Aluno:** Gustavo Gomes Ramos | **RA:** 2840482521008
**Disciplina:** Estrutura de Dados, Fatec Ribeirão Preto (Trabalho P2)

## 🎥 Vídeo explicativo: https://youtu.be/lGJF19-2NyM
## 🌐 Simulador online: https://gustavoramos04.github.io/trabalho-p2-ed/src/demo/index.html

---

## Estrutura do repositório
```
README.md
src/
├── algoritmo.py      # Heap em Python (min/max) com contadores
└── demo/
    ├── index.html    # Simulador visual
    ├── styles.css
    └── app.js
```

## Como executar
- **Python (3.8+):** `python src/algoritmo.py` (a partir da raiz do projeto) ou `python algoritmo.py` dentro de `src/`. Não precisa instalar bibliotecas.
- **Simulador:** abrir `src/demo/index.html` no navegador (funciona sem servidor) ou usar o link online acima.

## Resumo teórico
O heap binário é uma árvore binária **completa** guardada em um array, em que cada pai é menor (min-heap) ou maior (max-heap) que seus filhos. O menor (ou maior) elemento fica sempre na raiz.

Índices no array: `pai = (i-1)//2`, `filho esquerdo = 2i+1`, `filho direito = 2i+2`.

- **insert:** coloca o valor no fim e o promove (*sift-up*) enquanto violar a propriedade em relação ao pai.
- **extract:** remove a raiz, leva o último elemento ao topo e o rebaixa (*sift-down*), trocando sempre com o melhor dos filhos.
- **peek:** lê a raiz sem remover.

**Aplicações reais:** filas de prioridade em escalonadores de SO, algoritmo de Dijkstra, Heap Sort, "top-k" de dados em streaming e simulação de eventos.

## Complexidade (Big-O)
| Operação | Melhor caso | Caso médio | Pior caso | Espaço auxiliar |
| :--- | :---: | :---: | :---: | :---: |
| peek | O(1) | O(1) | O(1) | O(1) |
| insert | O(1) | O(1) | O(log n) | O(1) |
| extract | O(1) | O(log n) | O(log n) | O(1) |

**Justificativa:**
- Um heap com n nós tem altura ⌊log₂ n⌋. Tanto o sift-up quanto o sift-down percorrem no máximo um caminho entre a raiz e uma folha, com custo constante por nível, o que dá O(log n).
- **Pior caso do insert:** o novo valor é o novo extremo (valores decrescentes em min-heap) e sobe até a raiz.
- **Melhor caso do insert:** o valor já fica na posição correta (valores crescentes em min-heap), com 1 comparação e 0 trocas.
- **extract:** o último elemento vem de uma folha, então normalmente desce quase até o fim (log n). O O(1) ocorre só se ele já couber na raiz (ex.: valores iguais).
- O array ocupa O(n), mas o espaço **auxiliar** é O(1), pois as operações são feitas in-place.

## Implementação (`src/algoritmo.py`)
Classe `Heap(tipo)` com `tipo="min"` ou `"max"`. Métodos principais: `insert`, `extract`, `peek`, `_sift_down`. O método `_antes` faz a comparação e a conta, e por isso a mesma lógica serve para min e max. Os atributos `comparacoes` e `trocas` medem o custo real de cada operação. Não é usado `sort()` nem biblioteca pronta de heap.

### Cenários de teste (executados no `main`)
1. **Caso comum:** 10 valores aleatórios (seed fixa). O heap resultante foi `[7, 13, 10, 20, 42, 51, 69, 84, 47, 75]`, com 13 comparações e 6 trocas. Extrair tudo devolve a ordem crescente.
2. **Caso de borda:** heap vazio (`peek` retorna `None` e `extract` lança `IndexError`) e heap com 1 elemento.
3. **Pior caso vs. melhor caso (n = 1000):**
   - decrescente (pior): 7.987 trocas;
   - crescente (melhor): 0 trocas e 999 comparações;
   - referência n·log₂(n) ≈ 9.966, confirmando o crescimento O(log n) por inserção.

## Simulador visual (`src/demo/`)
- Mostra a **árvore** e o **array** ao mesmo tempo, com os nós envolvidos destacados a cada passo.
- **Controles:** Executar (reprodução automática), Próximo passo, Pausar e Reiniciar.
- **Cenários:** Caso médio, Pior caso, inserção de valor customizado, Extrair raiz, Peek e alternância entre Min-Heap e Max-Heap.
- **Painel de métricas:** comparações, trocas, tamanho do heap e passos na fila, além do log textual de cada operação.

## Diário de Engenharia com IA
- **Ferramenta:** Claude (Anthropic), no aplicativo de celular.
- **Prompts de estudo (para aprender o conteúdo):**
  1. *"Explique passo a passo como funciona o sift-up na inserção de um heap."*
  2. *"Explique o sift-down na extração e por que o último elemento vai para a raiz."*
  3. *"Por que o heap é O(log n) e qual é o pior caso do insert?"*
- **Prompts de construção (resumidos):**
  1. *"Dê uma olhada nesse trabalho"*: enviei o enunciado para resumir requisitos, pesos e prazo.
  2. *"Faça esse trabalho para mim"*: pedi o pacote completo; a IA escolheu o Tema C (Heap) e gerou `algoritmo.py`, o simulador e a primeira versão do README.
  3. *"Faça o README para mim"*: pedi o preenchimento da documentação.
- **Limitações e ajustes:**
  - O simulador limita a 15 nós (4 níveis), pois acima disso os nós se sobrepõem no desenho em SVG.
  - O código foi gerado pela IA. Executei o `algoritmo.py` e testei o simulador no navegador antes de gravar o vídeo; os 3 cenários rodaram corretamente.
  - Os arquivos foram publicados no GitHub e o simulador foi disponibilizado pelo GitHub Pages.
