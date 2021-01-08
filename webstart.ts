import {compile, run} from './compiler';

document.addEventListener("DOMContentLoaded", async () => {
  const runButton = document.getElementById("run");
  const userCode = document.getElementById("user-code") as HTMLTextAreaElement;
  runButton.addEventListener("click", async () => {
    const program = userCode.value;
    const wat = compile(program);
    const code = document.getElementById("generated-code");
    code.textContent = wat;
    const output = document.getElementById("output");
    try {
      const result = await run(wat);
      output.textContent = String(result);
      output.setAttribute("style", "color: black");
    }
    catch(e) {
      output.textContent = String(e);
      output.setAttribute("style", "color: red");
    }
  });
});