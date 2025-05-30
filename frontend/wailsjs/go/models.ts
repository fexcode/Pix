export namespace main {
	
	export class ProbJSON {
	    content: string;
	    id: number;
	    // Go type: struct { Preset string "json:\"preset\""; Tests []struct { Input string "json:\"input\""; Outputs []string "json:\"outputs\"" } "json:\"tests\"" }
	    io: any;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new ProbJSON(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.content = source["content"];
	        this.id = source["id"];
	        this.io = this.convertValues(source["io"], Object);
	        this.name = source["name"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UserData {
	    max_probs: number;
	
	    static createFrom(source: any = {}) {
	        return new UserData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.max_probs = source["max_probs"];
	    }
	}

}

