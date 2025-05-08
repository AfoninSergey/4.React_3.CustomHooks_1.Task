import { useCallback, useEffect, useState } from 'react';

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
	const [data, setData] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	const  fetchData = useCallback((limit: number = 3) => {
		setIsLoading(true);
		setError(false);
		fetch(`${url}?_limit=${limit}`)
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
				setData(response);
		
			})
			.catch(() => {
				setIsLoading(false);
				setError(true);
			});
	}, [url])

	function refetch(paramsObj: FetchParams) {
		const limit = paramsObj?.params?._limit || 3;
		fetchData(limit)
	}

	useEffect(() => {
		fetchData()
	}, [url, limit, fetchData]);

	return {
		data,
		isLoading,
		error,
		refetch
	};
}
