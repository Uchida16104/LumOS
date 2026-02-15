class Compiler {
  constructor() {
    this.targetLanguages = [
      'python', 'javascript', 'rust', 'go', 'java', 'cpp', 'csharp', 'php', 
      'ruby', 'swift', 'kotlin', 'typescript', 'scala', 'haskell', 'erlang',
      'elixir', 'dart', 'lua', 'perl', 'r', 'julia', 'nim', 'crystal', 'zig',
      'ocaml', 'fsharp', 'clojure', 'racket', 'scheme', 'commonlisp', 'assembly'
    ];
  }

  compile(ast, target = 'python') {
    if (!this.targetLanguages.includes(target.toLowerCase())) {
      throw new Error(`Unsupported target language: ${target}`);
    }
    
    const methodName = `compileTo${target.charAt(0).toUpperCase() + target.slice(1)}`;
    
    if (typeof this[methodName] === 'function') {
      return this[methodName](ast);
    }
    
    return this.compileGeneric(ast, target);
  }

  compileToPython(ast) {
    return this.compileNode(ast, 'python', 0);
  }

  compileToJavascript(ast) {
    return this.compileNode(ast, 'javascript', 0);
  }

  compileToRust(ast) {
    let code = 'fn main() {\n';
    code += this.compileNode(ast, 'rust', 1);
    code += '}\n';
    return code;
  }

  compileToGo(ast) {
    let code = 'package main\n\nimport "fmt"\n\nfunc main() {\n';
    code += this.compileNode(ast, 'go', 1);
    code += '}\n';
    return code;
  }

  compileToJava(ast) {
    let code = 'public class LumosProgram {\n';
    code += '    public static void main(String[] args) {\n';
    code += this.compileNode(ast, 'java', 2);
    code += '    }\n}\n';
    return code;
  }

  compileToCpp(ast) {
    let code = '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n';
    code += this.compileNode(ast, 'cpp', 1);
    code += '    return 0;\n}\n';
    return code;
  }

  compileToCsharp(ast) {
    let code = 'using System;\n\nclass Program {\n    static void Main() {\n';
    code += this.compileNode(ast, 'csharp', 2);
    code += '    }\n}\n';
    return code;
  }

  compileToPhp(ast) {
    let code = '<?php\n';
    code += this.compileNode(ast, 'php', 0);
    code += '?>\n';
    return code;
  }

  compileToRuby(ast) {
    return this.compileNode(ast, 'ruby', 0);
  }

  compileToSwift(ast) {
    return this.compileNode(ast, 'swift', 0);
  }

  compileToKotlin(ast) {
    let code = 'fun main() {\n';
    code += this.compileNode(ast, 'kotlin', 1);
    code += '}\n';
    return code;
  }

  compileToTypescript(ast) {
    return this.compileNode(ast, 'typescript', 0);
  }

  compileGeneric(ast, target) {
    return this.compileNode(ast, target, 0);
  }

  compileNode(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    
    switch (node.type) {
      case 'Program':
        return node.children.map(child => this.compileNode(child, lang, indent)).join('');
      
      case 'Number':
        return String(node.value);
      
      case 'String':
        return `"${node.value}"`;
      
      case 'Boolean':
        return this.compileBooleanLiteral(node.value, lang);
      
      case 'Null':
        return this.compileNullLiteral(lang);
      
      case 'Identifier':
        return node.value;
      
      case 'BinaryOp':
        return this.compileBinaryOp(node, lang, indent);
      
      case 'VariableDeclaration':
        return this.compileVariableDeclaration(node, lang, indent);
      
      case 'FunctionDeclaration':
        return this.compileFunctionDeclaration(node, lang, indent);
      
      case 'FunctionCall':
        return this.compileFunctionCall(node, lang, indent);
      
      case 'IfStatement':
        return this.compileIfStatement(node, lang, indent);
      
      case 'WhileLoop':
        return this.compileWhileLoop(node, lang, indent);
      
      case 'ForLoop':
        return this.compileForLoop(node, lang, indent);
      
      case 'ReturnStatement':
        return indentation + this.compileReturnStatement(node, lang, indent) + '\n';
      
      case 'PrintStatement':
        return indentation + this.compilePrintStatement(node, lang, indent) + '\n';
      
      case 'ExpressionStatement':
        return indentation + this.compileNode(node.value.expression, lang, indent) + '\n';
      
      default:
        return '';
    }
  }

  compileBooleanLiteral(value, lang) {
    const trueMap = {
      python: 'True', javascript: 'true', rust: 'true', go: 'true',
      java: 'true', cpp: 'true', csharp: 'true', php: 'true',
      ruby: 'true', swift: 'true', kotlin: 'true', typescript: 'true'
    };
    const falseMap = {
      python: 'False', javascript: 'false', rust: 'false', go: 'false',
      java: 'false', cpp: 'false', csharp: 'false', php: 'false',
      ruby: 'false', swift: 'false', kotlin: 'false', typescript: 'false'
    };
    
    return value ? (trueMap[lang] || 'true') : (falseMap[lang] || 'false');
  }

  compileNullLiteral(lang) {
    const nullMap = {
      python: 'None', javascript: 'null', rust: 'None', go: 'nil',
      java: 'null', cpp: 'nullptr', csharp: 'null', php: 'null',
      ruby: 'nil', swift: 'nil', kotlin: 'null', typescript: 'null'
    };
    return nullMap[lang] || 'null';
  }

  compileBinaryOp(node, lang, indent) {
    const left = this.compileNode(node.value.left, lang, indent);
    const right = this.compileNode(node.value.right, lang, indent);
    const op = node.value.operator;
    
    const operatorMap = {
      and: { python: 'and', javascript: '&&', rust: '&&', go: '&&', java: '&&', 
             cpp: '&&', csharp: '&&', php: '&&', ruby: '&&', swift: '&&', kotlin: '&&' },
      or: { python: 'or', javascript: '||', rust: '||', go: '||', java: '||',
            cpp: '||', csharp: '||', php: '||', ruby: '||', swift: '||', kotlin: '||' }
    };
    
    if (operatorMap[op]) {
      return `(${left} ${operatorMap[op][lang] || op} ${right})`;
    }
    
    return `(${left} ${op} ${right})`;
  }

  compileVariableDeclaration(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    const name = node.value.name;
    const value = this.compileNode(node.value.value, lang, indent);
    
    const varKeywordMap = {
      python: '', javascript: 'let', rust: 'let', go: '', java: 'var',
      cpp: 'auto', csharp: 'var', php: '$', ruby: '', swift: 'let',
      kotlin: 'val', typescript: 'let'
    };
    
    const keyword = varKeywordMap[lang] || '';
    
    if (lang === 'go') {
      return `${indentation}${name} := ${value}\n`;
    } else if (lang === 'php') {
      return `${indentation}${keyword}${name} = ${value};\n`;
    } else if (lang === 'python' || lang === 'ruby') {
      return `${indentation}${name} = ${value}\n`;
    } else {
      return `${indentation}${keyword} ${name} = ${value};\n`;
    }
  }

  compileFunctionDeclaration(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    const name = node.value.name;
    const params = node.value.params.join(', ');
    const body = node.value.body.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
    
    const funcTemplates = {
      python: `${indentation}def ${name}(${params}):\n${body}\n`,
      javascript: `${indentation}function ${name}(${params}) {\n${body}${indentation}}\n`,
      rust: `${indentation}fn ${name}(${params}) {\n${body}${indentation}}\n`,
      go: `${indentation}func ${name}(${params}) {\n${body}${indentation}}\n`,
      java: `${indentation}static void ${name}(${params}) {\n${body}${indentation}}\n`,
      cpp: `${indentation}void ${name}(${params}) {\n${body}${indentation}}\n`,
      csharp: `${indentation}static void ${name}(${params}) {\n${body}${indentation}}\n`,
      php: `${indentation}function ${name}(${params}) {\n${body}${indentation}}\n`,
      ruby: `${indentation}def ${name}(${params})\n${body}${indentation}end\n`,
      swift: `${indentation}func ${name}(${params}) {\n${body}${indentation}}\n`,
      kotlin: `${indentation}fun ${name}(${params}) {\n${body}${indentation}}\n`,
      typescript: `${indentation}function ${name}(${params}) {\n${body}${indentation}}\n`
    };
    
    return funcTemplates[lang] || funcTemplates.javascript;
  }

  compileFunctionCall(node, lang, indent) {
    const name = node.value.name;
    const args = node.value.args.map(arg => this.compileNode(arg, lang, indent)).join(', ');
    return `${name}(${args})`;
  }

  compileIfStatement(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    const condition = this.compileNode(node.value.condition, lang, indent);
    const thenBlock = node.value.thenBlock.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
    
    let code = '';
    
    if (lang === 'python') {
      code = `${indentation}if ${condition}:\n${thenBlock}`;
      if (node.value.elseBlock) {
        const elseBlock = node.value.elseBlock.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
        code += `${indentation}else:\n${elseBlock}`;
      }
    } else if (lang === 'ruby') {
      code = `${indentation}if ${condition}\n${thenBlock}`;
      if (node.value.elseBlock) {
        const elseBlock = node.value.elseBlock.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
        code += `${indentation}else\n${elseBlock}`;
      }
      code += `${indentation}end\n`;
    } else {
      code = `${indentation}if (${condition}) {\n${thenBlock}${indentation}}`;
      if (node.value.elseBlock) {
        const elseBlock = node.value.elseBlock.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
        code += ` else {\n${elseBlock}${indentation}}`;
      }
      code += '\n';
    }
    
    return code;
  }

  compileWhileLoop(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    const condition = this.compileNode(node.value.condition, lang, indent);
    const body = node.value.body.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
    
    if (lang === 'python') {
      return `${indentation}while ${condition}:\n${body}`;
    } else if (lang === 'ruby') {
      return `${indentation}while ${condition}\n${body}${indentation}end\n`;
    } else {
      return `${indentation}while (${condition}) {\n${body}${indentation}}\n`;
    }
  }

  compileForLoop(node, lang, indent) {
    const indentation = '    '.repeat(indent);
    const variable = node.value.variable;
    const start = this.compileNode(node.value.start, lang, indent);
    const end = this.compileNode(node.value.end, lang, indent);
    const body = node.value.body.map(stmt => this.compileNode(stmt, lang, indent + 1)).join('');
    
    const forTemplates = {
      python: `${indentation}for ${variable} in range(${start}, ${end} + 1):\n${body}`,
      javascript: `${indentation}for (let ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {\n${body}${indentation}}\n`,
      rust: `${indentation}for ${variable} in ${start}..=${end} {\n${body}${indentation}}\n`,
      go: `${indentation}for ${variable} := ${start}; ${variable} <= ${end}; ${variable}++ {\n${body}${indentation}}\n`,
      java: `${indentation}for (int ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {\n${body}${indentation}}\n`,
      cpp: `${indentation}for (int ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {\n${body}${indentation}}\n`,
      csharp: `${indentation}for (int ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {\n${body}${indentation}}\n`,
      php: `${indentation}for ($${variable} = ${start}; $${variable} <= ${end}; $${variable}++) {\n${body}${indentation}}\n`,
      ruby: `${indentation}(${start}..${end}).each do |${variable}|\n${body}${indentation}end\n`,
      swift: `${indentation}for ${variable} in ${start}...${end} {\n${body}${indentation}}\n`,
      kotlin: `${indentation}for (${variable} in ${start}..${end}) {\n${body}${indentation}}\n`,
      typescript: `${indentation}for (let ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {\n${body}${indentation}}\n`
    };
    
    return forTemplates[lang] || forTemplates.javascript;
  }

  compileReturnStatement(node, lang, indent) {
    if (node.value.value) {
      const value = this.compileNode(node.value.value, lang, indent);
      return `return ${value};`;
    }
    return 'return;';
  }

  compilePrintStatement(node, lang, indent) {
    const value = this.compileNode(node.value.value, lang, indent);
    
    const printMap = {
      python: `print(${value})`,
      javascript: `console.log(${value});`,
      rust: `println!("{}", ${value});`,
      go: `fmt.Println(${value})`,
      java: `System.out.println(${value});`,
      cpp: `cout << ${value} << endl;`,
      csharp: `Console.WriteLine(${value});`,
      php: `echo ${value};`,
      ruby: `puts ${value}`,
      swift: `print(${value})`,
      kotlin: `println(${value})`,
      typescript: `console.log(${value});`
    };
    
    return printMap[lang] || `console.log(${value});`;
  }
}

module.exports = { Compiler };
