const { Token } = require('./lexer');

class ASTNode {
  constructor(type, value = null, children = []) {
    this.type = type;
    this.value = value;
    this.children = children;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
    this.current = tokens[0];
  }

  parse() {
    const statements = [];
    
    while (this.current.type !== 'EOF') {
      statements.push(this.parseStatement());
    }
    
    return new ASTNode('Program', null, statements);
  }

  advance() {
    this.position++;
    if (this.position < this.tokens.length) {
      this.current = this.tokens[this.position];
    }
    return this.current;
  }

  expect(type, value = null) {
    if (this.current.type !== type || (value !== null && this.current.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ''} but got ${this.current.type} '${this.current.value}' at line ${this.current.line}`);
    }
    const token = this.current;
    this.advance();
    return token;
  }

  parseStatement() {
    if (this.current.type === 'KEYWORD') {
      switch (this.current.value) {
        case 'let':
        case 'const':
          return this.parseVariableDeclaration();
        case 'if':
          return this.parseIfStatement();
        case 'while':
          return this.parseWhileLoop();
        case 'for':
          return this.parseForLoop();
        case 'function':
          return this.parseFunctionDeclaration();
        case 'return':
          return this.parseReturnStatement();
        case 'print':
          return this.parsePrintStatement();
        case 'class':
          return this.parseClassDeclaration();
        case 'import':
          return this.parseImportStatement();
        case 'export':
          return this.parseExportStatement();
        case 'try':
          return this.parseTryCatch();
        case 'throw':
          return this.parseThrowStatement();
      }
    }
    
    return this.parseExpressionStatement();
  }

  parseVariableDeclaration() {
    const keyword = this.current.value;
    this.advance();
    
    const name = this.expect('IDENTIFIER').value;
    this.expect('OPERATOR', '=');
    const value = this.parseExpression();
    
    return new ASTNode('VariableDeclaration', { keyword, name, value });
  }

  parseIfStatement() {
    this.expect('KEYWORD', 'if');
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', '{');
    
    const thenBlock = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      thenBlock.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    let elseBlock = null;
    if (this.current.type === 'KEYWORD' && this.current.value === 'else') {
      this.advance();
      this.expect('PUNCTUATION', '{');
      elseBlock = [];
      while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
        elseBlock.push(this.parseStatement());
      }
      this.expect('PUNCTUATION', '}');
    }
    
    return new ASTNode('IfStatement', { condition, thenBlock, elseBlock });
  }

  parseWhileLoop() {
    this.expect('KEYWORD', 'while');
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', '{');
    
    const body = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    return new ASTNode('WhileLoop', { condition, body });
  }

  parseForLoop() {
    this.expect('KEYWORD', 'for');
    const variable = this.expect('IDENTIFIER').value;
    this.expect('OPERATOR', '=');
    const start = this.parseExpression();
    this.expect('KEYWORD', 'to');
    const end = this.parseExpression();
    this.expect('PUNCTUATION', '{');
    
    const body = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    return new ASTNode('ForLoop', { variable, start, end, body });
  }

  parseFunctionDeclaration() {
    this.expect('KEYWORD', 'function');
    const name = this.expect('IDENTIFIER').value;
    this.expect('PUNCTUATION', '(');
    
    const params = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== ')') {
      params.push(this.expect('IDENTIFIER').value);
      if (this.current.type === 'PUNCTUATION' && this.current.value === ',') {
        this.advance();
      }
    }
    this.expect('PUNCTUATION', ')');
    this.expect('PUNCTUATION', '{');
    
    const body = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    return new ASTNode('FunctionDeclaration', { name, params, body });
  }

  parseReturnStatement() {
    this.expect('KEYWORD', 'return');
    const value = this.current.type !== 'EOF' ? this.parseExpression() : null;
    return new ASTNode('ReturnStatement', { value });
  }

  parsePrintStatement() {
    this.expect('KEYWORD', 'print');
    this.expect('PUNCTUATION', '(');
    const value = this.parseExpression();
    this.expect('PUNCTUATION', ')');
    return new ASTNode('PrintStatement', { value });
  }

  parseClassDeclaration() {
    this.expect('KEYWORD', 'class');
    const name = this.expect('IDENTIFIER').value;
    
    let superClass = null;
    if (this.current.type === 'KEYWORD' && this.current.value === 'extends') {
      this.advance();
      superClass = this.expect('IDENTIFIER').value;
    }
    
    this.expect('PUNCTUATION', '{');
    const methods = [];
    
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      methods.push(this.parseFunctionDeclaration());
    }
    this.expect('PUNCTUATION', '}');
    
    return new ASTNode('ClassDeclaration', { name, superClass, methods });
  }

  parseImportStatement() {
    this.expect('KEYWORD', 'import');
    const imports = [];
    
    if (this.current.type === 'PUNCTUATION' && this.current.value === '{') {
      this.advance();
      while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
        imports.push(this.expect('IDENTIFIER').value);
        if (this.current.type === 'PUNCTUATION' && this.current.value === ',') {
          this.advance();
        }
      }
      this.expect('PUNCTUATION', '}');
    } else {
      imports.push(this.expect('IDENTIFIER').value);
    }
    
    this.expect('KEYWORD', 'from');
    const source = this.expect('STRING').value;
    
    return new ASTNode('ImportStatement', { imports, source });
  }

  parseExportStatement() {
    this.expect('KEYWORD', 'export');
    const statement = this.parseStatement();
    return new ASTNode('ExportStatement', { statement });
  }

  parseTryCatch() {
    this.expect('KEYWORD', 'try');
    this.expect('PUNCTUATION', '{');
    
    const tryBlock = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      tryBlock.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    this.expect('KEYWORD', 'catch');
    this.expect('PUNCTUATION', '(');
    const errorVar = this.expect('IDENTIFIER').value;
    this.expect('PUNCTUATION', ')');
    this.expect('PUNCTUATION', '{');
    
    const catchBlock = [];
    while (this.current.type !== 'PUNCTUATION' || this.current.value !== '}') {
      catchBlock.push(this.parseStatement());
    }
    this.expect('PUNCTUATION', '}');
    
    return new ASTNode('TryCatch', { tryBlock, errorVar, catchBlock });
  }

  parseThrowStatement() {
    this.expect('KEYWORD', 'throw');
    const value = this.parseExpression();
    return new ASTNode('ThrowStatement', { value });
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    return new ASTNode('ExpressionStatement', { expression: expr });
  }

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    
    while (this.current.type === 'KEYWORD' && this.current.value === 'or') {
      this.advance();
      const right = this.parseLogicalAnd();
      left = new ASTNode('BinaryOp', { operator: 'or', left, right });
    }
    
    return left;
  }

  parseLogicalAnd() {
    let left = this.parseComparison();
    
    while (this.current.type === 'KEYWORD' && this.current.value === 'and') {
      this.advance();
      const right = this.parseComparison();
      left = new ASTNode('BinaryOp', { operator: 'and', left, right });
    }
    
    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();
    
    while (this.current.type === 'OPERATOR' && ['==', '!=', '<', '>', '<=', '>='].includes(this.current.value)) {
      const operator = this.current.value;
      this.advance();
      const right = this.parseAdditive();
      left = new ASTNode('BinaryOp', { operator, left, right });
    }
    
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    
    while (this.current.type === 'OPERATOR' && ['+', '-'].includes(this.current.value)) {
      const operator = this.current.value;
      this.advance();
      const right = this.parseMultiplicative();
      left = new ASTNode('BinaryOp', { operator, left, right });
    }
    
    return left;
  }

  parseMultiplicative() {
    let left = this.parsePrimary();
    
    while (this.current.type === 'OPERATOR' && ['*', '/', '%'].includes(this.current.value)) {
      const operator = this.current.value;
      this.advance();
      const right = this.parsePrimary();
      left = new ASTNode('BinaryOp', { operator, left, right });
    }
    
    return left;
  }

  parsePrimary() {
    if (this.current.type === 'NUMBER') {
      const value = this.current.value;
      this.advance();
      return new ASTNode('Number', value);
    }
    
    if (this.current.type === 'STRING') {
      const value = this.current.value;
      this.advance();
      return new ASTNode('String', value);
    }
    
    if (this.current.type === 'KEYWORD' && ['true', 'false'].includes(this.current.value)) {
      const value = this.current.value === 'true';
      this.advance();
      return new ASTNode('Boolean', value);
    }
    
    if (this.current.type === 'KEYWORD' && this.current.value === 'null') {
      this.advance();
      return new ASTNode('Null', null);
    }
    
    if (this.current.type === 'IDENTIFIER') {
      const name = this.current.value;
      this.advance();
      
      if (this.current.type === 'PUNCTUATION' && this.current.value === '(') {
        this.advance();
        const args = [];
        while (this.current.type !== 'PUNCTUATION' || this.current.value !== ')') {
          args.push(this.parseExpression());
          if (this.current.type === 'PUNCTUATION' && this.current.value === ',') {
            this.advance();
          }
        }
        this.expect('PUNCTUATION', ')');
        return new ASTNode('FunctionCall', { name, args });
      }
      
      return new ASTNode('Identifier', name);
    }
    
    if (this.current.type === 'PUNCTUATION' && this.current.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', ')');
      return expr;
    }
    
    throw new Error(`Unexpected token ${this.current.type} '${this.current.value}' at line ${this.current.line}`);
  }
}

module.exports = { Parser, ASTNode };
