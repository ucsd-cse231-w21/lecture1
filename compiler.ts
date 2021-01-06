import wabt from 'wabt';

export async function run(watSource : string) : Promise<number> {
  const wabtApi = await wabt();

  // Next three lines are wat2wasm
  const parsed = wabtApi.parseWat("example", watSource);
  const binary = parsed.toBinary({});
  const wasmModule = await WebAssembly.instantiate(binary.buffer, {});

  // This next line is wasm-interp
  return (wasmModule.instance.exports as any)._start();
}

export function compile(source : string) : string {
  return `
    (module
      (func (export "_start") (result i32)
        (i32.const ${source})
      )
    ) 
  `;
}
