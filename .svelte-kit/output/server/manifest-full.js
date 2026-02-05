export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DmE2H73B.js",app:"_app/immutable/entry/app.DE95rN4v.js",imports:["_app/immutable/entry/start.DmE2H73B.js","_app/immutable/chunks/D3vsWTgN.js","_app/immutable/chunks/DVK04YKT.js","_app/immutable/chunks/MJYWcbIC.js","_app/immutable/entry/app.DE95rN4v.js","_app/immutable/chunks/DVK04YKT.js","_app/immutable/chunks/B0YXN17V.js","_app/immutable/chunks/7ngLpJeM.js","_app/immutable/chunks/MJYWcbIC.js","_app/immutable/chunks/CeUKV5iP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/salaries",
				pattern: /^\/api\/salaries\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/salaries/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
