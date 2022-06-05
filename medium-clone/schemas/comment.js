export default {
	name: "comment",
	type: "document",
	title: "Comment",
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			title: "Approved",
			name: "approved",
			type: "boolean",
			description: "Comments wouldn't be displayed unless approved.",
		},
		{
			name: "email",
			type: "string",
		},
		{
			name: "comment",
			type: "string",
		},
		{
			name: "post",
			type: "reference",
			to: [{ type: "post" }],
		},
	],
};
