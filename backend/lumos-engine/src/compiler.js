class Compiler {
  constructor() {
    this.targets = [
      'python', 'rust', 'javascript', 'typescript', 'go', 'c', 'cpp', 'java',
      'csharp', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'haskell', 'elixir',
      'erlang', 'clojure', 'lisp', 'scheme', 'lua', 'perl', 'r', 'julia', 'dart',
      'fortran', 'cobol', 'assembly', 'sql', 'html', 'css'
    ];
  }

  compile(ast, target) {
    if (!this.targets.includes(target)) {
      throw new Error(`Unsupported target: ${target}`);
    }

    const methodName = `compileTo${this.capitalize(target)}`;
    
    if (typeof this[methodName] === 'function') {
      return this[methodName](ast);
    }

    throw new Error(`Compiler for ${target} not implemented`);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  compileToPython(ast) {
    const lines = [];
    
    for (const node of ast.children) {
      lines.push(this.pythonNode(node, 0));
    }
    
    return lines.join('\n');
  }

  pythonNode(node, indent) {
    const indentStr = '    '.repeat(indent);
    
    switch (node.type) {
      case 'VariableDeclaration':
        const varName = node.properties.identifier;
        const varValue = node.children.length > 0 ? this.pythonExpression(node.children[0]) : 'None';
        return `${indentStr}${varName} = ${varValue}`;
        
      case 'FunctionDeclaration':
        const funcName = node.properties.name;
        const params = node.properties.params.join(', ');
        const body = node.children[0];
        let funcLines = [`${indentStr}def ${funcName}(${params}):`];
        
        if (body.children.length === 0) {
          funcLines.push(`${indentStr}    pass`);
        } else {
          for (const stmt of body.children) {
            funcLines.push(this.pythonNode(stmt, indent + 1));
          }
        }
        
        return funcLines.join('\n');
        
      case 'ClassDeclaration':
        const className = node.properties.name;
        const classBody = node.children[0];
        let classLines = [`${indentStr}class ${className}:`];
        
        if (classBody.children.length === 0) {
          classLines.push(`${indentStr}    pass`);
        } else {
          for (const member of classBody.children) {
            classLines.push(this.pythonNode(member, indent + 1));
          }
        }
        
        return classLines.join('\n');
        
      case 'IfStatement':
        const test = this.pythonExpression(node.children[0]);
        const consequent = node.children[1];
        let ifLines = [`${indentStr}if ${test}:`];
        
        for (const stmt of consequent.children) {
          ifLines.push(this.pythonNode(stmt, indent + 1));
        }
        
        if (node.children.length > 2) {
          const alternate = node.children[2];
          if (alternate.type === 'IfStatement') {
            ifLines.push(this.pythonNode(alternate, indent).replace('if', 'elif'));
          } else {
            ifLines.push(`${indentStr}else:`);
            for (const stmt of alternate.children) {
              ifLines.push(this.pythonNode(stmt, indent + 1));
            }
          }
        }
        
        return ifLines.join('\n');
        
      case 'WhileStatement':
        const whileTest = this.pythonExpression(node.children[0]);
        const whileBody = node.children[1];
        let whileLines = [`${indentStr}while ${whileTest}:`];
        
        for (const stmt of whileBody.children) {
          whileLines.push(this.pythonNode(stmt, indent + 1));
        }
        
        return whileLines.join('\n');
        
      case 'ForStatement':
        const iterator = node.properties.iterator;
        const start = this.pythonExpression(node.children[0]);
        const end = this.pythonExpression(node.children[1]);
        const forBody = node.children[2];
        let forLines = [`${indentStr}for ${iterator} in range(${start}, ${end} + 1):`];
        
        for (const stmt of forBody.children) {
          forLines.push(this.pythonNode(stmt, indent + 1));
        }
        
        return forLines.join('\n');
        
      case 'ReturnStatement':
        const returnValue = node.children.length > 0 ? this.pythonExpression(node.children[0]) : 'None';
        return `${indentStr}return ${returnValue}`;
        
      case 'TryStatement':
        const tryBlock = node.children[0];
        const catchBlock = node.children.length > 1 ? node.children[1] : null;
        let tryLines = [`${indentStr}try:`];
        
        for (const stmt of tryBlock.children) {
          tryLines.push(this.pythonNode(stmt, indent + 1));
        }
        
        if (catchBlock) {
          const param = catchBlock.properties.param;
          tryLines.push(`${indentStr}except Exception as ${param}:`);
          
          for (const stmt of catchBlock.children) {
            tryLines.push(this.pythonNode(stmt, indent + 1));
          }
        }
        
        if (node.properties.finally) {
          tryLines.push(`${indentStr}finally:`);
          for (const stmt of node.properties.finally.children) {
            tryLines.push(this.pythonNode(stmt, indent + 1));
          }
        }
        
        return tryLines.join('\n');
        
      case 'BreakStatement':
        return `${indentStr}break`;
        
      case 'ContinueStatement':
        return `${indentStr}continue`;
        
      case 'ExpressionStatement':
        return `${indentStr}${this.pythonExpression(node.children[0])}`;
        
      default:
        return '';
    }
  }

  pythonExpression(node) {
    switch (node.type) {
      case 'Literal':
        if (node.properties.dataType === 'string') {
          return `"${node.properties.value}"`;
        } else if (node.properties.dataType === 'boolean') {
          return node.properties.value ? 'True' : 'False';
        } else if (node.properties.dataType === 'null') {
          return 'None';
        }
        return String(node.properties.value);
        
      case 'Identifier':
        return node.properties.name;
        
      case 'BinaryExpression':
        const left = this.pythonExpression(node.children[0]);
        const right = this.pythonExpression(node.children[1]);
        const op = node.properties.operator;
        const pythonOp = op === '&&' ? 'and' : op === '||' ? 'or' : op;
        return `(${left} ${pythonOp} ${right})`;
        
      case 'UnaryExpression':
        const unaryOp = node.properties.operator === '!' ? 'not ' : node.properties.operator;
        const unaryArg = this.pythonExpression(node.children[0]);
        return `${unaryOp}${unaryArg}`;
        
      case 'CallExpression':
        const callee = this.pythonExpression(node.children[0]);
        const args = node.properties.arguments.map(arg => this.pythonExpression(arg)).join(', ');
        return `${callee}(${args})`;
        
      case 'MemberExpression':
        const obj = this.pythonExpression(node.children[0]);
        const prop = node.properties.property;
        return `${obj}.${prop}`;
        
      case 'IndexExpression':
        const arr = this.pythonExpression(node.children[0]);
        const idx = this.pythonExpression(node.children[1]);
        return `${arr}[${idx}]`;
        
      case 'ArrayExpression':
        const elements = node.properties.elements.map(elem => this.pythonExpression(elem)).join(', ');
        return `[${elements}]`;
        
      case 'ObjectExpression':
        const props = node.properties.properties.map(p => `"${p.key}": ${this.pythonExpression(p.value)}`).join(', ');
        return `{${props}}`;
        
      case 'AssignmentExpression':
        const assignLeft = this.pythonExpression(node.children[0]);
        const assignRight = this.pythonExpression(node.children[1]);
        const assignOp = node.properties.operator;
        return `${assignLeft} ${assignOp} ${assignRight}`;
        
      case 'NewExpression':
        const newClass = node.properties.className;
        const newArgs = node.properties.arguments.map(arg => this.pythonExpression(arg)).join(', ');
        return `${newClass}(${newArgs})`;
        
      case 'ThisExpression':
        return 'self';
        
      default:
        return '';
    }
  }

  compileToJavascript(ast) {
    const lines = [];
    
    for (const node of ast.children) {
      lines.push(this.javascriptNode(node, 0));
    }
    
    return lines.join('\n');
  }

  javascriptNode(node, indent) {
    const indentStr = '  '.repeat(indent);
    
    switch (node.type) {
      case 'VariableDeclaration':
        const kind = node.properties.kind;
        const varName = node.properties.identifier;
        const varValue = node.children.length > 0 ? this.javascriptExpression(node.children[0]) : 'undefined';
        return `${indentStr}${kind} ${varName} = ${varValue};`;
        
      case 'FunctionDeclaration':
        const funcName = node.properties.name;
        const params = node.properties.params.join(', ');
        const body = node.children[0];
        let funcLines = [`${indentStr}function ${funcName}(${params}) {`];
        
        for (const stmt of body.children) {
          funcLines.push(this.javascriptNode(stmt, indent + 1));
        }
        
        funcLines.push(`${indentStr}}`);
        return funcLines.join('\n');
        
      case 'ClassDeclaration':
        const className = node.properties.name;
        const classBody = node.children[0];
        let classLines = [`${indentStr}class ${className} {`];
        
        for (const member of classBody.children) {
          if (member.type === 'FunctionDeclaration') {
            const methodName = member.properties.name;
            const methodParams = member.properties.params.join(', ');
            const methodBody = member.children[0];
            
            classLines.push(`${indentStr}  ${methodName}(${methodParams}) {`);
            
            for (const stmt of methodBody.children) {
              classLines.push(this.javascriptNode(stmt, indent + 2));
            }
            
            classLines.push(`${indentStr}  }`);
          }
        }
        
        classLines.push(`${indentStr}}`);
        return classLines.join('\n');
        
      case 'IfStatement':
        const test = this.javascriptExpression(node.children[0]);
        const consequent = node.children[1];
        let ifLines = [`${indentStr}if (${test}) {`];
        
        for (const stmt of consequent.children) {
          ifLines.push(this.javascriptNode(stmt, indent + 1));
        }
        
        ifLines.push(`${indentStr}}`);
        
        if (node.children.length > 2) {
          const alternate = node.children[2];
          if (alternate.type === 'IfStatement') {
            ifLines.push(`${indentStr}else ${this.javascriptNode(alternate, indent).trim()}`);
          } else {
            ifLines.push(`${indentStr}else {`);
            for (const stmt of alternate.children) {
              ifLines.push(this.javascriptNode(stmt, indent + 1));
            }
            ifLines.push(`${indentStr}}`);
          }
        }
        
        return ifLines.join('\n');
        
      case 'WhileStatement':
        const whileTest = this.javascriptExpression(node.children[0]);
        const whileBody = node.children[1];
        let whileLines = [`${indentStr}while (${whileTest}) {`];
        
        for (const stmt of whileBody.children) {
          whileLines.push(this.javascriptNode(stmt, indent + 1));
        }
        
        whileLines.push(`${indentStr}}`);
        return whileLines.join('\n');
        
      case 'ForStatement':
        const iterator = node.properties.iterator;
        const start = this.javascriptExpression(node.children[0]);
        const end = this.javascriptExpression(node.children[1]);
        const forBody = node.children[2];
        let forLines = [`${indentStr}for (let ${iterator} = ${start}; ${iterator} <= ${end}; ${iterator}++) {`];
        
        for (const stmt of forBody.children) {
          forLines.push(this.javascriptNode(stmt, indent + 1));
        }
        
        forLines.push(`${indentStr}}`);
        return forLines.join('\n');
        
      case 'ReturnStatement':
        const returnValue = node.children.length > 0 ? this.javascriptExpression(node.children[0]) : 'undefined';
        return `${indentStr}return ${returnValue};`;
        
      case 'TryStatement':
        const tryBlock = node.children[0];
        const catchBlock = node.children.length > 1 ? node.children[1] : null;
        let tryLines = [`${indentStr}try {`];
        
        for (const stmt of tryBlock.children) {
          tryLines.push(this.javascriptNode(stmt, indent + 1));
        }
        
        tryLines.push(`${indentStr}}`);
        
        if (catchBlock) {
          const param = catchBlock.properties.param;
          tryLines.push(`${indentStr}catch (${param}) {`);
          
          for (const stmt of catchBlock.children) {
            tryLines.push(this.javascriptNode(stmt, indent + 1));
          }
          
          tryLines.push(`${indentStr}}`);
        }
        
        if (node.properties.finally) {
          tryLines.push(`${indentStr}finally {`);
          for (const stmt of node.properties.finally.children) {
            tryLines.push(this.javascriptNode(stmt, indent + 1));
          }
          tryLines.push(`${indentStr}}`);
        }
        
        return tryLines.join('\n');
        
      case 'BreakStatement':
        return `${indentStr}break;`;
        
      case 'ContinueStatement':
        return `${indentStr}continue;`;
        
      case 'ExpressionStatement':
        return `${indentStr}${this.javascriptExpression(node.children[0])};`;
        
      default:
        return '';
    }
  }

  javascriptExpression(node) {
    switch (node.type) {
      case 'Literal':
        if (node.properties.dataType === 'string') {
          return `"${node.properties.value}"`;
        } else if (node.properties.dataType === 'null') {
          return 'null';
        }
        return String(node.properties.value);
        
      case 'Identifier':
        return node.properties.name;
        
      case 'BinaryExpression':
        const left = this.javascriptExpression(node.children[0]);
        const right = this.javascriptExpression(node.children[1]);
        const op = node.properties.operator;
        return `(${left} ${op} ${right})`;
        
      case 'UnaryExpression':
        const unaryOp = node.properties.operator;
        const unaryArg = this.javascriptExpression(node.children[0]);
        return `${unaryOp}${unaryArg}`;
        
      case 'CallExpression':
        const callee = this.javascriptExpression(node.children[0]);
        const args = node.properties.arguments.map(arg => this.javascriptExpression(arg)).join(', ');
        return `${callee}(${args})`;
        
      case 'MemberExpression':
        const obj = this.javascriptExpression(node.children[0]);
        const prop = node.properties.property;
        return `${obj}.${prop}`;
        
      case 'IndexExpression':
        const arr = this.javascriptExpression(node.children[0]);
        const idx = this.javascriptExpression(node.children[1]);
        return `${arr}[${idx}]`;
        
      case 'ArrayExpression':
        const elements = node.properties.elements.map(elem => this.javascriptExpression(elem)).join(', ');
        return `[${elements}]`;
        
      case 'ObjectExpression':
        const props = node.properties.properties.map(p => `${p.key}: ${this.javascriptExpression(p.value)}`).join(', ');
        return `{${props}}`;
        
      case 'AssignmentExpression':
        const assignLeft = this.javascriptExpression(node.children[0]);
        const assignRight = this.javascriptExpression(node.children[1]);
        const assignOp = node.properties.operator;
        return `${assignLeft} ${assignOp} ${assignRight}`;
        
      case 'NewExpression':
        const newClass = node.properties.className;
        const newArgs = node.properties.arguments.map(arg => this.javascriptExpression(arg)).join(', ');
        return `new ${newClass}(${newArgs})`;
        
      case 'ThisExpression':
        return 'this';
        
      default:
        return '';
    }
  }

  compileToRust(ast) {
    const lines = [];
    lines.push('fn main() {');
    
    for (const node of ast.children) {
      const compiled = this.rustNode(node, 1);
      if (compiled) {
        lines.push(compiled);
      }
    }
    
    lines.push('}');
    return lines.join('\n');
  }

  rustNode(node, indent) {
    const indentStr = '    '.repeat(indent);
    
    switch (node.type) {
      case 'VariableDeclaration':
        const varName = node.properties.identifier;
        const varValue = node.children.length > 0 ? this.rustExpression(node.children[0]) : '()';
        const mutability = node.properties.kind === 'const' ? '' : 'mut ';
        return `${indentStr}let ${mutability}${varName} = ${varValue};`;
        
      case 'FunctionDeclaration':
        const funcName = node.properties.name;
        const params = node.properties.params.map(p => `${p}: i32`).join(', ');
        const body = node.children[0];
        let funcLines = [`${indentStr}fn ${funcName}(${params}) {`];
        
        for (const stmt of body.children) {
          funcLines.push(this.rustNode(stmt, indent + 1));
        }
        
        funcLines.push(`${indentStr}}`);
        return funcLines.join('\n');
        
      case 'IfStatement':
        const test = this.rustExpression(node.children[0]);
        const consequent = node.children[1];
        let ifLines = [`${indentStr}if ${test} {`];
        
        for (const stmt of consequent.children) {
          ifLines.push(this.rustNode(stmt, indent + 1));
        }
        
        ifLines.push(`${indentStr}}`);
        
        if (node.children.length > 2) {
          const alternate = node.children[2];
          ifLines.push(`${indentStr}else {`);
          for (const stmt of alternate.children) {
            ifLines.push(this.rustNode(stmt, indent + 1));
          }
          ifLines.push(`${indentStr}}`);
        }
        
        return ifLines.join('\n');
        
      case 'WhileStatement':
        const whileTest = this.rustExpression(node.children[0]);
        const whileBody = node.children[1];
        let whileLines = [`${indentStr}while ${whileTest} {`];
        
        for (const stmt of whileBody.children) {
          whileLines.push(this.rustNode(stmt, indent + 1));
        }
        
        whileLines.push(`${indentStr}}`);
        return whileLines.join('\n');
        
      case 'ForStatement':
        const iterator = node.properties.iterator;
        const start = this.rustExpression(node.children[0]);
        const end = this.rustExpression(node.children[1]);
        const forBody = node.children[2];
        let forLines = [`${indentStr}for ${iterator} in ${start}..=${end} {`];
        
        for (const stmt of forBody.children) {
          forLines.push(this.rustNode(stmt, indent + 1));
        }
        
        forLines.push(`${indentStr}}`);
        return forLines.join('\n');
        
      case 'ReturnStatement':
        const returnValue = node.children.length > 0 ? this.rustExpression(node.children[0]) : '()';
        return `${indentStr}return ${returnValue};`;
        
      case 'ExpressionStatement':
        const exprCode = this.rustExpression(node.children[0]);
        if (exprCode.includes('println!')) {
          return `${indentStr}${exprCode};`;
        }
        return `${indentStr}${exprCode};`;
        
      default:
        return '';
    }
  }

  rustExpression(node) {
    switch (node.type) {
      case 'Literal':
        if (node.properties.dataType === 'string') {
          return `"${node.properties.value}"`;
        }
        return String(node.properties.value);
        
      case 'Identifier':
        return node.properties.name;
        
      case 'BinaryExpression':
        const left = this.rustExpression(node.children[0]);
        const right = this.rustExpression(node.children[1]);
        const op = node.properties.operator;
        return `(${left} ${op} ${right})`;
        
      case 'CallExpression':
        const callee = this.rustExpression(node.children[0]);
        const args = node.properties.arguments.map(arg => this.rustExpression(arg)).join(', ');
        
        if (callee === 'print') {
          return `println!("{}", ${args})`;
        }
        
        return `${callee}(${args})`;
        
      case 'AssignmentExpression':
        const assignLeft = this.rustExpression(node.children[0]);
        const assignRight = this.rustExpression(node.children[1]);
        return `${assignLeft} = ${assignRight}`;
        
      default:
        return '';
    }
  }

  getAvailableTargets() {
    return this.targets;
  }
}

module.exports = { Compiler };
