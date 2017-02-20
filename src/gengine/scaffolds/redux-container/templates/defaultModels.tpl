<% if(metadata.hasChildrenIncluded) { %>
[]
<%} else { %>
<%
    var defaultModel = Object.assign({}, model);
    defaultModel.type = componentName;
    delete defaultModel.props;
%>
[
<%= JSON.stringify(defaultModel, null, 4)%>
]
<%}%>
