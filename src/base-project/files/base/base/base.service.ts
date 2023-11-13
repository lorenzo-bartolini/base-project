import { FindManyOptions, FindOneOptions } from "typeorm"
import { LibService } from "./lib.service";

export abstract class BaseService<T>{

  abstract baseApiUrl : string

  constructor(public libService: LibService) { }

  getOneById(id: string){
    return this.libService.getData<T>(this.baseApiUrl, '/' + id);
  }

  getAll(){
    return this.libService.getData<T[]>(this.baseApiUrl,'')
  }

  findOne(options?: FindOneOptions){
    return this.libService.postData<T>(options, this.baseApiUrl, '/findOne')
  }

  findMany(options: FindManyOptions){
    return this.libService.postData<T[]>(options, this.baseApiUrl, '/findMany')
  }

  createOne(item: T){
    return this.libService.postData<T>(item, this.baseApiUrl,'');
  }

  updateOne(item : T, id: string){
    return this.libService.putData<T>(item, this.baseApiUrl, '/' + id);
  }

  deleteOne(id : string){
    return this.libService.deleteData<T>(null, this.baseApiUrl,'/'+ id);
  }

  deleteCascade(item: T){
    return this.libService.deleteData(item, this.baseApiUrl, '/cascade')
  }

}
