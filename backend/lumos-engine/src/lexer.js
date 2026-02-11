class Token {
  constructor(type, value, line = 1, column = 1) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize() {
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;

      if (this.isComment()) {
        this.skipComment();
        continue;
      }

      const char = this.currentChar();

      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
      } else if (this.isAlpha(char) || char === '_') {
        this.tokens.push(this.readIdentifier());
      } else if (char === '"' || char === "'") {
        this.tokens.push(this.readString(char));
      } else if (this.isOperator(char)) {
        this.tokens.push(this.readOperator());
      } else {
        this.tokens.push(new Token('SYMBOL', char, this.line, this.column));
        this.advance();
      }
    }

    this.tokens.push(new Token('EOF', null, this.line, this.column));
    return this.tokens;
  }

  currentChar() {
    return this.input[this.position];
  }

  peek(offset = 1) {
    return this.input[this.position + offset] || '';
  }

  advance() {
    if (this.currentChar() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.currentChar())) {
      this.advance();
    }
  }

  isComment() {
    return this.currentChar() === '/' && this.peek() === '/';
  }

  skipComment() {
    while (this.position < this.input.length && this.currentChar() !== '\n') {
      this.advance();
    }
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isAlpha(char) {
    return /[a-zA-Z]/.test(char);
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  isOperator(char) {
    return /[+\-*\/%=<>!&|^~]/.test(char);
  }

  readNumber() {
    const startLine = this.line;
    const startColumn = this.column;
    let numStr = '';
    let hasDecimal = false;

    while (this.position < this.input.length) {
      const char = this.currentChar();
      if (this.isDigit(char)) {
        numStr += char;
        this.advance();
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        numStr += char;
        this.advance();
      } else {
        break;
      }
    }

    return new Token('NUMBER', parseFloat(numStr), startLine, startColumn);
  }

  readIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let identifier = '';

    while (this.position < this.input.length && (this.isAlphaNumeric(this.currentChar()) || this.currentChar() === '_')) {
      identifier += this.currentChar();
      this.advance();
    }

    const keywords = [
      'let', 'const', 'var', 'def', 'class', 'if', 'elsif', 'else',
      'while', 'for', 'to', 'return', 'try', 'catch', 'finally',
      'true', 'false', 'null', 'undefined', 'this', 'new', 'import',
      'export', 'from', 'as', 'async', 'await', 'break', 'continue'
    ];

    const type = keywords.includes(identifier) ? 'KEYWORD' : 'IDENTIFIER';
    return new Token(type, identifier, startLine, startColumn);
  }

  readString(quote) {
    const startLine = this.line;
    const startColumn = this.column;
    let str = '';
    this.advance();

    while (this.position < this.input.length && this.currentChar() !== quote) {
      if (this.currentChar() === '\\') {
        this.advance();
        const escapeChar = this.currentChar();
        switch (escapeChar) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          case '\\': str += '\\'; break;
          case quote: str += quote; break;
          default: str += escapeChar;
        }
        this.advance();
      } else {
        str += this.currentChar();
        this.advance();
      }
    }

    if (this.currentChar() === quote) {
      this.advance();
    }

    return new Token('STRING', str, startLine, startColumn);
  }

  readOperator() {
    const startLine = this.line;
    const startColumn = this.column;
    let op = this.currentChar();
    this.advance();

    const twoCharOps = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '=>'];
    const possibleTwoChar = op + this.currentChar();

    if (twoCharOps.includes(possibleTwoChar)) {
      op = possibleTwoChar;
      this.advance();
    }

    return new Token('OPERATOR', op, startLine, startColumn);
  }
}

module.exports = { Lexer, Token };
