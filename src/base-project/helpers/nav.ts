import { dasherize } from "@angular-devkit/core/src/utils/strings";
import ts = require("typescript");

export function generateNavList(interfaceDecls: (ts.InterfaceDeclaration | undefined)[]){
    return `[ ` + interfaceDecls.map(intr => `'${dasherize(intr!.name.text)}'`).join(`,\n`) + `]`
}