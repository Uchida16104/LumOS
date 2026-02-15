const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Evaluator } = require('./evaluator');
const { Compiler } = require('./compiler');

class Runtime {
  constructor() {
    this.evaluator = new Evaluator();
  }

  execute(code) {
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      const result = this.evaluator.evaluate(ast);
      const output = this.evaluator.getOutput();
      
      this.evaluator.clearOutput();
      
      return {
        success: true,
        result: result,
        output: output,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        result: null,
        output: this.evaluator.getOutput(),
        error: error.message
      };
    }
  }

  compile(code, target = 'python') {
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      const compiler = new Compiler();
      const compiled = compiler.compile(ast, target);
      
      return {
        success: true,
        compiled: compiled,
        target: target,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        compiled: null,
        target: target,
        error: error.message
      };
    }
  }

  analyze(code) {
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      return {
        success: true,
        tokens: tokens.length,
        ast: JSON.stringify(ast, null, 2),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        tokens: 0,
        ast: null,
        error: error.message
      };
    }
  }

  getVersion() {
    return '2.1.0';
  }

  getSupportedTargets() {
    const compiler = new Compiler();
    return compiler.targetLanguages;
  }
}

module.exports = { Runtime };
