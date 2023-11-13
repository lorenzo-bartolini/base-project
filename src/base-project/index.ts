import { Rule, SchematicContext, Tree, apply, chain, mergeWith, strings, template, url } from '@angular-devkit/schematics';
import * as ts from 'typescript'
import { readdirSync } from "fs";
import { generateFormBuilderTemplate, generateFormTemplate } from './helpers/detail';
import { generateColumnsTemplate, generateDisplayedColumnsTemplate } from './helpers/list';

export interface Schema {
  modelPath: string
  name: string
}
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function baseProject(_options: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    
    const pathToModels = _options.modelPath; // Accessing the modelPath parameter
    _context.logger.info(`Using model path: ${pathToModels}`);

    let dirReader = readdirSync(pathToModels)
    let models = dirReader.map(fileName => {

      const pathName = pathToModels + '/' + fileName
      const lang = fileName.split('.')[0]
      console.log(lang);
      return parseInterfaceFromFile(pathName)
    });
    let rules: any[] = []
    for(const model of models){
      _context.logger.info(`Processing: ${model?.name.text}`);

      const templateSource = url('./files/module-components-services');
      const templateRule = apply(templateSource, [
        template({
          name: model!.name.text,
          form: generateFormTemplate(model!),
          displayedColumns: generateDisplayedColumnsTemplate(model!),
          columns: generateColumnsTemplate(model!),
          formBuilder: generateFormBuilderTemplate(model!),
          ...strings
        })
      ])

      rules.push(mergeWith(templateRule))

    }
    _context.logger.info(`adding others`);
    //merging base
    let otherTemplatesSource = url('./files/base')
    rules.push(mergeWith(otherTemplatesSource))
    //merging shared
    otherTemplatesSource = url('./files/shared')
    rules.push(mergeWith(otherTemplatesSource))
    //merging pipes
    otherTemplatesSource = url('./files/pipes')
    rules.push(mergeWith(otherTemplatesSource))
    return chain([...rules])
    
  };
}

function parseInterfaceFromFile(filePath: string): ts.InterfaceDeclaration | undefined {
  // Read the file content
  const fileContent = ts.sys.readFile(filePath);
  if (!fileContent) return;

  // Parse the file content
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  // Look for the first interface declaration in the file
  const interfaceNode = sourceFile.forEachChild(child => {
    if (ts.isInterfaceDeclaration(child)) {
      return child;
    }
  });

  return interfaceNode as ts.InterfaceDeclaration | undefined;
}

