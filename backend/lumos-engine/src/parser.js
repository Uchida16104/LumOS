class ASTNode {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
    this.children = [];
    this.properties = {};
  }

  addChild(node) {
    this.children.push(node);
    return this;
  }

  setProperty(key, value) {
    this.properties[key] = value;
    return this;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    const program = new ASTNode('Program');
    
    while (!this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        program.addChild(statement);
      }
    }
    
    return program;
  }

  parseStatement() {
    const token = this.currentToken();
    
    if (!token || token.type === 'EOF') {
      return null;
    }

    if (token.type === 'KEYWORD') {
      switch (token.value) {
        case 'let':
        case 'const':
        case 'var':
          return this.parseVariableDeclaration();
        case 'def':
          return this.parseFunctionDeclaration();
        case 'class':
          return this.parseClassDeclaration();
        case 'if':
          return this.parseIfStatement();
        case 'while':
          return this.parseWhileStatement();
        case 'for':
          return this.parseForStatement();
        case 'return':
          return this.parseReturnStatement();
        case 'try':
          return this.parseTryStatement();
        case 'import':
          return this.parseImportStatement();
        case 'export':
          return this.parseExportStatement();
        case 'break':
          this.advance();
          return new ASTNode('BreakStatement');
        case 'continue':
          this.advance();
          return new ASTNode('ContinueStatement');
        default:
          return this.parseExpressionStatement();
      }
    }

    return this.parseExpressionStatement();
  }

  parseVariableDeclaration() {
    const node = new ASTNode('VariableDeclaration');
    const kind = this.currentToken().value;
    node.setProperty('kind', kind);
    this.advance();

    const identifier = this.expect('IDENTIFIER').value;
    node.setProperty('identifier', identifier);

    if (this.match('OPERATOR', '=')) {
      this.advance();
      const init = this.parseExpression();
      node.addChild(init);
    }

    return node;
  }

  parseFunctionDeclaration() {
    const node = new ASTNode('FunctionDeclaration');
    this.advance();

    const name = this.expect('IDENTIFIER').value;
    node.setProperty('name', name);

    this.expect('SYMBOL', '(');
    const params = [];
    
    while (!this.match('SYMBOL', ')')) {
      params.push(this.expect('IDENTIFIER').value);
      if (this.match('SYMBOL', ',')) {
        this.advance();
      }
    }
    
    this.expect('SYMBOL', ')');
    node.setProperty('params', params);

    this.expect('SYMBOL', '{');
    const body = new ASTNode('BlockStatement');
    
    while (!this.match('SYMBOL', '}')) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.addChild(stmt);
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(body);

    return node;
  }

  parseClassDeclaration() {
    const node = new ASTNode('ClassDeclaration');
    this.advance();

    const name = this.expect('IDENTIFIER').value;
    node.setProperty('name', name);

    this.expect('SYMBOL', '{');
    const body = new ASTNode('ClassBody');
    
    while (!this.match('SYMBOL', '}')) {
      if (this.match('KEYWORD', 'def')) {
        body.addChild(this.parseFunctionDeclaration());
      } else if (this.match('KEYWORD', 'let') || this.match('KEYWORD', 'var')) {
        body.addChild(this.parseVariableDeclaration());
      } else {
        this.advance();
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(body);

    return node;
  }

  parseIfStatement() {
    const node = new ASTNode('IfStatement');
    this.advance();

    this.expect('SYMBOL', '(');
    const test = this.parseExpression();
    this.expect('SYMBOL', ')');
    node.addChild(test);

    this.expect('SYMBOL', '{');
    const consequent = new ASTNode('BlockStatement');
    
    while (!this.match('SYMBOL', '}')) {
      const stmt = this.parseStatement();
      if (stmt) {
        consequent.addChild(stmt);
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(consequent);

    if (this.match('KEYWORD', 'elsif') || this.match('KEYWORD', 'else')) {
      const elseToken = this.currentToken().value;
      this.advance();

      if (elseToken === 'elsif') {
        this.position--;
        const alternate = this.parseIfStatement();
        node.addChild(alternate);
      } else {
        this.expect('SYMBOL', '{');
        const alternate = new ASTNode('BlockStatement');
        
        while (!this.match('SYMBOL', '}')) {
          const stmt = this.parseStatement();
          if (stmt) {
            alternate.addChild(stmt);
          }
        }
        
        this.expect('SYMBOL', '}');
        node.addChild(alternate);
      }
    }

    return node;
  }

  parseWhileStatement() {
    const node = new ASTNode('WhileStatement');
    this.advance();

    this.expect('SYMBOL', '(');
    const test = this.parseExpression();
    this.expect('SYMBOL', ')');
    node.addChild(test);

    this.expect('SYMBOL', '{');
    const body = new ASTNode('BlockStatement');
    
    while (!this.match('SYMBOL', '}')) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.addChild(stmt);
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(body);

    return node;
  }

  parseForStatement() {
    const node = new ASTNode('ForStatement');
    this.advance();

    const iterator = this.expect('IDENTIFIER').value;
    node.setProperty('iterator', iterator);

    this.expect('OPERATOR', '=');
    const start = this.parseExpression();
    node.addChild(start);

    this.expect('KEYWORD', 'to');
    const end = this.parseExpression();
    node.addChild(end);

    this.expect('SYMBOL', '{');
    const body = new ASTNode('BlockStatement');
    
    while (!this.match('SYMBOL', '}')) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.addChild(stmt);
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(body);

    return node;
  }

  parseReturnStatement() {
    const node = new ASTNode('ReturnStatement');
    this.advance();

    if (!this.isAtEnd() && this.currentToken().type !== 'SYMBOL') {
      const argument = this.parseExpression();
      node.addChild(argument);
    }

    return node;
  }

  parseTryStatement() {
    const node = new ASTNode('TryStatement');
    this.advance();

    this.expect('SYMBOL', '{');
    const tryBlock = new ASTNode('BlockStatement');
    
    while (!this.match('SYMBOL', '}')) {
      const stmt = this.parseStatement();
      if (stmt) {
        tryBlock.addChild(stmt);
      }
    }
    
    this.expect('SYMBOL', '}');
    node.addChild(tryBlock);

    if (this.match('KEYWORD', 'catch')) {
      this.advance();
      this.expect('SYMBOL', '(');
      const param = this.expect('IDENTIFIER').value;
      this.expect('SYMBOL', ')');
      
      this.expect('SYMBOL', '{');
      const catchBlock = new ASTNode('CatchClause');
      catchBlock.setProperty('param', param);
      
      while (!this.match('SYMBOL', '}')) {
        const stmt = this.parseStatement();
        if (stmt) {
          catchBlock.addChild(stmt);
        }
      }
      
      this.expect('SYMBOL', '}');
      node.addChild(catchBlock);
    }

    if (this.match('KEYWORD', 'finally')) {
      this.advance();
      this.expect('SYMBOL', '{');
      const finallyBlock = new ASTNode('BlockStatement');
      
      while (!this.match('SYMBOL', '}')) {
        const stmt = this.parseStatement();
        if (stmt) {
          finallyBlock.addChild(stmt);
        }
      }
      
      this.expect('SYMBOL', '}');
      node.setProperty('finally', finallyBlock);
    }

    return node;
  }

  parseImportStatement() {
    const node = new ASTNode('ImportStatement');
    this.advance();

    const specifiers = [];
    
    if (this.match('SYMBOL', '{')) {
      this.advance();
      while (!this.match('SYMBOL', '}')) {
        specifiers.push(this.expect('IDENTIFIER').value);
        if (this.match('SYMBOL', ',')) {
          this.advance();
        }
      }
      this.expect('SYMBOL', '}');
    } else {
      specifiers.push(this.expect('IDENTIFIER').value);
    }

    node.setProperty('specifiers', specifiers);

    this.expect('KEYWORD', 'from');
    const source = this.expect('STRING').value;
    node.setProperty('source', source);

    return node;
  }

  parseExportStatement() {
    const node = new ASTNode('ExportStatement');
    this.advance();

    const declaration = this.parseStatement();
    node.addChild(declaration);

    return node;
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    return new ASTNode('ExpressionStatement').addChild(expr);
  }

  parseExpression() {
    return this.parseAssignment();
  }

  parseAssignment() {
    const expr = this.parseLogicalOr();

    if (this.match('OPERATOR', '=') || this.match('OPERATOR', '+=') || 
        this.match('OPERATOR', '-=') || this.match('OPERATOR', '*=') || 
        this.match('OPERATOR', '/=')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseAssignment();
      const node = new ASTNode('AssignmentExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      return node;
    }

    return expr;
  }

  parseLogicalOr() {
    let expr = this.parseLogicalAnd();

    while (this.match('OPERATOR', '||')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseLogicalAnd();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseLogicalAnd() {
    let expr = this.parseEquality();

    while (this.match('OPERATOR', '&&')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseEquality();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseEquality() {
    let expr = this.parseComparison();

    while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseComparison();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseComparison() {
    let expr = this.parseAdditive();

    while (this.match('OPERATOR', '<') || this.match('OPERATOR', '>') || 
           this.match('OPERATOR', '<=') || this.match('OPERATOR', '>=')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseAdditive();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseAdditive() {
    let expr = this.parseMultiplicative();

    while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseMultiplicative();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseMultiplicative() {
    let expr = this.parseUnary();

    while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/') || this.match('OPERATOR', '%')) {
      const operator = this.currentToken().value;
      this.advance();
      const right = this.parseUnary();
      const node = new ASTNode('BinaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      node.addChild(right);
      expr = node;
    }

    return expr;
  }

  parseUnary() {
    if (this.match('OPERATOR', '-') || this.match('OPERATOR', '!') || 
        this.match('OPERATOR', '++') || this.match('OPERATOR', '--')) {
      const operator = this.currentToken().value;
      this.advance();
      const expr = this.parseUnary();
      const node = new ASTNode('UnaryExpression');
      node.setProperty('operator', operator);
      node.addChild(expr);
      return node;
    }

    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parseCallExpression();

    if (this.match('OPERATOR', '++') || this.match('OPERATOR', '--')) {
      const operator = this.currentToken().value;
      this.advance();
      const node = new ASTNode('UpdateExpression');
      node.setProperty('operator', operator);
      node.setProperty('prefix', false);
      node.addChild(expr);
      return node;
    }

    return expr;
  }

  parseCallExpression() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match('SYMBOL', '(')) {
        this.advance();
        const args = [];
        
        while (!this.match('SYMBOL', ')')) {
          args.push(this.parseExpression());
          if (this.match('SYMBOL', ',')) {
            this.advance();
          }
        }
        
        this.expect('SYMBOL', ')');
        const node = new ASTNode('CallExpression');
        node.addChild(expr);
        node.setProperty('arguments', args);
        expr = node;
      } else if (this.match('SYMBOL', '.')) {
        this.advance();
        const property = this.expect('IDENTIFIER').value;
        const node = new ASTNode('MemberExpression');
        node.addChild(expr);
        node.setProperty('property', property);
        expr = node;
      } else if (this.match('SYMBOL', '[')) {
        this.advance();
        const index = this.parseExpression();
        this.expect('SYMBOL', ']');
        const node = new ASTNode('IndexExpression');
        node.addChild(expr);
        node.addChild(index);
        expr = node;
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    const token = this.currentToken();

    if (token.type === 'NUMBER') {
      this.advance();
      return new ASTNode('Literal').setProperty('value', token.value).setProperty('dataType', 'number');
    }

    if (token.type === 'STRING') {
      this.advance();
      return new ASTNode('Literal').setProperty('value', token.value).setProperty('dataType', 'string');
    }

    if (token.type === 'KEYWORD') {
      if (token.value === 'true' || token.value === 'false') {
        this.advance();
        return new ASTNode('Literal').setProperty('value', token.value === 'true').setProperty('dataType', 'boolean');
      }
      if (token.value === 'null') {
        this.advance();
        return new ASTNode('Literal').setProperty('value', null).setProperty('dataType', 'null');
      }
      if (token.value === 'this') {
        this.advance();
        return new ASTNode('ThisExpression');
      }
      if (token.value === 'new') {
        this.advance();
        const className = this.expect('IDENTIFIER').value;
        this.expect('SYMBOL', '(');
        const args = [];
        
        while (!this.match('SYMBOL', ')')) {
          args.push(this.parseExpression());
          if (this.match('SYMBOL', ',')) {
            this.advance();
          }
        }
        
        this.expect('SYMBOL', ')');
        const node = new ASTNode('NewExpression');
        node.setProperty('className', className);
        node.setProperty('arguments', args);
        return node;
      }
    }

    if (token.type === 'IDENTIFIER') {
      this.advance();
      return new ASTNode('Identifier').setProperty('name', token.value);
    }

    if (this.match('SYMBOL', '(')) {
      this.advance();
      const expr = this.parseExpression();
      this.expect('SYMBOL', ')');
      return expr;
    }

    if (this.match('SYMBOL', '[')) {
      this.advance();
      const elements = [];
      
      while (!this.match('SYMBOL', ']')) {
        elements.push(this.parseExpression());
        if (this.match('SYMBOL', ',')) {
          this.advance();
        }
      }
      
      this.expect('SYMBOL', ']');
      return new ASTNode('ArrayExpression').setProperty('elements', elements);
    }

    if (this.match('SYMBOL', '{')) {
      this.advance();
      const properties = [];
      
      while (!this.match('SYMBOL', '}')) {
        const key = this.expect('IDENTIFIER').value;
        this.expect('SYMBOL', ':');
        const value = this.parseExpression();
        properties.push({ key, value });
        
        if (this.match('SYMBOL', ',')) {
          this.advance();
        }
      }
      
      this.expect('SYMBOL', '}');
      return new ASTNode('ObjectExpression').setProperty('properties', properties);
    }

    throw new Error(`Unexpected token: ${token.type} ${token.value} at line ${token.line}, column ${token.column}`);
  }

  currentToken() {
    return this.tokens[this.position];
  }

  advance() {
    this.position++;
    return this.currentToken();
  }

  match(type, value = null) {
    const token = this.currentToken();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== null && token.value !== value) return false;
    return true;
  }

  expect(type, value = null) {
    const token = this.currentToken();
    
    if (!token) {
      throw new Error(`Expected ${type} ${value || ''}, but got end of input`);
    }
    
    if (token.type !== type) {
      throw new Error(`Expected ${type}, but got ${token.type} at line ${token.line}, column ${token.column}`);
    }
    
    if (value !== null && token.value !== value) {
      throw new Error(`Expected ${value}, but got ${token.value} at line ${token.line}, column ${token.column}`);
    }
    
    this.advance();
    return token;
  }

  isAtEnd() {
    return this.currentToken() && this.currentToken().type === 'EOF';
  }
}

module.exports = { Parser, ASTNode };
