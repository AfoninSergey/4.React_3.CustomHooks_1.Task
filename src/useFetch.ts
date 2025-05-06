import { useEffect, useState } from 'react';

interface FetchParams {
	params: { _limit: number };
}

interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

export function useFetch(url: string, limit: number = 3) {
	const [dataFromServer, setDataFromServer] = useState<Post[]>([]);
	const [data, setData] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	function refetch(paramsObj: FetchParams) {
		if (!dataFromServer.length) return;
		const limit = paramsObj?.params?._limit || 3;

		setData(dataFromServer.slice(currentIndex, currentIndex + limit));

		if (dataFromServer.length - currentIndex - limit > 0) {
			setCurrentIndex((prev) => prev + limit);
		} else {
			setCurrentIndex(0);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		setError(false);
		fetch(url)
			.then((responseJson) => {
				if (!responseJson.ok) {
					setIsLoading(false);
					setError(true);
					return;
				}
				return responseJson.json();
			})
			.then((response) => {
				setIsLoading(false);
				setError(false);
				setDataFromServer(response);
				setData(response.slice(0, limit));
				if (response.length > limit) {
					setCurrentIndex(limit);
				}
			})
			.catch(() => {
				setIsLoading(false);
				setError(true);
			});
	}, [url, limit]);

	return {
		data,
		isLoading,
		error,
		refetch
	};
}
