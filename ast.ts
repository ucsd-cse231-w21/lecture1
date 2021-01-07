
export type Stmt =
    { tag: "assign", name: string, value: Expr }
  | { tag: "expr", expr: Expr }

export type Expr = 
    { tag: "number", value: number }
  | { tag: "id", name: string }
