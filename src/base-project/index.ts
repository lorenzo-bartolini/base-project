import { Rule, SchematicContext, SchematicsException, Tree, apply, chain, externalSchematic, mergeWith, move, strings, template, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as ts from 'typescript'
import { readdirSync } from "fs";
import { generateFormBuilderTemplate, generateFormTemplate } from './helpers/detail';
import { generateColumnsTemplate, generateDisplayedColumnsTemplate } from './helpers/list';
import { normalize } from 'path';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { generateNavList } from './helpers/nav';
export const packages = [
  'ngx-toastr',
  '@ngx-translate/core',
  '@ngx-translate/http-loader',
  'ng-block-ui',
  'class-transformer',
  'moment',
  'ngx-mat-select-search',
  'typeorm',
  '@types/node'
]
export interface ModuleImport {
  entityName: string
  name: string
  path: string
}
export interface Schema {
  modelPath: string
  name: string
}
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function baseProject(_options: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const appPath = '/src/app';
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
    let newModuleImports: ModuleImport[] = []
    for (const model of models) {
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
        }),
        move(normalize(appPath))
      ])

      rules.push(mergeWith(templateRule))
      newModuleImports.push({
        entityName: model!.name.text,
        name: `${classify(model!.name.text)}Module`,
        path: `./${dasherize(model!.name.text)}/${dasherize(model!.name.text)}.module`
      })
    }
    addRoutesToAppRoutingModule(tree, newModuleImports)

    newModuleImports.push({
      entityName: 'shared',
      name: 'SharedModule',
      path: './shared/shared.module'
    })
    _context.logger.log('info', `Updating AppModule`)
    addImportsToAppModule(tree, newModuleImports);

    updateTsConfig(tree)
    updateAppComponentHtml(tree)

    _context.logger.info(`adding other files and directories`);
    
    //merging base
    let otherTemplatesSource = url('./files/base')
    let otherTemplatesRule = apply(otherTemplatesSource, [
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))
    //merging framemodule
    otherTemplatesSource = url('./files/frame')
    otherTemplatesRule = apply(otherTemplatesSource, [
      template({
        navList: generateNavList(models),
        ...strings
      }),
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))
    //merging shared
    otherTemplatesSource = url('./files/shared')
    otherTemplatesRule = apply(otherTemplatesSource, [
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))
    //merging pipes
    otherTemplatesSource = url('./files/pipes')
    otherTemplatesRule = apply(otherTemplatesSource, [
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))
    //merging utils
    otherTemplatesSource = url('./files/utils')
    otherTemplatesRule = apply(otherTemplatesSource, [
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))
    //merging environments
    otherTemplatesSource = url('./files/environments')
    otherTemplatesRule = apply(otherTemplatesSource, [
      move(normalize(appPath))
    ])
    rules.push(mergeWith(otherTemplatesRule))

    //installing packages
    const installTasks = packages.map(packageName => {
      return (tree: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask({ packageName }));
      };
    });

    //adding angular-material
    const angularMaterialRule = externalSchematic('@angular/material', 'ng-add', { /* options */ })

    return chain([
      ...rules,
      ...installTasks,
      angularMaterialRule
    ])

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

function addImportsToAppModule(tree: Tree, newModuleImports: ModuleImport[]) {
  // ... Steps 1 to 4 ...
  const appModulePath = 'src/app/app.module.ts'; // Adjust the path if necessary
  const appModuleBuffer = tree.read(appModulePath);
  if (!appModuleBuffer) {
    throw new SchematicsException(`File ${appModulePath} does not exist.`);
  }
  const appModuleContent = appModuleBuffer.toString('utf-8');

  /* const newModuleImports = [
    { name: 'NewModuleName', path: './path/to/new-module/new-module.module' },
    // Add other modules here
  ]; */

  let updatedAppModuleContent = appModuleContent;
  newModuleImports.forEach(moduleImport => {
    const importStatement = `import { ${moduleImport.name} } from '${moduleImport.path}';\n`;
    if (!updatedAppModuleContent.includes(importStatement)) {
      updatedAppModuleContent = importStatement + updatedAppModuleContent;
    }
  });
  updatedAppModuleContent = `import { TranslateLoader, TranslateModule } from '@ngx-translate/core'; \n
  import { TranslateHttpLoader } from '@ngx-translate/http-loader';\n
  import { ToastrModule } from 'ngx-toastr';\n
  import { HttpClient,HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';\n
  import { FrameModule } from './frame/frame.module';\n\n
  
  export function createTranslateLoader(http: HttpClient) {\n
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');\n
  }\n` + updatedAppModuleContent

  const ngModuleDecoratorString = '@NgModule({';
  const importsArrayStartString = 'imports: [';

  const ngModuleDecoratorIndex = updatedAppModuleContent.indexOf(ngModuleDecoratorString);
  if (ngModuleDecoratorIndex === -1) {
    throw new SchematicsException('NgModule not found in AppModule');
  }

  const importsArrayStartIndex = updatedAppModuleContent.indexOf(importsArrayStartString, ngModuleDecoratorIndex);
  if (importsArrayStartIndex === -1) {
    throw new SchematicsException('imports array not found in NgModule');
  }

  const importsArrayEndIndex = updatedAppModuleContent.indexOf(']', importsArrayStartIndex);
  const moduleNamesToAdd = ', \n' + newModuleImports.map(module => module.name).join(', \n')+
  `,\nTranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient]}}), \n
  ToastrModule.forRoot({preventDuplicates: true,progressBar: true,countDuplicates: false, extendedTimeOut: 5000, positionClass: 'toast-top-right',}), \n
  HttpClientModule,\n
  FrameModule,\n`

  updatedAppModuleContent = updatedAppModuleContent.slice(0, importsArrayEndIndex) + moduleNamesToAdd + updatedAppModuleContent.slice(importsArrayEndIndex);

  tree.overwrite(appModulePath, updatedAppModuleContent);


}

function addRoutesToAppRoutingModule(tree: Tree, routesToAdd: ModuleImport[]) {
  const routingModulePath = 'src/app/app-routing.module.ts'; // Adjust the path if necessary
  const routingModuleBuffer = tree.read(routingModulePath);
  if (!routingModuleBuffer) {
    throw new SchematicsException(`File ${routingModulePath} does not exist.`);
  }
  const routingModuleContent = routingModuleBuffer.toString('utf-8');

  let updatedRoutingModuleContent = routingModuleContent;

  // Add route objects
  routesToAdd.forEach(route => {
    const routeObject = `{ path: '${dasherize(route.entityName)}', loadChildren: () => import('${route.path}').then(m => m.${route.name}) },\n`;
    const routesArrayMatch = /const routes: Routes = \[\n?/;

    if (!updatedRoutingModuleContent.includes(routeObject)) {
      updatedRoutingModuleContent = updatedRoutingModuleContent.replace(routesArrayMatch, match => match + routeObject);
    }
  });

  // Write the updated content back to the AppRoutingModule file
  tree.overwrite(routingModulePath, updatedRoutingModuleContent);
}


function updateTsConfig(tree: Tree) {
    const tsConfigPath = '/tsconfig.app.json';
    const buffer = tree.read(tsConfigPath);
    if (!buffer) {
      throw new Error(`Could not read ${tsConfigPath}`);
    }

    const tsConfig = JSON.parse(buffer.toString());

    if (tsConfig.compilerOptions) {
      if (Array.isArray(tsConfig.compilerOptions.types)) {
        // Add 'node' only if it's not already in the array
        if (!tsConfig.compilerOptions.types.includes('node')) {
          tsConfig.compilerOptions.types.push('node');
        }
      } else {
        tsConfig.compilerOptions.types = ['node'];
      }
    } else {
      tsConfig.compilerOptions = { types: ['node'] };
    }

    // Update the file with modified tsConfig
    tree.overwrite(tsConfigPath, JSON.stringify(tsConfig, null, 2));
}

function updateAppComponentHtml(tree: Tree) {
    const filePath = '/src/app/app.component.html';
    const buffer = tree.read(filePath);
    if (!buffer) {
      throw new Error(`Could not read ${filePath}`);
    }
    let content = buffer.toString('utf-8');

    // Append or replace content based on the 'replace' flag
    content = `<app-frame><router-outlet></router-outlet></app-frame>`

    tree.overwrite(filePath, content);
}
