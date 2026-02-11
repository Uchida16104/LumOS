class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
    this.functions = new Map();
    this.classes = new Map();
  }

  define(name, value) {
    this.variables.set(name, value);
  }

  get(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name, value) {
    if (this.variables.has(name)) {
      this.variables.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  defineFunction(name, func) {
    this.functions.set(name, func);
  }

  getFunction(name) {
    if (this.functions.has(name)) {
      return this.functions.get(name);
    }
    if (this.parent) {
      return this.parent.getFunction(name);
    }
    return null;
  }

  defineClass(name, classInfo) {
    this.classes.set(name, classInfo);
  }

  getClass(name) {
    if (this.classes.has(name)) {
      return this.classes.get(name);
    }
    if (this.parent) {
      return this.parent.getClass(name);
    }
    return null;
  }
}

class Evaluator {
  constructor() {
    this.globalEnv = new Environment();
    this.currentEnv = this.globalEnv;
    this.output = [];
    this.setupBuiltins();
  }

  setupBuiltins() {
    this.globalEnv.defineFunction('print', {
      type: 'builtin',
      call: (...args) => {
        const message = args.map(arg => this.stringify(arg)).join(' ');
        this.output.push(message);
        console.log(message);
        return message;
      }
    });

    this.globalEnv.defineFunction('input', {
      type: 'builtin',
      call: (prompt) => {
        return prompt || '';
      }
    });

    this.globalEnv.defineFunction('len', {
      type: 'builtin',
      call: (value) => {
        if (typeof value === 'string' || Array.isArray(value)) {
          return value.length;
        }
        return 0;
      }
    });

    this.globalEnv.defineFunction('type', {
      type: 'builtin',
      call: (value) => {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
      }
    });

    this.globalEnv.defineFunction('str', {
      type: 'builtin',
      call: (value) => String(value)
    });

    this.globalEnv.defineFunction('int', {
      type: 'builtin',
      call: (value) => parseInt(value, 10)
    });

    this.globalEnv.defineFunction('float', {
      type: 'builtin',
      call: (value) => parseFloat(value)
    });

    this.globalEnv.defineFunction('range', {
      type: 'builtin',
      call: (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
    });

    this.globalEnv.define('Math', {
      PI: Math.PI,
      E: Math.E,
      abs: (x) => Math.abs(x),
      ceil: (x) => Math.ceil(x),
      floor: (x) => Math.floor(x),
      round: (x) => Math.round(x),
      sqrt: (x) => Math.sqrt(x),
      pow: (x, y) => Math.pow(x, y),
      sin: (x) => Math.sin(x),
      cos: (x) => Math.cos(x),
      tan: (x) => Math.tan(x),
      random: () => Math.random()
    });
  }

  evaluate(ast) {
    this.output = [];
    try {
      const result = this.evaluateNode(ast);
      return { result, output: this.output.join('\n') };
    } catch (error) {
      return { error: error.message, output: this.output.join('\n') };
    }
  }

  evaluateNode(node) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        return this.evaluateProgram(node);
      case 'VariableDeclaration':
        return this.evaluateVariableDeclaration(node);
      case 'FunctionDeclaration':
        return this.evaluateFunctionDeclaration(node);
      case 'ClassDeclaration':
        return this.evaluateClassDeclaration(node);
      case 'IfStatement':
        return this.evaluateIfStatement(node);
      case 'WhileStatement':
        return this.evaluateWhileStatement(node);
      case 'ForStatement':
        return this.evaluateForStatement(node);
      case 'ReturnStatement':
        return this.evaluateReturnStatement(node);
      case 'TryStatement':
        return this.evaluateTryStatement(node);
      case 'BreakStatement':
        throw { type: 'break' };
      case 'ContinueStatement':
        throw { type: 'continue' };
      case 'ExpressionStatement':
        return this.evaluateNode(node.children[0]);
      case 'BlockStatement':
        return this.evaluateBlockStatement(node);
      case 'AssignmentExpression':
        return this.evaluateAssignmentExpression(node);
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(node);
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(node);
      case 'UpdateExpression':
        return this.evaluateUpdateExpression(node);
      case 'CallExpression':
        return this.evaluateCallExpression(node);
      case 'MemberExpression':
        return this.evaluateMemberExpression(node);
      case 'IndexExpression':
        return this.evaluateIndexExpression(node);
      case 'NewExpression':
        return this.evaluateNewExpression(node);
      case 'Identifier':
        return this.currentEnv.get(node.properties.name);
      case 'Literal':
        return node.properties.value;
      case 'ArrayExpression':
        return this.evaluateArrayExpression(node);
      case 'ObjectExpression':
        return this.evaluateObjectExpression(node);
      case 'ThisExpression':
        return this.currentEnv.get('this');
      default:
        return null;
    }
  }

  evaluateProgram(node) {
    let result = null;
    for (const child of node.children) {
      result = this.evaluateNode(child);
    }
    return result;
  }

  evaluateVariableDeclaration(node) {
    const identifier = node.properties.identifier;
    const value = node.children.length > 0 ? this.evaluateNode(node.children[0]) : undefined;
    this.currentEnv.define(identifier, value);
    return value;
  }

  evaluateFunctionDeclaration(node) {
    const name = node.properties.name;
    const params = node.properties.params;
    const body = node.children[0];
    
    const func = {
      type: 'user',
      params,
      body,
      closure: this.currentEnv,
      call: (...args) => {
        const funcEnv = new Environment(this.currentEnv);
        
        for (let i = 0; i < params.length; i++) {
          funcEnv.define(params[i], args[i]);
        }

        const prevEnv = this.currentEnv;
        this.currentEnv = funcEnv;

        try {
          this.evaluateNode(body);
          this.currentEnv = prevEnv;
          return undefined;
        } catch (error) {
          this.currentEnv = prevEnv;
          if (error.type === 'return') {
            return error.value;
          }
          throw error;
        }
      }
    };

    this.currentEnv.defineFunction(name, func);
    return func;
  }

  evaluateClassDeclaration(node) {
    const name = node.properties.name;
    const body = node.children[0];
    
    const classInfo = {
      name,
      methods: new Map(),
      properties: new Map()
    };

    const classEnv = new Environment(this.currentEnv);
    const prevEnv = this.currentEnv;
    this.currentEnv = classEnv;

    for (const member of body.children) {
      if (member.type === 'FunctionDeclaration') {
        const methodName = member.properties.name;
        const method = this.evaluateFunctionDeclaration(member);
        classInfo.methods.set(methodName, method);
      } else if (member.type === 'VariableDeclaration') {
        const propName = member.properties.identifier;
        const value = member.children.length > 0 ? this.evaluateNode(member.children[0]) : undefined;
        classInfo.properties.set(propName, value);
      }
    }

    this.currentEnv = prevEnv;
    this.currentEnv.defineClass(name, classInfo);
    return classInfo;
  }

  evaluateIfStatement(node) {
    const test = this.evaluateNode(node.children[0]);
    
    if (this.isTruthy(test)) {
      return this.evaluateNode(node.children[1]);
    } else if (node.children.length > 2) {
      return this.evaluateNode(node.children[2]);
    }
    
    return null;
  }

  evaluateWhileStatement(node) {
    const test = node.children[0];
    const body = node.children[1];
    
    while (this.isTruthy(this.evaluateNode(test))) {
      try {
        this.evaluateNode(body);
      } catch (error) {
        if (error.type === 'break') {
          break;
        } else if (error.type === 'continue') {
          continue;
        } else {
          throw error;
        }
      }
    }
    
    return null;
  }

  evaluateForStatement(node) {
    const iterator = node.properties.iterator;
    const start = this.evaluateNode(node.children[0]);
    const end = this.evaluateNode(node.children[1]);
    const body = node.children[2];
    
    const forEnv = new Environment(this.currentEnv);
    const prevEnv = this.currentEnv;
    this.currentEnv = forEnv;

    for (let i = start; i <= end; i++) {
      this.currentEnv.define(iterator, i);
      
      try {
        this.evaluateNode(body);
      } catch (error) {
        if (error.type === 'break') {
          break;
        } else if (error.type === 'continue') {
          continue;
        } else {
          this.currentEnv = prevEnv;
          throw error;
        }
      }
    }

    this.currentEnv = prevEnv;
    return null;
  }

  evaluateReturnStatement(node) {
    const value = node.children.length > 0 ? this.evaluateNode(node.children[0]) : undefined;
    throw { type: 'return', value };
  }

  evaluateTryStatement(node) {
    const tryBlock = node.children[0];
    const catchBlock = node.children.length > 1 ? node.children[1] : null;
    const finallyBlock = node.properties.finally;

    try {
      return this.evaluateNode(tryBlock);
    } catch (error) {
      if (catchBlock && error.type !== 'return' && error.type !== 'break' && error.type !== 'continue') {
        const param = catchBlock.properties.param;
        const catchEnv = new Environment(this.currentEnv);
        catchEnv.define(param, error.message || error);
        
        const prevEnv = this.currentEnv;
        this.currentEnv = catchEnv;
        
        const result = this.evaluateBlockStatement(catchBlock);
        
        this.currentEnv = prevEnv;
        return result;
      } else {
        throw error;
      }
    } finally {
      if (finallyBlock) {
        this.evaluateNode(finallyBlock);
      }
    }
  }

  evaluateBlockStatement(node) {
    let result = null;
    for (const child of node.children) {
      result = this.evaluateNode(child);
    }
    return result;
  }

  evaluateAssignmentExpression(node) {
    const left = node.children[0];
    const operator = node.properties.operator;
    const right = this.evaluateNode(node.children[1]);

    if (left.type === 'Identifier') {
      const name = left.properties.name;
      
      if (operator === '=') {
        this.currentEnv.set(name, right);
        return right;
      } else if (operator === '+=') {
        const current = this.currentEnv.get(name);
        const newValue = current + right;
        this.currentEnv.set(name, newValue);
        return newValue;
      } else if (operator === '-=') {
        const current = this.currentEnv.get(name);
        const newValue = current - right;
        this.currentEnv.set(name, newValue);
        return newValue;
      } else if (operator === '*=') {
        const current = this.currentEnv.get(name);
        const newValue = current * right;
        this.currentEnv.set(name, newValue);
        return newValue;
      } else if (operator === '/=') {
        const current = this.currentEnv.get(name);
        const newValue = current / right;
        this.currentEnv.set(name, newValue);
        return newValue;
      }
    } else if (left.type === 'MemberExpression') {
      const object = this.evaluateNode(left.children[0]);
      const property = left.properties.property;
      object[property] = right;
      return right;
    } else if (left.type === 'IndexExpression') {
      const array = this.evaluateNode(left.children[0]);
      const index = this.evaluateNode(left.children[1]);
      array[index] = right;
      return right;
    }

    throw new Error(`Invalid assignment target`);
  }

  evaluateBinaryExpression(node) {
    const operator = node.properties.operator;
    const left = this.evaluateNode(node.children[0]);
    const right = this.evaluateNode(node.children[1]);

    switch (operator) {
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
      case '&&': return left && right;
      case '||': return left || right;
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  }

  evaluateUnaryExpression(node) {
    const operator = node.properties.operator;
    const argument = this.evaluateNode(node.children[0]);

    switch (operator) {
      case '-': return -argument;
      case '!': return !argument;
      case '++': 
        if (node.children[0].type === 'Identifier') {
          const name = node.children[0].properties.name;
          const value = this.currentEnv.get(name) + 1;
          this.currentEnv.set(name, value);
          return value;
        }
        throw new Error('Invalid increment target');
      case '--':
        if (node.children[0].type === 'Identifier') {
          const name = node.children[0].properties.name;
          const value = this.currentEnv.get(name) - 1;
          this.currentEnv.set(name, value);
          return value;
        }
        throw new Error('Invalid decrement target');
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  }

  evaluateUpdateExpression(node) {
    const operator = node.properties.operator;
    const argument = node.children[0];

    if (argument.type === 'Identifier') {
      const name = argument.properties.name;
      const current = this.currentEnv.get(name);
      
      if (operator === '++') {
        this.currentEnv.set(name, current + 1);
        return node.properties.prefix ? current + 1 : current;
      } else if (operator === '--') {
        this.currentEnv.set(name, current - 1);
        return node.properties.prefix ? current - 1 : current;
      }
    }

    throw new Error('Invalid update target');
  }

  evaluateCallExpression(node) {
    const callee = this.evaluateNode(node.children[0]);
    const args = node.properties.arguments.map(arg => this.evaluateNode(arg));

    if (callee && callee.type === 'builtin') {
      return callee.call(...args);
    } else if (callee && callee.type === 'user') {
      return callee.call(...args);
    } else if (typeof callee === 'function') {
      return callee(...args);
    }

    throw new Error(`Not a function`);
  }

  evaluateMemberExpression(node) {
    const object = this.evaluateNode(node.children[0]);
    const property = node.properties.property;

    if (object && typeof object === 'object') {
      const value = object[property];
      if (typeof value === 'function') {
        return value.bind(object);
      }
      return value;
    }

    return undefined;
  }

  evaluateIndexExpression(node) {
    const array = this.evaluateNode(node.children[0]);
    const index = this.evaluateNode(node.children[1]);
    return array[index];
  }

  evaluateNewExpression(node) {
    const className = node.properties.className;
    const args = node.properties.arguments.map(arg => this.evaluateNode(arg));
    const classInfo = this.currentEnv.getClass(className);

    if (!classInfo) {
      throw new Error(`Class ${className} not found`);
    }

    const instance = {};

    for (const [key, value] of classInfo.properties.entries()) {
      instance[key] = value;
    }

    for (const [key, method] of classInfo.methods.entries()) {
      instance[key] = (...methodArgs) => {
        const methodEnv = new Environment(this.currentEnv);
        methodEnv.define('this', instance);

        for (let i = 0; i < method.params.length; i++) {
          methodEnv.define(method.params[i], methodArgs[i]);
        }

        const prevEnv = this.currentEnv;
        this.currentEnv = methodEnv;

        try {
          this.evaluateNode(method.body);
          this.currentEnv = prevEnv;
          return undefined;
        } catch (error) {
          this.currentEnv = prevEnv;
          if (error.type === 'return') {
            return error.value;
          }
          throw error;
        }
      };
    }

    if (classInfo.methods.has('constructor')) {
      const constructor = classInfo.methods.get('constructor');
      const constructorEnv = new Environment(this.currentEnv);
      constructorEnv.define('this', instance);

      for (let i = 0; i < constructor.params.length; i++) {
        constructorEnv.define(constructor.params[i], args[i]);
      }

      const prevEnv = this.currentEnv;
      this.currentEnv = constructorEnv;

      try {
        this.evaluateNode(constructor.body);
      } catch (error) {
        if (error.type !== 'return') {
          throw error;
        }
      }

      this.currentEnv = prevEnv;
    }

    return instance;
  }

  evaluateArrayExpression(node) {
    return node.properties.elements.map(elem => this.evaluateNode(elem));
  }

  evaluateObjectExpression(node) {
    const obj = {};
    for (const prop of node.properties.properties) {
      obj[prop.key] = this.evaluateNode(prop.value);
    }
    return obj;
  }

  isTruthy(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }

  stringify(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  reset() {
    this.globalEnv = new Environment();
    this.currentEnv = this.globalEnv;
    this.output = [];
    this.setupBuiltins();
  }

  getVariables() {
    const vars = {};
    for (const [key, value] of this.currentEnv.variables.entries()) {
      vars[key] = value;
    }
    return vars;
  }
}

module.exports = { Evaluator, Environment };
