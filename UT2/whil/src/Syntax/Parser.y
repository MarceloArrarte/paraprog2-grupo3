{
module Syntax.Parser where

import Syntax.CodeRepr
import Syntax.Lexer
}

%name parse
%tokentype { Token }
%error { parseError }

%token
  'if'       { TokenIf }
  'else'     { TokenElse }
  'while'    { TokenWhile }
  '!'        { TokenNot }
  '('        { TokenOParen }
  ')'        { TokenCParen }
  '*'        { TokenMult }
  '+'        { TokenAdd }
  '-'        { TokenSub }
  '/'        { TokenDiv }
  '=='       { TokenEq }
  '<='       { TokenLtEq }
  '>='       { TokenGtEq }
  '<'       { TokenLt }
  '>'       { TokenGt }
  '||'       { TokenOr }
  '&&'       { TokenAnd }
  '='        { TokenAssign }
  ';'        { TokenSemi }
  '{'        { TokenOBrace }
  '}'        { TokenCBrace }
  bool       { TokenBool $$ }
  num        { TokenNum $$ }
  id         { TokenId $$ }

%left '||'
%left '&&'
%nonassoc '==' '<=' '>=' '>' '<'
left '+' '-'
left '*' '/'
left '!'

%%

Stmt :: {Stmt}
  : id '=' AExp ';'                    { Assign $1 $3 }
  | '{' Stmts '}'                      { Seq $2 }
  | '{' '}'                            { skip }
  | 'if' '(' BExp ')' Stmt 'else' Stmt { IfThenElse $3 $5 $7 }
  | 'if' '(' BExp ')' Stmt             { IfThenElse $3 $5 skip }
  | 'while' '(' BExp ')' Stmt          { WhileDo $3 $5 }

Stmts :: {[Stmt]}
  : Stmt       { [$1] }
  | Stmts Stmt { $1 ++ [$2] }

BExp :: {BExp}
  : bool           { BoolLit $1 }
  | '(' BExp ')'   { $2 }
  | AExp '==' AExp { CompEq $1 $3 }
  | AExp '<=' AExp { CompLtEq $1 $3 }
  | AExp '>=' AExp { CompGtEq $1 $3 }
  | AExp '<' AExp { CompLt $1 $3 }
  | AExp '>' AExp { CompGt $1 $3 }
  | '!' BExp       { Neg $2 }
  | BExp '||' BExp { Or $1 $3 }
  | BExp '&&' BExp { And $1 $3 }

AExp :: {AExp}
  : num            { Num $1 }
  | id             { Var $1 }
  | '(' AExp ')'   { $2 }
  | AExp '+' AExp  { Add $1 $3 }
  | AExp '-' AExp  { Sub $1 $3 }
  | AExp '*' AExp  { Mult $1 $3 }
  | AExp '/' AExp  { Div $1 $3 }

{
parseError :: [Token] -> a
parseError _ = error "Parse error"  
}