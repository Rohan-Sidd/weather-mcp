Hello, this is a simple weather mcp built using typescript sdk offered by anthropic. The idea is simple, we use a free weather api to that use lat long of a place use the free Open-Meteo API to get the realtime weather. Add this weather mcp to your claude_desktop_config file 
{
    "weather-tool": {
      "command": "C:\\nvm4w\\nodejs\\node.exe",
      "args": [
        "C:\\Users\\<Username>\\weather-mcp\\dist\\index.js" //this is the path of index file in the build folder
      ]
}
Once you have done this you can ask claude "What's the weather today in London" and it'll call you weather tool to get the info using intent recognition.

To get started initialize a node project (npm init -y)
Install dependencies (npm install @modelcontextprotocol/sdk zod zod-to-json-schema) then (npm install --save-dev typescript @types/node)
Generate build folder: npx tsc (To convert ts file into js file that node.js can process)
Copy paste the complete path of the index.js file in the configuration that we are adding. 

Note that we are not running the application on a network port like (3000) instead claude uses StdioServerTransport stdin and stdout to communicate with the tool. 
