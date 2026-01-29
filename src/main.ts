import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  execute: (input: any) => any;
}

interface ToolGroup {
  name: string;          // Namespace (e.g., "ImageEditor", "PageNavigator")
  description: string;
  tools: ToolDefinition[];
}

class DevtoolsToolDiscoveryEvent extends CustomEvent<null> {
  respondWith(response: ToolGroup | PromiseLike<ToolGroup>): void {}
}


window.addEventListener('devtoolstooldiscovery', (event: DevtoolsToolDiscoveryEvent) => {
  console.log("devtoolstooldiscovery event received");
  event.respondWith({
    name: "Page-specific DevTools",
    description: "Provide runtime info directly from the page's JavaScript",
    tools: [
      {
        name: "ping",
        description: "For checking whether tools are working in principle.",
        inputSchema: {},
        execute: async () => {
          return {isAlive: true};
        }
      },
      {
        name: "add",
        description: "Calculates the sum of two numbers.",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number" },
            b: { type: "number" }
          },
          required: ["a", "b"]
        },
        execute: async (input: {a: number, b: number}) => {
          return input.a + input.b;
        }
      },
      {
        name: "doubleEcho",
        description: "Returns the input string concatenated to itself.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string" }
          },
          required: ["text"]
        },
        execute: async (input: {text: string}) => {
          return input.text + input.text;
        }
      }]
  });
});


