collatz :: Integer -> Int
collatz n
    | n == 1    = 0
    | even n    = 1 + collatz (div n 2)
    | otherwise = 1 + collatz (n * 3 + 1)


-- def collatzIterativo(n):
--     i = 0
--     while (n > 1):
--         i += 1
--         if (n % 2 == 0):
--             n /= 2
--         else:
--             n = 3 * n + 1

--     print("FIN ITERATIVO")
--     return i

-- def collatzRecursivo(n):
--     if (n == 1):
--         print("FIN RECURSIVO")
--         return 0
--     else:
--         if (n % 2 == 0):
--             return 1 + collatzRecursivo(n / 2)
--         else:
--             return 1 + collatzRecursivo(3 * n + 1)

-- n = 7
-- print(f'Iteraciones: {collatzIterativo(n)}')
-- print(f'Iteraciones: {collatzRecursivo(n)}')