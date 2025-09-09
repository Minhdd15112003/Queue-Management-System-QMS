export namespace types {
	
	export class ExcelData {
	    headers: string[];
	    data: any[];
	    counter: string;
	    totalRows: number;
	
	    static createFrom(source: any = {}) {
	        return new ExcelData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.headers = source["headers"];
	        this.data = source["data"];
	        this.counter = source["counter"];
	        this.totalRows = source["totalRows"];
	    }
	}
	export class ImportResult {
	    success: boolean;
	    data?: any[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new ImportResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = source["data"];
	        this.error = source["error"];
	    }
	}

}

