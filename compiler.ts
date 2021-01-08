import wabt from 'wabt';
import {Stmt, Expr} from './ast';
import {parseProgram} from './parser';

export async function run(watSource : string) : Promise<number> {
  const wabtApi = await wabt();

  // Next three lines are wat2wasm
  const parsed = wabtApi.parseWat("example", watSource);
  const binary = parsed.toBinary({});
  const wasmModule = await WebAssembly.instantiate(binary.buffer, {});

  // This next line is wasm-interp
  return (wasmModule.instance.exports as any)._start();
}

export function codeGenExpr(expr : Expr) : Array<string> {
  switch(expr.tag) {
    case "id":
      return [`(local.get $${expr.name})`];
    case "number":
      return [`(i32.const ${expr.value})`];
  }
}

export function codeGenStmt(stmt : Stmt) : Array<string> {
  switch(stmt.tag) {
    case "assign":
      const valstmts = codeGenExpr(stmt.value);
      valstmts.push(`(local.set $${stmt.name})`);
      return valstmts;
    case "expr":
      return codeGenExpr(stmt.expr);
  }
}

export function compile(source : string) : string {
  const ast = parseProgram(source);
  const allStmts = ast.map(codeGenStmt).flat();
  const vars : Array<string> = [];
  ast.forEach((stmt) => {
    if(stmt.tag === "assign") {
      vars.push(stmt.name);
    }
  });
  const varDecls : Array<string> = [];
  vars.forEach(v => {
    varDecls.push(`(local $${v} i32)`);
  });
  const ourCode = varDecls.concat(allStmts).join("\n");

  return `
    (module
      (func (export "_start") (result i32)
        ${ourCode}
      )
    ) 
  `;
}
