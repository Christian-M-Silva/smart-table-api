export default {
	path: __dirname + "/../",
	title: "Smart-table", // use info instead
	version: "1.0.0", // use info instead
	description: "Documentação da API utilizada na smart-table", // use info instead
	tagIndex: 2,
	snakeCase: true,
	debug: false, // set to true, to get some useful debug output
	ignore: ["/swagger", "/docs", "uploads"],
	preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
	common: {
	  parameters: {}, // OpenAPI conform parameters that are commonly used
	  headers: {}, // OpenAPI conform headers that are commonly used
	},
	authMiddlewares: ["auth"], // optional
	securitySchemes: {
		ApiKeyAuth: {
		  type: "apiKey",
		  in: "header",
		  name: "Authorization",
		}
	  },
	defaultSecurityScheme: "ApiKeyAuth", // optional
	persistAuthorization: true,
	showFullPath: false, // the path displayed after endpoint summary
};