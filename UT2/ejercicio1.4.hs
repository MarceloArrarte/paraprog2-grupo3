data AExp = Num Int | Var String
          | Add AExp AExp | Sub AExp AExp
          | Mult AExp AExp
          deriving (Eq, Show)

data BExp = BoolLit Bool
          | CompEq AExp AExp | CompLtEq AExp AExp
          | Neg BExp | And BExp BExp
          deriving (Eq, Show)

data Stmt = Assign String AExp
          | Seq [Stmt]
          | IfThenElse BExp Stmt Stmt
          | WhileDo BExp Stmt
          deriving (Eq, Show)
skip = Seq []


varX = Var "x"
varN = Var "n"
zero = Num 0
one = Num 1

example1 = Seq [
  Assign "x" (Num 77),
  Assign "y" (Mult varX varX)]
  
example2 = Seq [
  Assign "x" (Num (-32)),
  IfThenElse (Neg (CompLtEq zero varX))
    (Assign "x" (Sub zero varX))
    skip]

example3 = Seq [
  Assign "n" (Num 5),
  Assign "f" one,
  WhileDo (CompLtEq one varN) (Seq [
    Assign "f" (Mult (Var "f") varN),
    Assign "n" (Sub varN one)
  ])]


type State = [(String, Int)]

evalAExp :: AExp -> State -> Int
evalAExp (Num n) _ = n
evalAExp (Var x) s = let (Just v) = lookup x s in v
evalAExp (Add a1 a2) s = evalAExp a1 s + evalAExp a2 s
evalAExp (Sub a1 a2) s = evalAExp a1 s - evalAExp a2 s
evalAExp (Mult a1 a2) s = evalAExp a1 s * evalAExp a2 s

updateState :: String -> Int -> State -> State
updateState x v s = (x, v):filter (\(y, _) -> x /= y) s


evalBExp :: BExp -> State -> Bool
evalBExp (BoolLit b) _ = b
evalBExp (CompEq a1 a2) s = evalAExp a1 s == evalAExp a2 s
evalBExp (CompLtEq a1 a2) s = evalAExp a1 s <= evalAExp a2 s
evalBExp (Neg bExp) s = not $ evalBExp bExp s
evalBExp (And bExp1 bExp2) s = evalBExp bExp1 s && evalBExp bExp2 s


evalStmt :: Stmt -> State -> State
evalStmt (Seq []) s = s

evalStmt (Assign varName aExp) s = updateState varName (evalAExp aExp s) s

evalStmt (Seq (next:rest)) s = evalStmt (Seq rest) nextState
    where
        nextState = evalStmt next s

evalStmt (IfThenElse bExp trueStmt falseStmt) s
    | conditionResult = evalStmt trueStmt s
    | not conditionResult = evalStmt falseStmt s
        where
            conditionResult = evalBExp bExp s

evalStmt stmt@(WhileDo bExp loopStmt) s
    | shouldRun = evalStmt stmt nextState
    | otherwise = evalStmt skip s
        where
            shouldRun = evalBExp bExp s
            nextState = evalStmt loopStmt s



testState = [("x", 0), ("n", 1)]

prueba1 = evalStmt example1 testState
prueba2 = evalStmt example2 testState
prueba3 = evalStmt example3 testState