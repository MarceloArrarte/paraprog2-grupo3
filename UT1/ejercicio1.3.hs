setElemAt :: [a] -> a -> Int -> [a]
setElemAt list elem pos
    | pos > length list = error "'pos' debe ser menor que 'length list'"
    | pos < 0           = error "'pos' debe ser positivo"
    | otherwise         = take pos list ++ elem : drop (pos + 1) list


setElemAtRecursive :: [a] -> a -> Int -> [a]
setElemAtRecursive list elem pos
    | pos > length list = error "'pos' debe ser menor que 'length list'"
    | pos < 0           = error "'pos' debe ser positivo"
    | pos == length list = list ++ [elem]
    | pos == 0          = elem:tail list
    | otherwise         = setElemAtRecursive (tail list) elem (pos - 1)

main = do
    printAll [
        "setElemAt " ++ show list ++ " " ++ show elem ++ " " ++ show pos
        ++ " = " ++ show (setElemAtRecursive list elem pos)
        | (list, elem, pos) <- [
                ([1, 2, 3], 77, 1),
                ([0, 1, 2, 3], 1, -1)
            ]
        ]

    printAll [
        "setElemAt " ++ show list ++ " " ++ show elem ++ " " ++ show pos
        ++ " = " ++ show (setElemAtRecursive list elem pos)
        | (list, elem, pos) <- [
                ("abcdef", 'x', 0),
                ("abcdef", 'x', 2),
                ("abcdef", 'x', 5)
            ]
        ]

    printAll [
        "setElemAt " ++ show list ++ " " ++ show elem ++ " " ++ show pos
        ++ " = " ++ show (setElemAtRecursive list elem pos)
        | (list, elem, pos) <- [
                ([], True, 0),
                ([], True, 1),
                ([False, True], False, 3)
            ]
        ]


printAll :: [String] -> IO()
printAll strs = putStr (unlines strs)