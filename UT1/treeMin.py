import sys

def treeMinIterativo(listaValores):
    pila = listaValores.copy()
    minimo = sys.maxsize

    while len(pila) > 0:
        n = pila.pop()
        if isinstance(n, list):
                minimo = min(n)
        else:
                minimo = min([minimo, n])

    return minimo


def treeMinRecursivo(listaValores):
      
      if not isinstance(listaValores, list):
        return listaValores
      if len(listaValores) == 0:
        return sys.maxsize
      if len(listaValores) > 1:
        return min(treeMinRecursivo(listaValores[0]), treeMinIterativo(listaValores[1:]))
      return treeMinRecursivo(listaValores[0])

print("Version iterativa:")
print(treeMinIterativo([2, 7, 5]))
print(treeMinIterativo([7, 5, 1000]))
print(treeMinIterativo([2, -10, 5]))
print(treeMinIterativo([2,7,[5,3,1]]))

print("Version recursiva:")
print(treeMinRecursivo([2, 7, 5]))
print(treeMinRecursivo([7, 5, 1000]))
print(treeMinRecursivo([2, -10, 5]))
print(treeMinRecursivo([2,7,[5,3,1]]))
print(treeMinRecursivo([[]]))
