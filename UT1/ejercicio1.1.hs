inRange :: Integer -> Integer -> Integer -> Bool
inRange min max n = n >= min && n <= max

main = do
    putStrLn ("inRange 5 7 1 " ++ show (inRange 5 7 1))
    putStrLn ("inRange 5 7 6 " ++ show (inRange 5 7 6))
    putStrLn ("inRange 5 7 8 " ++ show (inRange 5 7 8))
    putStrLn ("inRange 5 7 5 " ++ show (inRange 5 7 5))
    putStrLn ("inRange 7 5 6 " ++ show (inRange 7 5 6))
    putStrLn ("inRange (-1) 0 2 " ++ show (inRange (-1) 0 2))
    putStrLn ("inRange (-1) 1 0 " ++ show (inRange (-1) 1 0))