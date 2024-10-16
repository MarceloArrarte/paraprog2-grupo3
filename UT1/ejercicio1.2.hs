fibonacci :: Integer -> Integer
fibonacci n
    | n == 0    = 0
    | n == 1    = 1
    | n > 1     = fibonacci (n - 1) + fibonacci (n - 2)
    | otherwise = error "n debe ser >= 0"


main = do
    printAll ["fibonacci(" ++ show n ++ ") = " ++ show (fibonacci n) | n <- [0, 1, 2, 3, 5, 7, 10, -1]]


printAll :: [String] -> IO()
printAll strs = putStr (unlines strs) 