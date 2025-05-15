export type ErrorEntry = {
	code: string;
	field?: string; // for the case of using it as an field error
	message: string;
	statusCode: number;
};

export type FieldError = {
	type: string;
	value: string;
	msg: string;
	path: string;
	location: string;
};

export type FormattedFieldError = {
	path: string;
	messages: string[];
};
