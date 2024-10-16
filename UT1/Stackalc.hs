import Data.Char (isDigit)

isValidChar :: Char -> Bool
isValidChar c = isDigit c || isOperation c

isOperation :: Char -> Bool
isOperation c = c `elem` "+-*/~^p"


operator :: Char -> [Double] -> [Double]
operator c _
    | not (isValidChar c) = error "Caracter no permitido"

operator op []
    | isOperation op && op `notElem` "p" = error ("Error al operar con " ++ show op ++ ", stack vacío")
operator op [primero]
    | isOperation op && op `notElem` "~" = error ("Error al operar con " ++ show op ++ ", hay solo un elemento en el stack")

operator c stack
    | isDigit c = (read [c] :: Double):stack

operator op (primero:segundo:resto)
    | op == '+' = (primero + segundo):resto
    | op == '-' = (primero - segundo):resto
    | op == '*' = (primero * segundo):resto
    | op == '/' = (segundo / primero):resto
    | op == '^' = (segundo ** primero):resto

operator op (primero:resto)
    | op == '~' = (-primero):resto

operator 'p' lista = pi:lista


evaluate :: String -> [Double]
evaluate = foldl (flip operator) []

main = do
    print (evaluate "2~")
    print (evaluate "23^")
    print (evaluate "212/^")
    print (evaluate "p")
    print (evaluate "")
    print (evaluate "123")
    print (evaluate "123*+")
    print (evaluate "21/0-")
    print (evaluate "12+3+4")
    print (evaluate "1+")
    print (evaluate "23!")
