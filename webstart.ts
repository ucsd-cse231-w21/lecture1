import {compile, run} from './compiler';

document.addEventListener("DOMContentLoaded", async () => {
  const runButton = document.getElementById("run");
  const userCode = document.getElementById("user-code") as HTMLTextAreaElement;
  runButton.addEventListener("click", async () => {
    const program = userCode.value;
    const wat = compile(program);
    const result = await run(wat);
    const output = document.getElementById("output");
    output.textContent = String(result);
  });
});