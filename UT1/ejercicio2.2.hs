isSorted :: (Ord a) => [a] -> Bool
isSorted [] = True
isSorted lista = and [x <= y | (x, y) <- pares]
    where
        pares = zip lista (tail lista)