module Semantics.Compiler where

import Semantics.Interpreter
import Syntax.CodeRepr
import Data.List ( nub, elemIndex, intercalate )

data CodeGenContext = CodeGenContext {
    locals :: [String],
    tagCounter :: Integer
  } deriving (Show)


ilLocals :: Stmt -> [String]
ilLocals (Assign x _) = [x]

ilLocals (Seq stmts) = nub (concat (map ilLocals stmts))

ilLocals (IfThenElse b s1 s2) = nub (concat (map ilLocals [s1, s2]))

ilLocals (WhileDo b s) = ilLocals s


ilMaxStackAExp :: AExp -> Int
ilMaxStackAExp (Num _) = 1

ilMaxStackAExp (Var _) = 1

ilMaxStackAExp (Add a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackAExp (Mult a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackAExp (Sub a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackAExp (Div a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)


ilMaxStackBExp :: BExp -> Int
ilMaxStackBExp (BoolLit _) = 1

ilMaxStackBExp (CompEq a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackBExp (CompLtEq a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackBExp (CompGtEq a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackBExp (CompLt a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackBExp (CompGt a1 a2) =
  max (ilMaxStackAExp a1) (1 + ilMaxStackAExp a2)

ilMaxStackBExp (Neg b1) = ilMaxStackBExp b1

ilMaxStackBExp (And b1 b2) =
  max (ilMaxStackBExp b1) (1 + ilMaxStackBExp b2)

ilMaxStackBExp (Or b1 b2) =
  max (ilMaxStackBExp b1) (1 + ilMaxStackBExp b2)



ilMaxStackStmt :: Stmt -> Int
ilMaxStackStmt (Assign x a) = ilMaxStackAExp a

ilMaxStackStmt (Seq []) = 0

ilMaxStackStmt (Seq stmts) =
  maximum (map ilMaxStackStmt stmts)

ilMaxStackStmt (IfThenElse b s1 s2) =
  maximum [ilMaxStackBExp b, ilMaxStackStmt s1, ilMaxStackStmt s2]

ilMaxStackStmt (WhileDo b s) =
  maximum [ilMaxStackBExp b, ilMaxStackStmt s]



ilCompileAExp :: AExp -> CodeGenContext -> [String]
ilCompileAExp (Num n) _ = ["ldc.i4 " ++ (show n)]

ilCompileAExp (Var x) ctx = ["ldloc.s " ++ (show i)]
  where (Just i) = elemIndex x (locals ctx)

ilCompileAExp (Add a1 a2) ctx =
  concat [
    ilCompileAExp a1 ctx,
    ilCompileAExp a2 ctx,
    ["add"]
    ]

ilCompileAExp (Sub a1 a2) ctx =
  concat [
    ilCompileAExp a1 ctx,
    ilCompileAExp a2 ctx,
    ["sub"]
    ]

ilCompileAExp (Mult a1 a2) ctx =
  concat [
    ilCompileAExp a1 ctx,
    ilCompileAExp a2 ctx,
    ["mul"]
    ]
    
ilCompileAExp (Div a1 a2) ctx =
  concat [
    ilCompileAExp a1 ctx,
    ilCompileAExp a2 ctx,
    ["div"]
    ]

  ilCompileAExp ()

ilCompileBExp :: BExp -> CodeGenContext -> [String]
ilCompileBExp (BoolLit True) _ = ["ldc.i4.1"]

ilCompileBExp (BoolLit False) _ = ["ldc.i4.0"]

ilCompileBExp (CompEq aExp1 aExp2) ctx = concat [
    ilCompileAExp aExp1 ctx,
    ilCompileAExp aExp2 ctx,
    ["ceq"]
    ]

ilCompileBExp (CompLtEq aExp1 aExp2) ctx = concat [
    ilCompileAExp aExp1 ctx,
    ilCompileAExp aExp2 ctx,
    ["cgt"],
    ilCompileBExp (BoolLit False) ctx,
    ["ceq"]
    ]

ilCompileBExp (CompGtEq aExp1 aExp2) ctx = concat [
    ilCompileAExp aExp1 ctx,
    ilCompileAExp aExp2 ctx,
    ["clt"],
    ilCompileBExp (BoolLit False) ctx,
    ["ceq"]
    ]

ilCompileBExp (CompLt aExp1 aExp2) ctx = concat [
    ilCompileAExp aExp1 ctx,
    ilCompileAExp aExp2 ctx,
    ["clt"]
    ]

ilCompileBExp (CompGt aExp1 aExp2) ctx = concat [
    ilCompileAExp aExp1 ctx,
    ilCompileAExp aExp2 ctx,
    ["cgt"]
    ]

ilCompileBExp (Neg bExp) ctx = concat [
    ilCompileBExp bExp ctx,
    ilCompileBExp (BoolLit True) ctx,
    ["xor"]
    ]

ilCompileBExp (And bExp1 bExp2) ctx = concat [
    ilCompileBExp bExp1 ctx,
    ilCompileBExp bExp2 ctx,
    ["and"]
    ]

ilCompileBExp (Or bExp1 bExp2) ctx = concat [
    ilCompileBExp bExp1 ctx,
    ilCompileBExp bExp2 ctx,
    ["or"]
    ]


ilCompileStmt :: Stmt -> CodeGenContext -> ([String], CodeGenContext)
ilCompileStmt (Assign varName aExp) ctx = (concat [
    ilCompileAExp aExp ctx,
    ["stloc.s " ++ show i]
    ],
    ctx)
    where
        (Just i) = elemIndex varName (locals ctx)

ilCompileStmt (Seq []) ctx = (["nop"], ctx)

ilCompileStmt (Seq (next:rest)) ctx = (nextOutput ++ restOutput, finalCtx)
  where
    (nextOutput, updatedCtx) = ilCompileStmt next ctx
    (restOutput, finalCtx) = ilCompileStmt (Seq rest) updatedCtx

ilCompileStmt (IfThenElse bExp thenStmt elseStmt) ctx = (concat [
    ilCompileBExp bExp ctx,
    ["brfalse " ++ elseTag],
    thenOutput,
    ["br " ++ endIfTag],
    [elseTag ++ ":"],
    elseOutput,
    [endIfTag ++ ":", "nop"]
    ],
    finalCtx)
    where
        elseTag = "Else" ++ show (tagCounter ctx)
        endIfTag = "EndIf" ++ show (tagCounter ctx)
        updatedCtx = CodeGenContext { locals = locals ctx, tagCounter = tagCounter ctx + 1 }
        (thenOutput, afterThenCtx) = ilCompileStmt thenStmt updatedCtx
        (elseOutput, finalCtx) = ilCompileStmt elseStmt afterThenCtx

ilCompileStmt (WhileDo bExp loopStmt) ctx = (concat [
    [whileTag ++ ":"],
    ilCompileBExp bExp ctx,
    ["brfalse " ++ endWhileTag],
    loopOutput,
    ["br " ++ whileTag],
    [endWhileTag ++ ":", "nop"]
    ],
    finalCtx)
    where
        whileTag = "While" ++ show (tagCounter ctx)
        endWhileTag = "EndWhile" ++ show (tagCounter ctx)
        updatedCtx = CodeGenContext { locals = locals ctx, tagCounter = tagCounter ctx + 1 }
        (loopOutput, finalCtx) = ilCompileStmt loopStmt updatedCtx
        

ilCompileCode :: Stmt -> String -> [String]
ilCompileCode ast moduleName = concat [
  ilCompileMetadata moduleName, 
  ilMainMethod, 
  ilCompileMaxstack ast,
  ilCompileLocalsDeclarations newCtx,
  ilCode, 
  ilCompileConsoleWriteVars finalCtx, 
  ilCompileReturn]
  where
    newCtx = CodeGenContext { locals = ilLocals ast, tagCounter = 1 }
    (ilCode, finalCtx) = ilCompileStmt ast newCtx


ilMainMethod :: [String]
ilMainMethod = [
  ".method private hidebysig static void Main(string[] args) cil managed",
  "{",
  ".entrypoint"]


ilCompileMaxstack :: Stmt -> [String]
ilCompileMaxstack ast = [".maxstack " ++ show (ilMaxStackStmt ast)]


ilCompileLocalsDeclarations :: CodeGenContext -> [String]
ilCompileLocalsDeclarations ctx = 
  [".locals init (" ++ intercalate ", " ["int32 V_" ++ show i | (i, _) <- zip [0..] (locals ctx)] ++ ")"]


ilCompileMetadata :: String -> [String]
ilCompileMetadata moduleName = 
  ilCompileAssemblyMetadata moduleName "" "1:0:0:0" False ++
  ilCompileAssemblyMetadata "System.Console" "(B0 3F 5F 7F 11 D5 0A 3A )" "4:0:0:0" True ++ [
  ".module " ++ moduleName ++ ".exe",
  ".imagebase 0x00400000",
  ".file alignment 0x00000200",
  ".stackreserve 0x00100000",
  ".subsystem 0x0003       // WINDOWS_CUI",
  ".corflags 0x00000001    //  ILONLY"]

  
ilCompileAssemblyMetadata :: String -> String -> String -> Bool -> [String]
ilCompileAssemblyMetadata name token ver extern
  | null token = [
    ".assembly " ++ (if extern then "extern " else "") ++ name,
    "{",
    ".ver " ++ ver,
    "}"
  ]
  | otherwise = [
    ".assembly " ++ (if extern then "extern" else "") ++ " " ++ name,
    "{",
    ".publickeytoken = " ++ token,
    ".ver " ++ ver,
    "}"
  ]


ilCompileConsoleWriteVars :: CodeGenContext -> [String]
ilCompileConsoleWriteVars ctx = concatMap (\varName -> [
  "ldstr      \"" ++ varName ++ " = \"",
  "call       void [System.Console]System.Console::Write(string)"
  ] ++ ilCompileAExp (Var varName) ctx ++ [
  "call       void [System.Console]System.Console::WriteLine(int32)"
  ]) (locals ctx)


ilCompileReturn :: [String]
ilCompileReturn = ["ret", "}"]