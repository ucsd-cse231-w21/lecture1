import { TreeCursor } from 'lezer';
import {parser} from 'lezer-python';
import {Stmt, Expr} from './ast';

export function parseProgram(source : string) : Array<Stmt> {
  const t = parser.parse(source).cursor();
  return traverseStmts(source, t);
}

export function traverseStmts(s : string, t : TreeCursor) {
  t.firstChild();
  const stmts = [];
  do {
    stmts.push(traverseStmt(s, t));
  } while(t.nextSibling());
  return stmts;
}

export function traverseStmt(s : string, t : TreeCursor) : Stmt {
  switch(t.type.name) {
    case "AssignStatement":
      t.firstChild(); // focused on name
      let name = s.substring(t.from, t.to);
      t.nextSibling(); // focused on = sign. May need this for complex tasks, like +=!
      t.nextSibling(); // focused on the value expression

      let value = traverseExpr(s, t);
      t.parent();
      return { tag: "assign", name, value };
    case "ExpressionStatement":
      t.firstChild();
      let expr = traverseExpr(s, t);
      t.parent();
      return { tag: "expr", expr: expr };
  }
}

export function traverseExpr(s : string, t : TreeCursor) : Expr {
  switch(t.type.name) {
    case "Number":
      return { tag: "number", value: Number(s.substring(t.from, t.to)) };
    case "VariableName":
      return { tag: "id", name: s.substring(t.from, t.to) };
  }
}