const fs = require('fs');
const path = require('path');
const { Runtime } = require('../core/runtime');

class FileRunner {
  constructor() {
    this.runtime = new Runtime();
  }

  run(filepath, options = {}) {
    try {
      if (!fs.existsSync(filepath)) {
        throw new Error(`File not found: ${filepath}`);
      }

      const code = fs.readFileSync(filepath, 'utf-8');
      
      if (options.compile) {
        return this.compileFile(code, options.target || 'python', filepath);
      }
      
      return this.executeFile(code, filepath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  executeFile(code, filepath) {
    console.log(`Executing: ${filepath}\n`);
    
    const result = this.runtime.execute(code);
    
    if (result.success) {
      if (result.output) {
        console.log(result.output);
      }
      return {
        success: true,
        output: result.output
      };
    } else {
      console.error(`Error: ${result.error}`);
      return {
        success: false,
        error: result.error
      };
    }
  }

  compileFile(code, target, filepath) {
    console.log(`Compiling ${filepath} to ${target}...\n`);
    
    const result = this.runtime.compile(code, target);
    
    if (result.success) {
      console.log(result.compiled);
      
      if (target === 'python') {
        return this.saveCompiledFile(filepath, result.compiled, 'py');
      } else if (target === 'javascript') {
        return this.saveCompiledFile(filepath, result.compiled, 'js');
      } else if (target === 'rust') {
        return this.saveCompiledFile(filepath, result.compiled, 'rs');
      } else if (target === 'go') {
        return this.saveCompiledFile(filepath, result.compiled, 'go');
      } else if (target === 'java') {
        return this.saveCompiledFile(filepath, result.compiled, 'java');
      } else if (target === 'cpp') {
        return this.saveCompiledFile(filepath, result.compiled, 'cpp');
      } else {
        return this.saveCompiledFile(filepath, result.compiled, target);
      }
    } else {
      console.error(`Compilation error: ${result.error}`);
      return {
        success: false,
        error: result.error
      };
    }
  }

  saveCompiledFile(originalPath, compiledCode, extension) {
    const dir = path.dirname(originalPath);
    const basename = path.basename(originalPath, path.extname(originalPath));
    const outputPath = path.join(dir, `${basename}_compiled.${extension}`);
    
    try {
      fs.writeFileSync(outputPath, compiledCode, 'utf-8');
      console.log(`\nSaved to: ${outputPath}`);
      return {
        success: true,
        outputPath: outputPath
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save file: ${error.message}`
      };
    }
  }

  analyze(filepath) {
    try {
      if (!fs.existsSync(filepath)) {
        throw new Error(`File not found: ${filepath}`);
      }

      const code = fs.readFileSync(filepath, 'utf-8');
      const result = this.runtime.analyze(code);
      
      if (result.success) {
        console.log(`File: ${filepath}`);
        console.log(`Tokens: ${result.tokens}`);
        console.log(`\nAST:\n${result.ast}`);
        return result;
      } else {
        console.error(`Analysis error: ${result.error}`);
        return result;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = { FileRunner };
