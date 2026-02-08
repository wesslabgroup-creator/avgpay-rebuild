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
		client: {start:"_app/immutable/entry/start.D48CEc-a.js",app:"_app/immutable/entry/app.DVbAhD_T.js",imports:["_app/immutable/entry/start.D48CEc-a.js","_app/immutable/chunks/C8xHeVE6.js","_app/immutable/chunks/CKEiQQoQ.js","_app/immutable/chunks/CiMh2UvX.js","_app/immutable/entry/app.DVbAhD_T.js","_app/immutable/chunks/CKEiQQoQ.js","_app/immutable/chunks/DxH_EOr7.js","_app/immutable/chunks/M5I39Feb.js","_app/immutable/chunks/CiMh2UvX.js","_app/immutable/chunks/DqGQ8CU-.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
