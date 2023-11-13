import { camelize, classify } from "@angular-devkit/core/src/utils/strings";
import ts = require("typescript");

export function generateColumnsTemplate(interfaceDecl: ts.InterfaceDeclaration){
    const entityName = interfaceDecl.name.text
    const columns =`
    columns: DatatableColumn<${classify(entityName)}>[] = [`
    + interfaceDecl.members.map(member => {
        if (ts.isPropertySignature(member) && member.type) {
        const columnName = member.name.getText();
        
        return `
            {
                name: '${camelize(columnName)}',
                flex: '1',
                title: this.translate.get('${classify(entityName)}.${classify(columnName)}'),
                value: ${camelize(entityName)} => ${camelize(entityName)}.${camelize(columnName)}
            },
        `
        }
    }).join('\n');

    return columns
}

export function generateDisplayedColumnsTemplate(interfaceDecl: ts.InterfaceDeclaration){
   return `displayedColumns = [`
   + interfaceDecl.members.map(member => {
    if (ts.isPropertySignature(member) && member.type) {
        const columnName = member.name.getText();
        return `'${camelize(columnName)}', `
    }
   })
   +`];` 
}