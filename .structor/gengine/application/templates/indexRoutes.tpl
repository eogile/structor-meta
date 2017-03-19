<% pagesModel.forEach(function(page, index ){ %>import <%= page.pageName %> from './<%= page.pageName %>.js';<%= '\n' %><% }); %>

export default rootRoute = {
	component: <%= pagesModel[0].pageName %>,
	childRoutes: [<% pagesModel.forEach(function( page, index ){ %>
		{
			path: '<%= page.pagePath %>',
			name: '<%= page.pagePath %>',
			component: <%= page.pageName %>
		},<% });  %>
		{
			path: '*',
			name: 'notfound',
			component: <%= pagesModel[0].pageName %>
		},
	],
};
