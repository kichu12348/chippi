function lexer(srcCode) {
    let tokens = [];
    let cursor = 0;
  
    while (cursor < srcCode.length) {
      let currentChar = srcCode[cursor];
  
      // Skip whitespace
      if (/\s/.test(currentChar)) {
        cursor++;
        continue;
      }
  
      // Handle identifiers and keywords
      if (/[a-zA-Z]/.test(currentChar)) {
        let word = "";
        while (/[a-zA-Z]/.test(currentChar)) {
          word += currentChar;
          cursor++;
          currentChar = srcCode[cursor];
        }
  
        if (word === "let" || word === "say" || word === "loop") {
          tokens.push({ type: "KEYWORD", value: word });
        } else {
          tokens.push({ type: "IDENTIFIER", value: word });
        }
        continue;
      }
  
      // Handle numbers
      if (/[0-9]/.test(currentChar)) {
        let number = "";
        while (/[0-9]/.test(currentChar)) {
          number += currentChar;
          cursor++;
          currentChar = srcCode[cursor];
        }
  
        tokens.push({ type: "NUMBER", value: parseInt(number) });
        continue;
      }
  
      // Handle operators
      if (/[\+\-\*\/=/:]/.test(currentChar)) {
        tokens.push({ type: "OPERATOR", value: currentChar });
        cursor++;
        continue;
      }
      // Handle unknown characters
      throw new Error(`Unknown character: ${currentChar}`);
    }
    return tokens;
  }
  
  function parser(tokens) {
    const ast = {
      type: "Program",
      body: [],
    };
    while (tokens.length > 0) {
      let token = tokens.shift();
  
      if (token.type === "KEYWORD" && token.value === "let") {
        let declaration = {
          type: "VariableDeclaration",
          name: tokens.shift().value,
          value: null,
        };
  
        if (tokens[0].type === "OPERATOR" && tokens[0].value === "=") {
          tokens.shift();
          let expression = "";
          while (tokens.length > 0 && tokens[0].type !== "KEYWORD") {
            expression += tokens.shift().value;
          }
          declaration.value = expression.trim();
        }
        ast.body.push(declaration);
      }
  
      if (token.type === "KEYWORD" && token.value === "say") {
        ast.body.push({
          type: "say",
          expression: tokens.shift().value,
        });
      }
  
      if (token.type === "KEYWORD" && token.value === "loop") {
        let loop = {
          type: "loop",
          count: tokens.shift().value,
          body: [],
        };
        while (tokens.length > 0 && tokens[0].type !== "KEYWORD") {
          if (tokens.shift().value === ":") {
            if (tokens[0].type === "KEYWORD" && tokens[0].value === "say") {
              if (tokens.shift().value === "say") {
                loop.body.push({
                  type: "say",
                  expression: tokens.shift().value,
                });
              }
            }
          }
        }
        ast.body.push(loop);
      }
    }
    return ast;
  }
  
  function jsCodeGen(node) {
    switch (node.type) {
      case "Program":
        return node.body.map(jsCodeGen).join("\n");
      case "VariableDeclaration":
        return `let ${node.name} = ${node.value};`
      case "say":
        return `console.log(${node.expression})`;
      case "loop":
        return `for(let i=0;i<${node.count};i++){${node.body
          .map(jsCodeGen)
          .join("\n")}};`
    }
  }
  
  export default function intrepretor(srcCode) {
    const tokens = lexer(srcCode);
    const ast = parser(tokens);
    const exec = jsCodeGen(ast);
    eval(exec);
  }