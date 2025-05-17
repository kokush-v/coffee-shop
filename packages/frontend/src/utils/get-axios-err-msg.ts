import { AxiosError } from "axios";
import { IError } from "../types/errors";

export function getAxiosErrMsg(err: Error): string {
	if (err.name === "AxiosError") {
		const axiosError = err as AxiosError<IError>;
		if (axiosError.response) {
			const backendError = axiosError.response.data.detail;
			return backendError;
		}
	}

	return "An unknown error occurred.";
}
