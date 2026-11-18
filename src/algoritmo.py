"""Tema C - Heap binário (Min-Heap / Max-Heap) sobre array, com contadores."""
import math
import random
from typing import List, Optional


class Heap:
    """Heap binário em array. pai=(i-1)//2, esq=2*i+1, dir=2*i+2."""

    def __init__(self, tipo: str = "min") -> None:
        self.tipo = tipo
        self.dados: List[int] = []
        self.comparacoes = 0
        self.trocas = 0

    def _antes(self, a: int, b: int) -> bool:
        """True se 'a' deve ficar acima de 'b' (conta 1 comparação)."""
        self.comparacoes += 1
        return a < b if self.tipo == "min" else a > b

    def _trocar(self, i: int, j: int) -> None:
        self.dados[i], self.dados[j] = self.dados[j], self.dados[i]
        self.trocas += 1

    def peek(self) -> Optional[int]:
        """Retorna a raiz sem remover. O(1)."""
        return self.dados[0] if self.dados else None

    def insert(self, valor: int) -> None:
        """Insere no fim e promove (sift-up). O(log n) no pior caso."""
        self.dados.append(valor)
        i = len(self.dados) - 1
        while i > 0:
            pai = (i - 1) // 2
            if not self._antes(self.dados[i], self.dados[pai]):
                break
            self._trocar(i, pai)
            i = pai

    def extract(self) -> int:
        """Remove a raiz, move o último para o topo e rebaixa (sift-down). O(log n)."""
        if not self.dados:
            raise IndexError("heap vazio")
        topo = self.dados[0]
        ultimo = self.dados.pop()
        if self.dados:
            self.dados[0] = ultimo
            self._sift_down(0)
        return topo

    def _sift_down(self, i: int) -> None:
        n = len(self.dados)
        while True:
            esq, dir_, melhor = 2 * i + 1, 2 * i + 2, i
            if esq < n and self._antes(self.dados[esq], self.dados[melhor]):
                melhor = esq
            if dir_ < n and self._antes(self.dados[dir_], self.dados[melhor]):
                melhor = dir_
            if melhor == i:
                break
            self._trocar(i, melhor)
            i = melhor


if __name__ == "__main__":
    # Cenário 1 - caso comum: valores aleatórios; extrair tudo devolve a ordem crescente.
    random.seed(7)
    h = Heap("min")
    valores = random.sample(range(1, 100), 10)
    for v in valores:
        h.insert(v)
    print("Cenário 1 (caso comum)")
    print("  heap:", h.dados, "| comparações:", h.comparacoes, "| trocas:", h.trocas)
    print("  extraindo:", [h.extract() for _ in range(len(h.dados))])
    print("  total após extrações -> comparações:", h.comparacoes, "trocas:", h.trocas)

    # Cenário 2 - borda: heap vazio e heap com 1 elemento.
    h = Heap("max")
    print("Cenário 2 (borda)")
    print("  peek vazio:", h.peek())
    try:
        h.extract()
    except IndexError as erro:
        print("  extract vazio ->", erro)
    h.insert(5)
    print("  1 elemento: extract =", h.extract(), "| comparações:", h.comparacoes)

    # Cenário 3 - pior caso: cada inserção é o novo mínimo e sobe até a raiz.
    n = 1000
    pior, melhor = Heap("min"), Heap("min")
    for v in range(n, 0, -1):
        pior.insert(v)
    for v in range(1, n + 1):
        melhor.insert(v)
    print("Cenário 3 (pior vs melhor caso, n=1000)")
    print("  decrescente (pior): trocas =", pior.trocas, "| comparações =", pior.comparacoes)
    print("  crescente (melhor): trocas =", melhor.trocas, "| comparações =", melhor.comparacoes)
    print("  referência n*log2(n) =", round(n * math.log2(n)))
