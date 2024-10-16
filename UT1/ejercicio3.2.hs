data BinTree a = TreeNode a (BinTree a) (BinTree a)
    | EmptyTree
    deriving (Eq, Show)


preorder :: BinTree a -> [a]
preorder EmptyTree = []
preorder (TreeNode val leftTree rightTree) = val:preorder leftTree ++ preorder rightTree

inorder :: BinTree a -> [a]
inorder EmptyTree = []
inorder (TreeNode val leftTree rightTree) = inorder leftTree ++ val:inorder rightTree

postorder :: BinTree a -> [a]
postorder EmptyTree = []
postorder (TreeNode val leftTree rightTree) = postorder leftTree ++ postorder rightTree ++ [val]

leaf :: a -> BinTree a
leaf val = TreeNode val EmptyTree EmptyTree

tree1 = TreeNode 7 (leaf 3) (leaf 9)