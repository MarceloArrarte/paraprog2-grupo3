bests :: (a -> Double) -> [a] -> [a]
bests fn list = [ fst par | par <- pares, snd par == maximo ]
    where
        pares = zip list (map fn list)
        maximo = maximum (map snd pares)


main = do
    print (show (bests abs [-7.0..5.0]))
    print (show (bests fromIntegral [0..10]))
    print (show (bests snd [('a',1.0), ('b',2.2)]))
    print (show (bests pmax [(1.0,1.0), (0.0,3.0)]))
    print (show (bests pmin []))
        where
            pmax (x, y) = max x y
            pmin (x, y) = min x y