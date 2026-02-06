import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>DevTools MCP & Runtime Data</h1>
    <p class="text">
      This demo page listens to the 'devtoolsdiscovery' event, and calls the event's 'respondWith()' method to provide a list of tools.
    </p>
  </div>
`

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  execute: (input: any) => any;
}

interface ToolGroup {
  name: string;
  description: string;
  tools: ToolDefinition[];
}

class DevtoolsToolDiscoveryEvent extends CustomEvent<null> {
  respondWith(_response: ToolGroup | PromiseLike<ToolGroup>): void {}
}

declare global {
    interface WindowEventMap {
        'devtoolstooldiscovery': DevtoolsToolDiscoveryEvent;
    }
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
      },
      {
        name: "elementInfo",
        description: "Returns info about a DOM element",
        inputSchema: {
          type: "object",
          properties: {
            element: {
              // JSON schema describes an object with a `uid`, which the MCP server
              // replaces with the actual DOM element, which then serves as input to the tool.
              type: "object",
              properties: {
                uid: { type: "string" },
              },
              required: ["uid"]
            }
          },
          required: ["element"]
        },
        execute: async (input: {element: HTMLElement}) => {
          return input.element.outerHTML;
        }
      }]
  });
});


