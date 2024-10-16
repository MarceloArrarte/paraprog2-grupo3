oneHot :: Int -> Int -> [Integer]
oneHot len i 
    | len < 0 = error "'len' debe ser mayor que 0"
    | i < 0 || i >= len = replicate len 0
    | otherwise = replicate i 0 ++ 1 : replicate (len - i - 1) 0

oneHotRecursive :: Int -> Int -> [Int]
oneHotRecursive 0 _ = []
oneHotRecursive len i
    | len < 0   = error "'len' debe ser mayor que 0"
    | i == 0    = 1:oneHotRecursive (len - 1) (len + 1)
    | otherwise = 0:oneHotRecursive (len - 1) (i - 1)
    
main = do
    printAll [
        "oneHot " ++ show len ++ " " ++ show i ++ " = "
        ++ show (oneHotRecursive len i)
        | (len, i) <- [(0, 0), (3, 0), (4, 2), (-1, 2), (2, -1), (5, 7)]]

printAll :: [String] -> IO()
printAll strs = putStr (unlines strs)