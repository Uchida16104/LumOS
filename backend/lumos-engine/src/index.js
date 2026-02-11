const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Evaluator } = require('./evaluator');
const { Compiler } = require('./compiler');

class LumosEngine {
  constructor() {
    this.lexer = null;
    this.parser = null;
    this.evaluator = new Evaluator();
    this.compiler = new Compiler();
  }

  execute(code) {
    try {
      this.lexer = new Lexer(code);
      const tokens = this.lexer.tokenize();
      
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      const result = this.evaluator.evaluate(ast);
      
      return {
        success: true,
        result: result.result,
        output: result.output,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }

  compileToTarget(code, target) {
    try {
      this.lexer = new Lexer(code);
      const tokens = this.lexer.tokenize();
      
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      const compiled = this.compiler.compile(ast, target);
      
      return {
        success: true,
        compiled: compiled,
        target: target
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }

  tokenize(code) {
    try {
      this.lexer = new Lexer(code);
      const tokens = this.lexer.tokenize();
      
      return {
        success: true,
        tokens: tokens
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }

  parse(code) {
    try {
      this.lexer = new Lexer(code);
      const tokens = this.lexer.tokenize();
      
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      return {
        success: true,
        ast: ast
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }

  getVariables() {
    return this.evaluator.getVariables();
  }

  resetEnvironment() {
    this.evaluator.reset();
  }

  getAvailableTargets() {
    return this.compiler.getAvailableTargets();
  }
}

module.exports = LumosEngine;

if (require.main === module) {
  const engine = new LumosEngine();
  
  console.log('Lumos Language Engine v2.1.0');
  console.log('Available targets:', engine.getAvailableTargets().join(', '));
  
  const testCode = `
    let x = 42
    def greet(name) {
      return "Hello, " + name
    }
    print(greet("World"))
  `;
  
  console.log('\nExecuting test code:');
  const result = engine.execute(testCode);
  console.log('Result:', result);
  
  console.log('\nCompiling to Python:');
  const pythonResult = engine.compileToTarget(testCode, 'python');
  console.log(pythonResult.compiled);
}
