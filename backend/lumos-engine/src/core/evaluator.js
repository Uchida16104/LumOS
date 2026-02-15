class Environment {
  constructor(parent = null) {
    this.vars = {};
    this.parent = parent;
  }

  define(name, value) {
    this.vars[name] = value;
  }

  get(name) {
    if (name in this.vars) {
      return this.vars[name];
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name, value) {
    if (name in this.vars) {
      this.vars[name] = value;
    } else if (this.parent) {
      this.parent.set(name, value);
    } else {
      throw new Error(`Undefined variable: ${name}`);
    }
  }
}

class Evaluator {
  constructor() {
    this.globalEnv = new Environment();
    this.setupBuiltins();
    this.output = [];
  }

  setupBuiltins() {
    this.globalEnv.define('str', (value) => String(value));
    this.globalEnv.define('int', (value) => parseInt(value));
    this.globalEnv.define('float', (value) => parseFloat(value));
    this.globalEnv.define('len', (value) => value.length);
    this.globalEnv.define('type', (value) => typeof value);
    this.globalEnv.define('abs', Math.abs);
    this.globalEnv.define('sqrt', Math.sqrt);
    this.globalEnv.define('pow', Math.pow);
    this.globalEnv.define('floor', Math.floor);
    this.globalEnv.define('ceil', Math.ceil);
    this.globalEnv.define('round', Math.round);
    this.globalEnv.define('random', Math.random);
  }

  evaluate(node, env = this.globalEnv) {
    switch (node.type) {
      case 'Program':
        return this.evaluateProgram(node, env);
      
      case 'Number':
        return node.value;
      
      case 'String':
        return node.value;
      
      case 'Boolean':
        return node.value;
      
      case 'Null':
        return null;
      
      case 'Identifier':
        return env.get(node.value);
      
      case 'BinaryOp':
        return this.evaluateBinaryOp(node, env);
      
      case 'VariableDeclaration':
        return this.evaluateVariableDeclaration(node, env);
      
      case 'FunctionDeclaration':
        return this.evaluateFunctionDeclaration(node, env);
      
      case 'FunctionCall':
        return this.evaluateFunctionCall(node, env);
      
      case 'IfStatement':
        return this.evaluateIfStatement(node, env);
      
      case 'WhileLoop':
        return this.evaluateWhileLoop(node, env);
      
      case 'ForLoop':
        return this.evaluateForLoop(node, env);
      
      case 'ReturnStatement':
        return { type: 'return', value: this.evaluate(node.value.value, env) };
      
      case 'PrintStatement':
        return this.evaluatePrintStatement(node, env);
      
      case 'ExpressionStatement':
        return this.evaluate(node.value.expression, env);
      
      case 'ClassDeclaration':
        return this.evaluateClassDeclaration(node, env);
      
      case 'ImportStatement':
        return this.evaluateImportStatement(node, env);
      
      case 'ExportStatement':
        return this.evaluate(node.value.statement, env);
      
      case 'TryCatch':
        return this.evaluateTryCatch(node, env);
      
      case 'ThrowStatement':
        throw new Error(this.evaluate(node.value.value, env));
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  evaluateProgram(node, env) {
    let result = null;
    for (const statement of node.children) {
      result = this.evaluate(statement, env);
      if (result && result.type === 'return') {
        return result.value;
      }
    }
    return result;
  }

  evaluateBinaryOp(node, env) {
    const left = this.evaluate(node.value.left, env);
    const right = this.evaluate(node.value.right, env);
    const op = node.value.operator;

    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '>': return left > right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case 'and': return left && right;
      case 'or': return left || right;
      default: throw new Error(`Unknown operator: ${op}`);
    }
  }

  evaluateVariableDeclaration(node, env) {
    const value = this.evaluate(node.value.value, env);
    env.define(node.value.name, value);
    return value;
  }

  evaluateFunctionDeclaration(node, env) {
    const func = {
      params: node.value.params,
      body: node.value.body,
      env: env
    };
    env.define(node.value.name, func);
    return func;
  }

  evaluateFunctionCall(node, env) {
    const func = env.get(node.value.name);
    
    if (typeof func === 'function') {
      const args = node.value.args.map(arg => this.evaluate(arg, env));
      return func(...args);
    }
    
    if (typeof func === 'object' && func.params) {
      const funcEnv = new Environment(func.env);
      const args = node.value.args.map(arg => this.evaluate(arg, env));
      
      for (let i = 0; i < func.params.length; i++) {
        funcEnv.define(func.params[i], args[i]);
      }
      
      for (const statement of func.body) {
        const result = this.evaluate(statement, funcEnv);
        if (result && result.type === 'return') {
          return result.value;
        }
      }
      return null;
    }
    
    throw new Error(`${node.value.name} is not a function`);
  }

  evaluateIfStatement(node, env) {
    const condition = this.evaluate(node.value.condition, env);
    
    if (condition) {
      for (const statement of node.value.thenBlock) {
        const result = this.evaluate(statement, env);
        if (result && result.type === 'return') {
          return result;
        }
      }
    } else if (node.value.elseBlock) {
      for (const statement of node.value.elseBlock) {
        const result = this.evaluate(statement, env);
        if (result && result.type === 'return') {
          return result;
        }
      }
    }
    
    return null;
  }

  evaluateWhileLoop(node, env) {
    while (this.evaluate(node.value.condition, env)) {
      for (const statement of node.value.body) {
        const result = this.evaluate(statement, env);
        if (result && result.type === 'return') {
          return result;
        }
      }
    }
    return null;
  }

  evaluateForLoop(node, env) {
    const loopEnv = new Environment(env);
    const start = this.evaluate(node.value.start, env);
    const end = this.evaluate(node.value.end, env);
    
    for (let i = start; i <= end; i++) {
      loopEnv.define(node.value.variable, i);
      for (const statement of node.value.body) {
        const result = this.evaluate(statement, loopEnv);
        if (result && result.type === 'return') {
          return result;
        }
      }
    }
    
    return null;
  }

  evaluatePrintStatement(node, env) {
    const value = this.evaluate(node.value.value, env);
    const output = String(value);
    this.output.push(output);
    console.log(output);
    return value;
  }

  evaluateClassDeclaration(node, env) {
    const classObj = {
      name: node.value.name,
      superClass: node.value.superClass,
      methods: {},
      env: env
    };
    
    for (const method of node.value.methods) {
      classObj.methods[method.value.name] = {
        params: method.value.params,
        body: method.value.body
      };
    }
    
    env.define(node.value.name, classObj);
    return classObj;
  }

  evaluateImportStatement(node, env) {
    console.log(`Importing ${node.value.imports.join(', ')} from ${node.value.source}`);
    return null;
  }

  evaluateTryCatch(node, env) {
    try {
      for (const statement of node.value.tryBlock) {
        const result = this.evaluate(statement, env);
        if (result && result.type === 'return') {
          return result;
        }
      }
    } catch (error) {
      const catchEnv = new Environment(env);
      catchEnv.define(node.value.errorVar, error.message);
      
      for (const statement of node.value.catchBlock) {
        const result = this.evaluate(statement, catchEnv);
        if (result && result.type === 'return') {
          return result;
        }
      }
    }
    return null;
  }

  getOutput() {
    return this.output.join('\n');
  }

  clearOutput() {
    this.output = [];
  }
}

module.exports = { Evaluator, Environment };
